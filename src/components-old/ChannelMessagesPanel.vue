<template>
	<div class="flex-expand flex-shrink flex-col">
		<div class="flex-row flex-collapse">
			<div id="navigation">
				<div class="nav-section">
					<span>From</span>
					<input
						v-model.number="renderRangeMin"
						type="number"
					>
					<span>message(s) back, to</span>
					<input
						v-model.number="renderRangeMax"
						type="number"
					>
					<span>message(s) back</span>
					<button @click="renderMessages">
						Render
					</button>
				</div>
				<hr>
				<div class="nav-section">
					<span>Jump to message w/ ID</span>
					<input
						v-model="messageJumpId"
						type="text"
					>
					<span>with</span>
					<input
						v-model.number="messageJumpContextAmount"
						type="number"
					>
					<span>surrounding message(s)</span>
					<button @click="jumpMessages">
						Jump
					</button>
				</div>
			</div>
		</div>

		<message-list
			:messages="messages"
			@scroll="handleScroll($event)"
		/>
	</div>
</template>

<script>
const NUM_SCROLL_BATCH_MESSAGES = 50;

import {mapState} from 'vuex';

import MessageList from './MessageList';

export default {
	name: 'ChannelMessagesPanel',
	components: {MessageList},
	data: () => {
		return {
			renderRangeMin: 1,
			renderRangeMax: 10,
			messageJumpId: '',
			messageJumpContextAmount: 1,
			messages: [],
			numMessagesInCurrentChannel: 0
		};
	},
	computed: {
		...mapState(['server'])
	},

	methods: {
		renderMessages () {
			const currentChannel = this.server.channels.get(this.$store.state.activeChannelId);
			const messagesToRender = currentChannel.messages.slice(
				Math.max(currentChannel.messages.length - this.renderRangeMax, 0),
				currentChannel.messages.length - (this.renderRangeMin - 1)
			);

			this.numMessagesInCurrentChannel = currentChannel.messages.length;

			this.messages = messagesToRender;
		},
		jumpMessages () {
			const jumpID = this.messageJumpId;

			let messageIndex;
			let messageChannel;
			const channels = this.server.channels;
			for (const [id, channel] of channels) {
				messageIndex = channel.messages.findIndex(message => message.id === jumpID);
				if (messageIndex !== -1) {
					messageChannel = channel;
					break;
				}
			}

			if (messageIndex === -1) return;

			const currentChannel = this.server.channels.get(messageChannel.id);
			messageIndex = currentChannel.messages.length - messageIndex;

			const messageJumpContext = this.messageJumpContextAmount;

			this.$store.commit('setActiveChannel', messageChannel.id);
			this.renderRangeMin = messageIndex - messageJumpContext;
			this.renderRangeMax = messageIndex + messageJumpContext;

			this.renderMessages();
		},
		handleScroll: function (event) {
			const target = event.target;
			if (target.scrollTop === 0) {
				const oldHeight = target.scrollHeight;

				this.renderRangeMax = Math.min(
					this.numMessagesInCurrentChannel,
					this.renderRangeMax + NUM_SCROLL_BATCH_MESSAGES
				);
				// this.renderRangeMin = Math.max(1, this.renderRangeMax - NUM_SCROLL_BATCH_MESSAGES);
				this.renderMessages();

				this.$nextTick(() => {
					// Wait one tick for scrollHeight to update
					target.scrollTop -= oldHeight - target.scrollHeight;
				});
			}

			if (target.scrollTop - (target.scrollHeight - target.clientHeight) === 0) {
				this.renderRangeMin = Math.max(1, this.renderRangeMin - NUM_SCROLL_BATCH_MESSAGES);
				/* this.renderRangeMax = Math.min(
					this.numMessagesInCurrentChannel,
					this.renderRangeMin + NUM_SCROLL_BATCH_MESSAGES
				); */
				this.renderMessages();
			}
		}
	}
};
</script>
