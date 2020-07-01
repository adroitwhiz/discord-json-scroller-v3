<template>
	<div
		class="messages-container"
		@scroll="$emit('scroll', $event)"
	>
		<message
			v-for="message in messages"
			:key="message.id"
			:message="message"
			:server="server"
		/>
	</div>
</template>

<script>
import {mapState} from 'vuex';

import Message from './Message';

export default {
	name: 'MessageList',
	components: {Message},
	props: {
		'messages': {
			type: Array,
			required: true
		}
	},
	data: () => {
		return {};
	},

	computed: {
		...mapState(['server'])
	}
};
</script>
