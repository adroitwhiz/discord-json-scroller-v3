<template>
	<div
		id="app"
		class="flex-expand flex-col"
	>
		<div class="flex-cols flex-expand">
			<channel-list-panel />
			<channel-messages-panel />
			<find-panel />
		</div>

		<div class="flex-row flex-collapse">
			<div id="json-file-upload-form">
				<span>JSON log file:</span>
				<input
					type="file"
					@change="loadJSONFromFile"
				>
			</div>
		</div>
	</div>
</template>

<script>
const readJSONFromFile = file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('load', event => {
			resolve(JSON.parse(event.target.result));
		});

		reader.addEventListener('error', event => {
			reject(event.target.error);
		});

		reader.readAsText(file);
	});
};

import {mapState} from 'vuex';

import deserializeArchive from '../deserialization/deserialization';

import ChannelListPanel from './ChannelListPanel';
import ChannelMessagesPanel from './ChannelMessagesPanel';
import FindPanel from './FindPanel';

export default {
	components: {ChannelListPanel, ChannelMessagesPanel, FindPanel},
	data: function () {
		return {};
	},

	computed: {
		...mapState(['server'])
	},
	methods: {
		loadJSONFromFile (event) {
			const jsonFile = event.target.files[0];
			if (jsonFile) {
				readJSONFromFile(jsonFile).then(this.loadServer);
			}
		},
		loadServer (serializedServer) {
			const deserialized = deserializeArchive(serializedServer);

			this.$store.commit('setServer', deserialized);

			// Automatically set active channel if there's only one
			if (this.server.channels.size === 1) {
				const firstChannel = this.server.channels.values().next().value;
				if (firstChannel.type === 'text') {
					this.$store.commit('setActiveChannel', firstChannel.id);
				}
			}
		}
	}
};
</script>
