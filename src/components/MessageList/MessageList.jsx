import style from './style';

import {connect} from 'unistore/preact';

const getUsername = (archive, message) => {
	const authorID = message.authorID;

	const member = archive.members.get(authorID);
	if (member && member.nickname !== null) return member.nickname;

	const user = archive.users.get(authorID);
	if (user && user.username !== 'Deleted User') return user.username;

	return `<@${authorID}>`;
};

const MessageList = props => {
	const messageComponents = [];

	const {messages, start, end} = props;

	for (let i = start; i < end; i++) {
		const message = messages[i];
		messageComponents.push(
			<div className={style.message} key={message.id}>
				<div className={style['message-header']}>
					<div className={style['message-poster']}>{getUsername(props.archive, message)}</div>
					<div className={style['message-timestamp']}>{new Date(message.createdTimestamp).toISOString()}</div>
					<div className={style['message-id']}>{message.id}</div>
				</div>
				<div className={style['message-body']}>
					<div className={style['message-content']}>{message.content}</div>
				</div>
			</div>
		);
	}

	return <div className={style['message-list']}>{messageComponents}</div>;
};

export default connect(['archive'])(MessageList);
