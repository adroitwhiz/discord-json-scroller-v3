import style from './style';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

import MessageList from '../MessageList/MessageList';

import setChannelScrollState from '../../actions/set-channel-scroll-state';
import setCurrentChannel from '../../actions/set-current-channel';

class JumpableMessage extends Component {
	jumpToMessage (messageID, messageChannel) {
		if (messageChannel !== this.props.currentChannel) {
			this.props.setCurrentChannel(messageChannel);
		}

		const messageIndex = this.props.archive.channels.get(messageChannel).messages.findIndex(
			message => message.id === messageID);

		this.props.setChannelScrollState(messageChannel, messageIndex - 25, messageIndex + 25);
	}

	render () {
		const {index, messages, channelID} = this.props;
		return (
			<div
				className={style['jumpable-message']}
				onClick={this.jumpToMessage.bind(this, messages[index].id, channelID)}
			>
				<MessageList
					start={index}
					end={index + 1}
					messages={messages}
				/>
				<div className={style['jump']}>
					Jump
				</div>
			</div>
		);
	}
}

export default connect('archive', {setChannelScrollState, setCurrentChannel})(JumpableMessage);
