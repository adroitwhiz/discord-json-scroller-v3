<template>
	<div
		id="find-panel"
		:class="{'flex-col': true, collapsed: !visible}"
	>
		<div
			id="find-controls"
			class="flex-row"
		>
			<div>
				<label>
					<input
						v-model="filterByText"
						type="checkbox"
					>
					<span> Contains text: </span>
				</label>
				<input
					v-model="textFilter"
					type="text"
				>
			</div>
			<div>
				<label>
					<input
						v-model="filterByUser"
						type="checkbox"
					>
					<span> From user (name or ID): </span>
				</label>
				<input
					v-model="userFilter"
					type="text"
				>
			</div>
			<div>
				<label>
					<input
						v-model="filterByChannel"
						type="checkbox"
					>
					<span> From channel: </span>
				</label>
				<select v-model="channelFilter">
					<option
						v-for="channel in server.channels.values()"
						:key="channel.id"
						:value="channel.id"
					>
						{{ channel.name }}
					</option>
				</select>
			</div>
			<div>
				<button
					@click="searchMessages"
				>
					Find
				</button>
			</div>
		</div>
		<message-list :messages="foundMessages" />
		<div
			id="find-toggle"
			@click="visible = !visible"
		>
			🔍
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex';

import MessageList from './MessageList';

export default {
	name: 'FindPanel',
	components: {MessageList},
	props: [],
	data: () => {
		return {
			filterByText: false,
			filterByUser: false,
			filterByChannel: false,
			textFilter: '',
			userFilter: '',
			channelFilter: '',
			visible: false,
			foundMessages: []
		};
	},
	computed: {
		...mapState(['server'])
	},
	methods: {
		searchMessages () {
			const MAX_MESSAGES = 10000;
			let allMessages = [];
			const channels = this.server.channels;
			for (const [id, channel] of channels) {
				if (
					channel.type !== 'text' ||
					(this.filterByChannel && this.channelFilter !== channel.id)
				) continue;

				let messages = channel.messages;

				if (this.filterByText) {
					const matchText = this.textFilter.toLowerCase();
					messages = messages.filter(message => message.content.toLowerCase().includes(matchText));
				}

				const userFilter = this.userFilter.toLowerCase();
				const members = this.server.members;
				if (this.filterByUser) {
					messages = messages.filter(message => {
						if (message.authorID === userFilter) return true;

						if (!members.has(message.authorID)) return false;
						const memberUser = members.get(message.authorID).user;

						if (typeof memberUser === 'undefined') return false;
						return (
							members.has(message.authorID) &&
							memberUser.username.toLowerCase() === userFilter
						);
					});
				}

				allMessages = allMessages.concat(messages);
			}

			if (allMessages.length > MAX_MESSAGES) {
				alert(`More than ${MAX_MESSAGES} messages found. Not displaying results.`);
				return;
			}

			this.foundMessages = allMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
		}
	}
};
</script>
