<template>
	<ul class="channel-list">
		<li
			v-for="channel in channelHierarchy"
			:key="channel.channel.id"
		>
			<div
				:class="{
					channel: true,
					'text-channel': channel.channel.type === 'text',
					'voice-channel': channel.channel.type === 'voice',
					'category-channel': channel.channel.type === 'category',
					selected: $store.state.activeChannelId === channel.channel.id}"
				@click="handleClick(channel.channel)"
			>
				<span class="channel-name">{{ channel.channel.name }}</span>
			</div>
			<channel-sublist
				v-if="channel.childChannels.length !== 0"
				:channel-hierarchy="channel.childChannels"
			/>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'ChannelSublist',
	props: {
		'channelHierarchy': {
			type: Array, required: true
		}
	},
	data: function () {
		return {};
	},
	methods: {
		handleClick (channel) {
			switch (channel.type) {
				case 'text': {
					this.$store.commit('setActiveChannel', channel.id);
					break;
				}
				case 'category': {
					// TODO
					break;
				}
				default: break;
			}
		}
	}
};
</script>
