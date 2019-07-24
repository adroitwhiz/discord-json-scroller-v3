const readJSONFromFile = file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('load', event => {
			resolve(JSON.parse(event.target.result));
		});

		reader.readAsText(file);
	});
}

// Convert URLs into clickable links via Linkify.
const vueLinkify = (element, binding) => {
	element = linkifyElement(element, binding.value);
}
Vue.directive('linkified', vueLinkify);

document.addEventListener('DOMContentLoaded', event => {
	const app = new Vue({
		el:'#app',
		data:{
			server: {channels: [], members: []},
			messages: [],
			foundMessages: [],
			activeChannelId: null,
			navigationData: {
				renderRangeMin: 1,
				renderRangeMax: 10,
				messageJumpId: '',
				messageJumpContextAmount: 1,
			},
			searchFilterData: {
				filterByText: false,
				filterByUser: false,
				filterByChannel: false,
				textFilter: '',
				userFilter: '',
				channelFilter: ''
			},
			findPanelVisible: false
		},
		methods: {
			setChannel (channelId) {
				activeChannel = this.server.channels[channelId];
				this.activeChannelId = channelId;
			},
			formatMessages (messages) {
				return messages.reverse().map(message => {
					return {
						text:message.content,
						attachments:message.attachments,
						username:this.server.members.hasOwnProperty(message.author) ? this.server.members[message.author].username : `<@${message.author}>`,
						timestamp:moment(parseInt(message.createdTimestamp)).format('MMM D Y h:mm:ss A'),
						isEdited:message.editedTimestamp !== null,
						index:message.id
					}
				});
			},
			displayMessages (messages) {
				formattedMessages = this.formatMessages(messages);
				Object.freeze(formattedMessages);
				this.messages = formattedMessages;
			},
			renderMessages () {
				const currentChannel = this.server.channels[this.activeChannelId];
				const messagesToRender = currentChannel.messages.slice(
					parseInt(this.navigationData.renderRangeMin),
					parseInt(this.navigationData.renderRangeMax + 1)
				);

				this.displayMessages(messagesToRender);
			},
			jumpMessages () {
				const jumpID = this.navigationData.messageJumpId;

				let messageIndex;
				let messageChannel;
				for (const channel of Object.values(this.server.channels)) {
					messageIndex = channel.messages.findIndex(message => message.id === jumpID);
					if (messageIndex !== -1) {
						messageChannel = channel;
						break;
					}
				}
		
				if (messageIndex === -1) return;
		
				let messageJumpContext = this.navigationData.messageJumpContextAmount;
				let messagesToRender = messageChannel.messages.slice(Math.max(0, messageIndex-messageJumpContext), messageIndex+messageJumpContext+1);

				this.setChannel(messageChannel.id);
				this.displayMessages(messagesToRender);
			},
			searchMessages () {
				const MAX_MESSAGES = 10000;
				let allMessages = [];
				for (const channel of Object.values(this.server.channels)) {
					if (this.searchFilterData.filterByChannel && this.searchFilterData.channelFilter !== channel.id) continue;
					let messages = channel.messages;

					if (this.searchFilterData.filterByText) {
						const matchText = this.searchFilterData.textFilter.toLowerCase();
						messages = messages.filter(message => message.content.toLowerCase().includes(matchText));
					}
	
					if (this.searchFilterData.filterByUser) {
						messages = messages.filter(message => message.author === userFilter || this.server.members[message.author].username === userFilter);
					}

					allMessages = allMessages.concat(messages);
				}

				if (allMessages.length > MAX_MESSAGES) {
					alert(`More than ${MAX_MESSAGES} messages found. Not displaying results.`);
					return;
				}

				this.foundMessages = this.formatMessages(allMessages).sort((a, b) => a.timestamp - b.timestamp);
			},
			loadJSONFromFile (event) {
				const jsonFile = event.target.files[0];
				if (jsonFile) {
					readJSONFromFile(jsonFile).then(this.loadServer);
				}
			},
			loadServer (serializedServer) {
				const channels = {};
				for (const channel of serializedServer.channels) {
					// Messages are read-only. Freezing them stops Vue from trying to "observe" every single message in every single channel.
					Object.freeze(channel.messages);
					channels[channel.id] = channel;
				}

				const members = {};
				for (const member of serializedServer.members) {
					members[member.user.id] = member.user;
				}

				const server = {
					channels: channels,
					members: members
				};

				this.server = server;
			}
		}
	});

	Vue.component('message', {
		props: ['message'],
		data: () => {
			return {}
		},
		template: '#message-template'
	});
});
