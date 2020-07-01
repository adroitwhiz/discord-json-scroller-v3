import './style';

import {Component, createRef} from 'preact';
import {connect} from 'unistore/preact';

const getUsername = (archive, message) => {
	const authorID = message.authorID;

	const member = archive.members.get(authorID);
	if (member && member.nickname !== null) return member.nickname;

	const user = archive.users.get(authorID);
	if (user && user.username !== 'Deleted User') return user.username;

	return `<@${authorID}>`;
};

class MessageList extends Component {
	constructor (props) {
		super(props);
	}

	measure (msgIndex) {
		return this.messageRefs[msgIndex].current.getBoundingClientRect();
	}

	render () {
		const messageComponents = [];
		this.props.messageRefs.length = 0;

		const {messages, start, end} = this.props;

		for (let i = start; i < end; i++) {
			const message = messages[i];
			this.props.messageRefs.push(createRef());
			messageComponents.push(
				<div className="message" key={message.id} ref={this.props.messageRefs[i - start]}>
					<div className="message-header">
						<div className="message-poster">{getUsername(this.props.archive, message)}</div>
						<div className="message-timestamp">{new Date(message.createdTimestamp).toISOString()}</div>
						<div className="message-id">{message.id}</div>
					</div>
					<div className="message-body">
						<div className="message-content">{message.content}</div>
					</div>
				</div>
			);
		}

		return <div className="message-list" ref={this.props.elem}>{messageComponents}</div>;
	}
}

/*const MessageList = props => {
	const messageComponents = [];

	const {messages, start, end} = props;

	for (let i = start; i < end; i++) {
		const message = messages[i];
		messageComponents.push(
			<div className="message" key={message.id}>
				<div className="message-header">
					<div className="message-poster">{getUsername(props.archive, message)}</div>
					<div className="message-timestamp">{new Date(message.createdTimestamp).toISOString()}</div>
					<div className="message-id">{message.id}</div>
				</div>
				<div className="message-body">
					<div className="message-content">{message.content}</div>
				</div>
			</div>
		);
	}

	return <div className="message-list" ref={props.elem}>{messageComponents}</div>;
};*/

export default connect(['archive'])(MessageList);
