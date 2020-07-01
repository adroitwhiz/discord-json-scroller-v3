import style from './style';

import {Component, createRef} from 'preact';
import {connect} from 'unistore/preact';

import MessageList from '../MessageList/MessageList';
import MessageViewScrollbar from './MessageViewScrollbar';

const CHUNK_SIZE = 50;

const MAX_MESSAGES = 100;

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
	}

	loadMoreFromTop () {
		this.setState(state => {
			const newStart = Math.max(state.start - CHUNK_SIZE, 0);
			return {
				start: newStart,
				end: Math.min(state.end, newStart + MAX_MESSAGES)
			};
		});
	}

	loadMoreFromBottom () {
		this.setState((state, props) => {
			const newEnd = Math.min(state.end + CHUNK_SIZE, props.messages.length - 1);
			return {
				start: Math.max(state.start, newEnd - MAX_MESSAGES),
				end: newEnd
			};
		});
	}

	render () {
		const {props} = this;

		const atStart = this.state.start === 0;
		const atEnd = this.state.end === props.messages.length - 1;

		const chunks = [];
		const end = Math.min(this.state.end, props.messages.length);
		for (let i = this.state.start; i < end; i += CHUNK_SIZE) {
			chunks.push(
				<MessageList
					key={props.messages[i].id}
					messages={props.messages}
					start={i}
					end={i + CHUNK_SIZE}
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
					end={this.state.end}
				/>
			</div>
		);
	}
}

export default connect(['currentChannel', 'channelScrollState'])(MessageView);
