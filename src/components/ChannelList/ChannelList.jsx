import style from './style';
import icons from '../../icons/icons';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

import setCurrentChannel from '../../actions/set-current-channel';

import classNames from '../../util/class-names';

// Un-flatten a channel hierarchy.
function crawlHierarchy (parent, parentID, channels) {
	for (const channel of channels.values()) {
		if (channel.parentID === parentID) {
			parent.push({
				channel: channel,
				childChannels: crawlHierarchy([], channel.id, channels)
			});
		}
	}

	parent.sort((a, b) => {
		let chanAPosition = a.channel.position;
		let chanBPosition = b.channel.position;

		// for some odd reason, categories and channels positioned above the first category
		// both have position index of 0. offset category indices by 1 to compensate.
		if (a.channel.type === 'category') chanAPosition++;
		if (b.channel.type === 'category') chanBPosition++;

		return chanAPosition - chanBPosition;
	});

	return parent;
}

class _ChannelItem extends Component {
	constructor (props) {
		super(props);
		this.state = {
			collapsed: false
		};

		this.toggleCollapse = this.toggleCollapse.bind(this);
		this.selectChannel = this.selectChannel.bind(this);
	}

	toggleCollapse () {
		this.setState({collapsed: !this.state.collapsed});
	}

	selectChannel () {
		if (this.props.channel.channel.type !== 'text') return;
		this.props.setCurrentChannel(this.props.channel.channel.id);
	}

	render () {
		const channel = this.props.channel;
		return (
			<li>
				<div
					className={classNames({
						[style['channel']]: true,
						[style['text-channel']]: channel.channel.type === 'text',
						[style['voice-channel']]: channel.channel.type === 'voice',
						[style['category-channel']]: channel.channel.type === 'category',
						[style['selected']]: channel.channel.id === this.props.currentChannel
					})}

					onClick = {channel.channel.type === 'category' ? this.toggleCollapse : this.selectChannel}
				>
					<div className={classNames({
						[style['channel-icon']]: true,
						[icons['icon']]: true,
						[icons['text-channel']]: channel.channel.type === 'text',
						[icons['voice-channel']]: channel.channel.type === 'voice',
						[icons['category-channel-open']]: channel.channel.type === 'category' && !this.state.collapsed,
						[icons['category-channel-closed']]: channel.channel.type === 'category' && this.state.collapsed
					})}></div>
					<div className={style['channel-name']}>{channel.channel.name}</div>
				</div>
				{channel.childChannels.length > 0 ?
					<ChannelSublist childChannels={channel.childChannels} collapsed={this.state.collapsed} /> :
					null
				}
			</li>
		);
	}
}

const ChannelItem = connect(['currentChannel'], {setCurrentChannel})(_ChannelItem);

const ChannelSublist = props => <ul className={classNames({
	[style['channel-list']]: true,
	[style['collapsed']]: props.collapsed
})}>
	{
		props.childChannels.map(channel =>
			<ChannelItem key={channel.channel.id} channel={channel} />
		)
	}
</ul>;

const ChannelList = props => {
	if (props.channels === null) return null;
	return <ChannelSublist childChannels={crawlHierarchy([], null, props.channels)} />;
};

export default ChannelList;
