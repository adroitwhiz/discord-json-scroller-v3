import style from './style';

import {Component, createRef} from 'preact';
import {connect} from 'unistore/preact';

import MessageList from '../MessageList/MessageList';
import MessageViewScrollbar from './MessageViewScrollbar';

const CHUNK_SIZE = 50;
const MAX_MESSAGES = 200;
const SLACK_SPACE = 100;

// eslint-disable-next-line no-unused-vars
const timer = ms => new Promise(resolve => {
	setTimeout(resolve, ms);
});

class MessageView extends Component {
	constructor (props) {
		super(props);

		this.viewElem = createRef();

		this.loadMoreFromTop = this.loadMoreFromTop.bind(this);
		this.loadMoreFromBottom = this.loadMoreFromBottom.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.setNewStart = this.setNewStart.bind(this);
		this.setNewEnd = this.setNewEnd.bind(this);

		this.fixupMessageStart = this.fixupMessageStart.bind(this);
		this.fixupMessageEnd = this.fixupMessageEnd.bind(this);

		this.state = {
			start: 0,
			end: this.fixupMessageEnd(50, props),
			scrollStart: 0,
			scrollEnd: 0
		};
	}

	fixupMessageStart (start, props) {
		// Clamp within valid message range
		let fixed = Math.max(0, Math.min(start, props.messages.length - 1));
		if (props.messages.length === 0) return fixed;

		const startUser = props.messages[fixed].authorID;

		// Extend so that all messages in "string" from that user are visible
		while (fixed > 0 && props.messages[fixed - 1].authorID === startUser) {
			fixed--;
		}

		return fixed;
	}

	fixupMessageEnd (end, props) {
		// Clamp within valid message range
		let fixed = Math.max(0, Math.min(end, props.messages.length - 1));
		if (props.messages.length === 0) return fixed;

		const startUser = props.messages[fixed].authorID;

		// Extend so that all messages in "string" from that user are visible
		while (fixed < props.messages.length - 1 && props.messages[fixed + 1].authorID === startUser) {
			fixed++;
		}

		return fixed;
	}

	handleScroll (e) {
		const currentView = this.viewElem.current;
		const atBottom =
			(currentView.scrollHeight - currentView.clientHeight) - currentView.scrollTop < SLACK_SPACE;
		const atTop = currentView.scrollTop < SLACK_SPACE;

		if (atTop && this.state.start > 0) {
			this.loadMoreFromTop();
		} else if (atBottom && this.state.end < (this.props.messages.length - 1)) {
			this.loadMoreFromBottom();
			e.preventDefault();
		}
	}

	loadMoreFromTop () {
		// We don't adjust the end position here because that would mess up the scrolling adjustment.
		// Messages are removed from the bottom in componentDidUpdate after the scroll has been adjusted.
		this.setState((state, props) => {
			return {
				start: this.fixupMessageStart(state.start - CHUNK_SIZE, props)
			};
		});
	}

	loadMoreFromBottom () {
		this.setState((state, props) => {
			return {
				end: this.fixupMessageEnd(state.end + CHUNK_SIZE, props)
			};
		});
	}

	setNewStart (start) {
		this.setState((state, props) => {
			start = this.fixupMessageStart(start, props);

			this.setState({
				start,
				end: this.fixupMessageEnd(start + CHUNK_SIZE, props)
			});
		});
	}

	setNewEnd (end) {
		this.setState((state, props) => {
			end = this.fixupMessageEnd(end, props);

			this.setState({
				start: this.fixupMessageStart(end - CHUNK_SIZE, props),
				end
			});
		});
	}

	getSnapshotBeforeUpdate (prevProps, prevState) {
		// When adding messages at the top, maintain scroll position.
		if (this.state.start !== prevState.start) {
			const list = this.viewElem.current;
			return list.scrollHeight - list.scrollTop;
		}
		return null;
	}

	componentDidUpdate (prevProps, prevState, snapshot) {
		if (snapshot !== null) {
			const list = this.viewElem.current;
			list.scrollTop = list.scrollHeight - snapshot;

			// Now that we've properly positioned the top of the message list according to its bottom, we can trim old
			// messages of the bottom of the list.
			this.setState((state, props) => {
				return {
					end: this.fixupMessageEnd(Math.min(state.end, state.start + MAX_MESSAGES), props)
				};
			});
		} else if (prevState.end !== this.state.end) {
			this.setState((state, props) => {
				return {
					start: this.fixupMessageStart(Math.max(state.start, state.end - MAX_MESSAGES), props)
				};
			});
		}
	}


	render () {
		const {props} = this;

		const atStart = this.state.start === 0;
		const atEnd = this.state.end === props.messages.length - 1;

		const chunks = [];
		const {end} = this.state;

		if (props.messages.length > 0) {
			// there is probably at least one off-by-one error in here
			let currentChunkStart, currentChunkAuthor;
			let i = this.state.start;
			while (i <= end) {
				currentChunkStart = i;
				currentChunkAuthor = props.messages[i].authorID;


				while ((i > end || props.messages[i].authorID === currentChunkAuthor) && i <= end) {
					i++;
				}

				chunks.push(
					<MessageList
						key={props.messages[currentChunkStart].id}
						messages={props.messages}
						start={currentChunkStart}
						end={i}
					/>
				);
			}
		}

		return (
			<div className={style['messages-container']}>
				<div className={style.messages} ref={this.viewElem} onScroll={this.handleScroll}>
					{atStart ?
						null :
						<div className="load-more"><button onClick={this.loadMoreFromTop}>Load more</button></div>}
					{chunks}
					{atEnd ?
						null :
						<div className="load-more"><button onClick={this.loadMoreFromBottom}>Load more</button></div>}
				</div>
				<MessageViewScrollbar
					totalMessages={this.props.messages.length}
					start={this.state.start}
					end={end}
					setNewStart={this.setNewStart}
					setNewEnd={this.setNewEnd}
				/>
			</div>
		);
	}
}

export default connect(['currentChannel', 'channelScrollState'])(MessageView);
