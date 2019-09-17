import Vue from 'vue';
import Vuex from 'vuex';
import * as linkifyElement from 'linkifyjs/element';

import App from './components/App';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		server: {channels: [], members: []},
		activeChannelId: null
	},
	mutations: {
		setServer (state, server) {
			state.server = server;
		},
		setActiveChannel (state, channelId) {
			state.activeChannelId = channelId;
		}
	}
});

// Convert URLs into clickable links via Linkify.
const vueLinkify = (element, binding) => {
	element = linkifyElement(element, binding.value);
};
Vue.directive('linkified', vueLinkify);

document.addEventListener('DOMContentLoaded', () => {
	new Vue({
		el: '#app',
		store,
		render: h => h(App)
	});
});
