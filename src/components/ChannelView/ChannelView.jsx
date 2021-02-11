import style from './style';

import {Component} from 'preact';

import Header from '../Header/Header';
import MessageView from '../MessageView/MessageView';

export default class ChannelView extends Component {
	render () {
		const channel = this.props.channel;
		return (
			<div className={style['channel-view']}>
				<Header channel={channel} />
				{
					channel ?
						<MessageView key={channel.id} messages={channel.messages} /> :
						null
				}
			</div>
		);
	}
}
