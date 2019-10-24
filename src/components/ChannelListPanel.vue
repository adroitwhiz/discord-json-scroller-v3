<template>
	<div
		id="channels-panel"
		class="flex-col"
	>
		<p id="channel-list-header">
			Channels:
		</p>
		<channel-sublist :channel-hierarchy="channelHierarchy" />
	</div>
</template>

<script>
import {mapState} from 'vuex';

// Un-flatten a channel hierarchy.
function crawlHierarchy (parent, parentID, channels) {
	for (const [id, channel] of channels) {
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

import ChannelSublist from './ChannelSublist';

export default {
	name: 'ChannelList',
	components: {ChannelSublist},
	data: function () {
		return {};
	},
	computed: {
		channelHierarchy () {
			return crawlHierarchy([], null, this.server.channels);
		},
		...mapState(['server'])
	},

	methods: {}
};
</script>
