import './style';

import {Component, createRef} from 'preact';
import {connect} from 'unistore/preact';

import MessageList from '../MessageList/MessageList';
import MessageViewScrollbar from './MessageViewScrollbar';

import throttle from 'lodash.throttle';

const CHUNK_SIZE = 50;

const SLACK_SPACE = 150;

// eslint-disable-next-line no-unused-vars
const timer = ms => new Promise(resolve => {
	setTimeout(resolve, ms);
});

class MessageView extends Component {
	constructor (props) {
		super(props);

		this.state = {
			chunks: [],
			start: 30,
			end: 30,
			scrollStart: 0,
			scrollEnd: 0
		};

		this.viewElem = createRef();

		this.handleScroll = throttle(this.handleScroll.bind(this), 250);
	}

	async _updateChunks () {
		// This relies on shouldComponentUpdate not causing this to enter an infinite loop,
		// but everything needs to be inside setState to avoid race conditions :(
		this.setState((state, props) => {
			const currentView = this.viewElem.current;

			const atBottom =
				(currentView.scrollHeight - currentView.clientHeight) - currentView.scrollTop < SLACK_SPACE;
			const atTop = currentView.scrollTop < SLACK_SPACE;
			const unpopulated = currentView.scrollHeight <= currentView.clientHeight;

			const moreMessagesAtTop = state.start > 0;
			const moreMessagesAtBottom = state.end < props.messages.length - 1;

			const addChunkAtBottom = (atBottom || unpopulated) && moreMessagesAtBottom;
			const addChunkAtTop = atTop && moreMessagesAtTop && !unpopulated;

			const viewportRect = currentView.getBoundingClientRect();
			const viewportTop = viewportRect.top;
			const viewportBottom = viewportRect.bottom;

			// Remove any out-of-view chunks from the top
			let removeChunksFromTop = 0;
			while (removeChunksFromTop < state.chunks.length) {
				const chunk = state.chunks[removeChunksFromTop];
				const chunkRect = chunk.props.elem.current.getBoundingClientRect();
				if ((chunkRect.bottom + SLACK_SPACE) < viewportTop) {
					removeChunksFromTop++;
				} else {
					break;
				}
			}

			// Remove any out-of-view chunks from the bottom
			let removeChunksFromBottom = 0;
			while (removeChunksFromBottom < state.chunks.length) {
				const chunk = state.chunks[state.chunks.length - removeChunksFromBottom - 1];
				const chunkRect = chunk.props.elem.current.getBoundingClientRect();
				if ((chunkRect.top - SLACK_SPACE) > viewportBottom) {
					removeChunksFromBottom++;
				} else {
					break;
				}
			}

			const chunksChanged = addChunkAtBottom ||
				addChunkAtTop ||
				removeChunksFromTop > 0 ||
				removeChunksFromBottom > 0;

			if (!chunksChanged) {
				let chunkIntersectingViewportTop = 0;
				while (chunkIntersectingViewportTop < state.chunks.length) {
					const chunkRect =
						state.chunks[chunkIntersectingViewportTop].props.elem.current.getBoundingClientRect();
					if (chunkRect.bottom >= viewportTop) break;
					chunkIntersectingViewportTop++;
				}

				const topChunk = this.state.chunks[chunkIntersectingViewportTop];

				let messageIntersectingViewportTop = 0;
				while (messageIntersectingViewportTop < topChunk.props.messageRefs.length) {
					const messageRect =
						topChunk.props.messageRefs[messageIntersectingViewportTop].current.getBoundingClientRect();
					if (messageRect.bottom >= viewportTop) break;
					messageIntersectingViewportTop++;
				}

				let chunkIntersectingViewportBottom = state.chunks.length - 1;
				while (chunkIntersectingViewportBottom >= 0) {
					const chunkRect =
						state.chunks[chunkIntersectingViewportBottom].props.elem.current.getBoundingClientRect();
					if (chunkRect.top <= viewportBottom) break;
					chunkIntersectingViewportBottom--;
				}

				const bottomChunk = this.state.chunks[chunkIntersectingViewportBottom];

				let messageIntersectingViewportBottom = bottomChunk.props.messageRefs.length - 1;
				while (messageIntersectingViewportBottom >= 0) {
					const messageRect =
						bottomChunk.props.messageRefs[messageIntersectingViewportBottom].current
							.getBoundingClientRect();
					if (messageRect.top <= viewportBottom) break;
					messageIntersectingViewportBottom--;
				}

				return {
					scrollStart: messageIntersectingViewportTop + topChunk.props.start,
					scrollEnd: messageIntersectingViewportBottom + bottomChunk.props.start
				};
			}

			let {start, end} = state;
			const chunks = state.chunks.slice(0);

			if (addChunkAtTop) {
				const chunkStart = Math.max(0, start - CHUNK_SIZE);
				const chunkEnd = start;
				start = chunkStart;

				if (chunkStart === chunkEnd) throw new Error('empty chunk-- this should not happen');

				const elem = createRef();

				const newChunk = <MessageList
					key={chunkStart}
					messages={props.messages}
					start={chunkStart}
					end={chunkEnd}
					elem={elem}
					messageRefs={[]}
				/>;

				chunks.unshift(newChunk);
			} else if (removeChunksFromTop) {
				chunks.splice(0, removeChunksFromTop);
				start += CHUNK_SIZE * removeChunksFromTop;
			} else if (addChunkAtBottom) {
				// We can't add and remove chunks at the same time because it breaks the scroll offset algorithm
				const chunkStart = end;
				const chunkEnd = Math.min(chunkStart + CHUNK_SIZE, props.messages.length - 1);
				end = chunkEnd;

				if (chunkStart === chunkEnd) throw new Error('empty chunk-- this should not happen');

				const elem = createRef();

				const newChunk = <MessageList
					key={chunkStart}
					messages={props.messages}
					start={chunkStart}
					end={chunkEnd}
					elem={elem}
					messageRefs={[]}
				/>;

				chunks.push(newChunk);
			} else if (removeChunksFromBottom) {
				chunks.splice(state.chunks.length - removeChunksFromBottom, removeChunksFromBottom);
				end -= CHUNK_SIZE * removeChunksFromBottom;
			}

			return {start, end, chunks};
		});
	}

