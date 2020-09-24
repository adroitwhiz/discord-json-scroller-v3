import style from './style';

import {connect} from 'unistore/preact';
import {memo} from 'preact/compat';

import Attachment from './Attachment';

import getMemberColor from '../../util/member-role-color';

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

	if (messages.length === 0) return null;

	for (let i = start; i < end; i++) {
		const message = messages[i];
		messageComponents.push(
			<div className={style.message} key={message.id}>
				<div className={style['message-body']}>
					<div className={style['message-content']}>{message.content}</div>
				</div>
				{message.attachments.length === 0 ? null : message.attachments.map((attachment, index) =>
					<Attachment
						key={index}
						attachment={attachment}
					/>
				)}
			</div>
		);
	}

	return (
		<div className={style['message-list']}>
			<div className={style['message-header']}>
				<div
					className={style['message-poster']}
					style={`color: ${getMemberColor(messages[start].authorID, props.archive)}`}
				>
					{getUsername(props.archive, messages[start])}
				</div>
				<div className={style['message-timestamp']}>
					{new Date(messages[start].createdTimestamp).toISOString()}
				</div>
			</div>
			<div className={style['message-bodies']}>
				{messageComponents}
			</div>
		</div>
	);
};

export default connect(['archive'])(memo(MessageList));
