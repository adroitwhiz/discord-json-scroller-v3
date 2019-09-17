<template>
	<div class="message">
		<div class="message-data">
			<div class="username">
				{{ getUsername() }}
			</div>
			<div class="timestamp">
				{{ formatTimestamp(message.createdTimestamp) }}
			</div>
			<div class="index">
				{{ message.id }}
			</div>
		</div>
		<div class="message-content">
			<div
				v-linkified
				class="message-text"
			>{{ message.content }}</div> <!-- white-space is pre, so this has to be one line -->
			<div
				v-if="message.attachments"
				class="message-attachments"
			>
				<Attachment
					v-for="attachment in message.attachments"
					:key="attachment.id"
					:attachment="attachment"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment';

import Attachment from './Attachment';

export default {
	name: 'Message',
	components: {Attachment},
	props: {
		'message': {
			type: Object,
			required: true
		},
		'server': {
			type: Object,
			required: true
		}
	},
	data: () => {
		return {};
	},
	methods: {
		getUsername: function () {
			const member = this.server.members.get(this.message.authorID);

			if (!member) return `<@${this.message.authorID}>`;
			if (member.nickname !== null) return member.nickname;
			return member.user.username;
		},

		formatTimestamp: timestamp => {
			return moment(parseInt(timestamp)).format('MMM D Y h:mm:ss A');
		}
	}
};
</script>
