import style from './style';

import {Component} from 'preact';
import {toCodePoints} from 'twemoji-parser';

import getEmojiName from '../../util/get-emoji-name';
import Tooltip from '../Tooltip/Tooltip';

// Copied in from twemoji-parser because they don't export it
const vs16RegExp = /\uFE0F/g;
// avoid using a string literal like '\u200D' here because minifiers expand it inline
const zeroWidthJoiner = String.fromCharCode(0x200d);

const removeVS16s = rawEmoji => {
	return rawEmoji.indexOf(zeroWidthJoiner) < 0 ? rawEmoji.replace(vs16RegExp, '') : rawEmoji;
};

class Emoji extends Component {
	constructor (props) {
		super(props);

		this.state = {
			hover: false
		};

		this.onPointerEnter = this.onPointerEnter.bind(this);
		this.onPointerOut = this.onPointerOut.bind(this);
	}

	onPointerEnter () {
		this.setState({hover: true});
	}

	onPointerOut () {
		this.setState({hover: false});
	}

	render () {
		const {emoji} = this.props;
		let emojiName;
		let emojiURL;
		if (typeof emoji === 'string') {
			emojiName = getEmojiName(emoji);
			// TODO: self-host twemoji
			const codepoints = toCodePoints(removeVS16s(emoji)).join('-');
			emojiURL = `https://twemoji.maxcdn.com/v/latest/svg/${codepoints}.svg`;
		} else {
			// TODO
		}

		return (
			<span
				className={style['emoji-container']}
				onPointerEnter={this.onPointerEnter}
				onPointerOut={this.onPointerOut}
			>
				<img draggable={false} className={style['emoji']} src={emojiURL} alt={`:${emojiName}:`}></img>
				{this.state.hover ? <Tooltip side="top">{emojiName}</Tooltip> : null}
			</span>
		);
	}
}

export default Emoji;
