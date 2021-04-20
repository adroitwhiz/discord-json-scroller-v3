import {fixupMessageStart, fixupMessageEnd} from '../util/fixup-message-boundaries';

export default (state, currentChannel) => {
	if (currentChannel === null) return {currentChannel};
	const channel = state.archive.channels.get(currentChannel);
	const {messages} = channel;
	const newState = {...state, currentChannel};

	if (!Object.prototype.hasOwnProperty.call(newState.channelScrollState, currentChannel)) {
		newState.channelScrollState = {
			...newState.channelScrollState,
			[currentChannel]: {start: fixupMessageStart(0, messages), end: fixupMessageEnd(50, messages)}
		};

	}

	return newState;
};
