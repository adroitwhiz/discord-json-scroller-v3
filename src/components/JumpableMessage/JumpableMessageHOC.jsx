import {Component} from 'preact';
import {connect} from 'unistore/preact';

import setChannelScrollState from '../../actions/set-channel-scroll-state';
import setCurrentChannel from '../../actions/set-current-channel';

const JumpableMessageHOC = WrappedComponent => {
	return connect(['archive', 'currentChannel'], {setChannelScrollState, setCurrentChannel})(
		class JumpableMessage extends Component {
			constructor (props) {
				super(props);

				this.jumpToMessage = this.jumpToMessage.bind(this);
			}

			jumpToMessage (messageID, messageChannel = this.props.currentChannel) {
				if (messageChannel !== this.props.currentChannel) {
					this.props.setCurrentChannel(messageChannel);
				}

				const messageIndex = this.props.archive.channels.get(messageChannel).messages.findIndex(
					message => message.id === messageID);
		
				this.props.setChannelScrollState(messageChannel, messageIndex - 25, messageIndex + 25);
			}

			render () {
				return <WrappedComponent jumpToMessage={this.jumpToMessage} {...this.props} />;
			}
		}
	);
};

export default JumpableMessageHOC;
