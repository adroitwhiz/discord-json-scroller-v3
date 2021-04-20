import {fixupMessageStart, fixupMessageEnd} from '../util/fixup-message-boundaries';

export default (state, channelID, start, end) => {
	const {messages} = state.archive.channels.get(channelID);
	return {
		channelScrollState: {
			...state.channelScrollState,
			[channelID]: {
				start: fixupMessageStart(start, messages),
				end: fixupMessageEnd(end, messages)
			}
		}
	};
};

export {fixupMessageStart, fixupMessageEnd};
