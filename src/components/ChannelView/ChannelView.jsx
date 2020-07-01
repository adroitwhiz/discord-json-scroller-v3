import './style';

import {Component} from 'preact';

import MessageView from '../MessageView/MessageView';

export default class ChannelView extends Component {
	render () {
		const channel = this.props.channel;
		return (
			<div className="channel-view">{
				channel ?
					<>
						<div className="channel-header">
							<div className="channel-name">{channel.name}</div>
							<div className="channel-topic">{channel.topic}</div>
						</div>
						<MessageView key={channel.id} messages={channel.messages} />
					</> : null
			}</div>
		);
	}
}
