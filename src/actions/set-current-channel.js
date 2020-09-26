import {fixupMessageStart, fixupMessageEnd} from './set-channel-scroll-state';

export default (state, currentChannel) => {
	const {messages} = state.archive.channels.get(currentChannel);
	const newState = {...state, currentChannel};

	if (!Object.prototype.hasOwnProperty.call(newState.channelScrollState, currentChannel)) {
		newState.channelScrollState = {
			...newState.channelScrollState,
			[currentChannel]: {start: fixupMessageStart(0, messages), end: fixupMessageEnd(50, messages)}
		};

	}

	return newState;
};
