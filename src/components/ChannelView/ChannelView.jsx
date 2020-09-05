import style from './style';

import {Component} from 'preact';

import MessageView from '../MessageView/MessageView';

export default class ChannelView extends Component {
	render () {
		const channel = this.props.channel;
		return (
			<div className={style['channel-view']}>{
				channel ?
					<>
						<div className={style['channel-header']}>
							<div className={style['channel-name']}>{channel.name}</div>
							<div className={style['channel-topic']}>{channel.topic}</div>
						</div>
						<MessageView key={channel.id} messages={channel.messages} />
					</> : null
			}</div>
		);
	}
}
