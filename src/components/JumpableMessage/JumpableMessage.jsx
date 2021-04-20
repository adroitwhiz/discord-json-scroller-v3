import style from './style';

import MessageList from '../MessageList/MessageList';
import JumpableMessageHOC from './JumpableMessageHOC';

const JumpableMessage = JumpableMessageHOC(props => {
	const {message, channelID, jumpToMessage} = props;
	return (
		<div
			className={style['jumpable-message']}
			onClick={jumpToMessage.bind(this, message.id, channelID)}
		>
			<MessageList message={message}/>
			<div className={style['jump']}>
				Jump
			</div>
		</div>
	);
});


export {JumpableMessageHOC};

export default JumpableMessage;