	shouldComponentUpdate (nextProps, nextState) {
		return nextProps.currentChannel !== this.props.currentChannel ||
			nextProps.channelScrollState !== this.props.channelScrollState ||
			nextState.start !== this.state.start ||
			nextState.end !== this.state.end ||
			nextState.chunks !== this.state.chunks ||
			nextState.scrollStart !== this.state.scrollStart ||
			nextState.scrollEnd !== this.state.scrollEnd;
	}

	getSnapshotBeforeUpdate (prevProps, prevState) {
		console.log('starts', prevState.start, this.state.start);
		if (prevState.start === this.state.start) return null;
		const currentView = this.viewElem.current;
		const scrollOffset = currentView.scrollHeight - currentView.scrollTop;
		return scrollOffset;
	}

	componentDidUpdate (prevProps, prevState, snapshot) {
		if (snapshot) {
			//console.log(snapshot);
			console.log('adjusting scroll top to', this.viewElem.current.scrollHeight - snapshot, snapshot);
			this.viewElem.current.scrollTop = this.viewElem.current.scrollHeight - snapshot;
		}
		this._updateChunks();
	}

	async componentDidMount () {
		console.log('component did mount');
		//this._addChunk(true);
		//for (let i = 0; i < 5; i++) await this._addChunk(true);
		this._updateChunks();
	}

	handleScroll () {
		this._updateChunks();
	}

	render () {
		return (
			<div className="messages-container">
				<div className="messages" ref={this.viewElem} onScroll={this.handleScroll}>
					{this.state.chunks}
				</div>
				<MessageViewScrollbar
					totalMessages={this.props.messages.length}
					start={this.state.scrollStart}
					end={this.state.scrollEnd}
				/>
			</div>
		);
	}
}

export default connect(['currentChannel', 'channelScrollState'])(MessageView);
