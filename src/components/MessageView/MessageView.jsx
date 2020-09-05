import style from './style';

import {Component, createRef} from 'preact';
import {connect} from 'unistore/preact';

import MessageList from '../MessageList/MessageList';
import MessageViewScrollbar from './MessageViewScrollbar';

const CHUNK_SIZE = 50;
const MAX_MESSAGES = 100;
const SLACK_SPACE = 100;

// eslint-disable-next-line no-unused-vars
const timer = ms => new Promise(resolve => {
	setTimeout(resolve, ms);
});

class MessageView extends Component {
	constructor (props) {
		super(props);

		this.state = {
			start: 0,
			end: 50,
			scrollStart: 0,
			scrollEnd: 0
		};

		this.viewElem = createRef();

		this.loadMoreFromTop = this.loadMoreFromTop.bind(this);
		this.loadMoreFromBottom = this.loadMoreFromBottom.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.setNewStart = this.setNewStart.bind(this);
		this.setNewEnd = this.setNewEnd.bind(this);
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
		this.setState(state => {
			const newStart = Math.max(state.start - CHUNK_SIZE, 0);
			return {
				start: newStart
			};
		});
	}

	loadMoreFromBottom () {
		this.setState((state, props) => {
			const newEnd = Math.min(state.end + CHUNK_SIZE, props.messages.length - 1);
			return {
				end: newEnd
			};
		});
	}

	setNewStart (start) {
		this.setState((state, props) => {
			start = Math.min(props.messages.length - 1, Math.max(start, 0));

			this.setState({
				start,
				end: Math.min(start + CHUNK_SIZE, props.messages.length)
			});
		});
	}

	setNewEnd (end) {
		this.setState((state, props) => {
			end = Math.min(props.messages.length - 1, Math.max(end, 0));

			this.setState({
				start: Math.max(0, end - CHUNK_SIZE),
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
			this.setState(state => {
				return {
					end: Math.min(state.end, state.start + MAX_MESSAGES)
				};
			});
		} else if (prevState.end !== this.state.end) {
			this.setState(state => {
				return {
					start: Math.max(state.start, state.end - MAX_MESSAGES)
				};
			});
		}
	}


	render () {
		const {props} = this;

		const atStart = this.state.start === 0;
		const atEnd = this.state.end === props.messages.length - 1;

		const chunks = [];
		const end = Math.min(this.state.end, props.messages.length - 1);
		for (let i = this.state.start; i <= end; i += CHUNK_SIZE) {
			chunks.push(
				<MessageList
					key={props.messages[i].id}
					messages={props.messages}
					start={i}
					end={Math.min(i + CHUNK_SIZE, end + 1)}
				/>
			);
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
