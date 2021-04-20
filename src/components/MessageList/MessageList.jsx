import style from './style';

import {Component} from 'preact';
import {connect} from 'unistore/preact';
import {memo} from 'preact/compat';

import Attachment from '../Attachment/Attachment';
import Avatar from '../Avatar/Avatar';
import Markdown from '../Markdown/Markdown';
import Tooltip from '../Tooltip/Tooltip';

import setUserInfoID from '../../actions/set-user-info-id';

import getMemberName from '../../util/get-member-name';
import getMemberColor from '../../util/member-role-color';
import formatTimestamp from '../../util/format-timestamp';
import classNames from '../../util/class-names';

class Edited extends Component {
	constructor (props) {
		super(props);

		this.state = {
			stayOpen: false
		};

		this.toggleStayOpen = this.toggleStayOpen.bind(this);
	}

	toggleStayOpen () {
		this.setState(prevState => {
			return {
				stayOpen: !prevState.stayOpen
			};
		});
	}

	render () {
		return (
			<span className={classNames({
				[style['edited']]: true,
				[style['open']]: this.state.stayOpen,
				[style['closed']]: !this.state.stayOpen
			})}>
				<span onClick={this.toggleStayOpen}>(edited)</span>
				<Tooltip className={style['edited-date']}>{formatTimestamp(this.props.timestamp)}</Tooltip>
			</span>
		);
	}
}

const MessageContents = ({message}) => (
	<div className={style.message} key={message.id}>
		<div className={style['message-content']}>
			<span><Markdown text={message.content} /></span>
			{message.editedTimestamp ?
				<Edited timestamp={message.editedTimestamp}></Edited> :
				null
			}
		</div>
		{message.attachments === null ? null : message.attachments.map((attachment, index) =>
			<Attachment
				key={index}
				attachment={attachment}
			/>
		)}
	</div>
);

const MessageList = props => {
	const messageComponents = [];

	const {messages, message, start, end} = props;

	let firstMessage;
	if (messages) {
		if (messages.length === 0) return null;
		for (let i = start; i < end; i++) {
			messageComponents.push(<MessageContents message={messages[i]} />);
		}
		firstMessage = messages[start];
	} else {
		messageComponents.push(<MessageContents message={message} />);
		firstMessage = message;
	}

	return (
		<div className={style['message-list']}>
			<div className={style['message-avatar']}>
				<Avatar
					user={props.archive.users.get(firstMessage.authorID)}
					size={32}
					userID={firstMessage.authorID}
				/>
			</div>
			<div className={style['message-right']}>
				<div className={style['message-header']}>
					<div
						className={style['message-poster']}
						style={`color: ${getMemberColor(firstMessage.authorID, props.archive)}`}
						onClick={() => props.setUserInfoID(firstMessage.authorID)}
					>
						{getMemberName(firstMessage.authorID, props.archive)}
					</div>
					<div className={style['message-timestamp']}>
						{formatTimestamp(firstMessage.createdTimestamp)}
					</div>
				</div>
				<div className={style['message-bodies']}>
					{messageComponents}
				</div>
			</div>
		</div>
	);
};

export default connect(['archive'], {setUserInfoID})(memo(MessageList));
