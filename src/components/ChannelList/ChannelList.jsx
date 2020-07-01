import './style';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

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
		this.props.store.setState({currentChannel: this.props.channel.channel.id});
	}

	render () {
		const channel = this.props.channel;
		return (
			<li>
				<div
					className={classNames({
						channel: true,
						'text-channel': channel.channel.type === 'text',
						'voice-channel': channel.channel.type === 'voice',
						'category-channel': channel.channel.type === 'category',
						selected: channel.channel.id === this.props.currentChannel
					})}

					onClick = {channel.channel.type === 'category' ? this.toggleCollapse : this.selectChannel}
				>{channel.channel.name}</div>
				{channel.childChannels.length > 0 ?
					<ChannelSublist childChannels={channel.childChannels} collapsed={this.state.collapsed} /> :
					null
				}
			</li>
		);
	}
}

const ChannelItem = connect(['currentChannel'])(_ChannelItem);

const ChannelSublist = props => <ul className={classNames({
	'channel-list': true,
	'collapsed': props.collapsed
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
