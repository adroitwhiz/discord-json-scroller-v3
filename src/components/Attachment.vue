<template>
	<div>
		<img
			v-if="isImage()"
			:src="attachment.url"
			class="attachment"
		>
		<div
			v-else
			class="attachment"
		>
			<a :href="attachment.url">{{ attachment.name }}</a>
			<span>{{ attachment.size }} bytes</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Attachment',
	props: {
		'attachment': {
			type: Object,
			required: true
		}
	},
	data: function () {
		return {};
	},
	methods: {
		isImage () {
			const fileExtension = this.attachment.url.split('.').slice(-1)[0].toLowerCase();

			return (
				fileExtension === 'png' ||
				fileExtension === 'jpeg' ||
				fileExtension === 'jpg' ||
				fileExtension === 'gif'
			);
		}
	}
};
</script>
