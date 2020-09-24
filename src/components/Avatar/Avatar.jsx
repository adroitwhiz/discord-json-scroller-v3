import style from './style.scss';

import {Component} from 'preact';

const avatarRegistry = new Map();

// Generate an SVG image for a pseudorandomly-colored default avatar.
const defaultAvatar = name => {
	let color = 0;
	for (let i = 0; i < name.length; i++) {
		color = (color + (name.charCodeAt(i) << i)) & 0xffffffff;
	}

	for (let i = 0; i < 4; i++) {
		color ^= color << 13;
		color ^= color >> 17;
		color ^= color << 5;
	}

	color &= 0xffffff;

	const luma = (0.2 * ((color & 0xff0000) >> 16)) + (0.7 * ((color & 0x00ff00) >> 8)) + (0.1 * (color & 0x0000ff));

	return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
		<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
			<rect x="0" y="0" width="100%" height="100%" fill="#${('000000' + color.toString(16)).slice(-6)}" />
			<text font-family="sans-serif" x="50%" y="50%" fill="${luma > 127 ? 'black' : 'white'}" text-anchor="middle" dominant-baseline="central" font-size="48px">${'&#' + name.codePointAt(0) +  ';'}</text>
		</svg>
	`;
};

class Avatar extends Component {
	constructor (props) {
		super(props);

		this.state = {
			handledError: false
		};

		this.handleError = this.handleError.bind(this);
		this.getUnsizedURL = this.getUnsizedURL.bind(this);
		this.getDefaultAvatar = this.getDefaultAvatar.bind(this);
	}

	getUnsizedURL () {
		return this.props.user.avatarURL.replace(/\?size=\d+/, '');
	}

	getDefaultAvatar () {
		const svg =  defaultAvatar(this.props.user ? this.props.user.tag : this.props.userID ? this.props.userID : '✖');
		return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
	}

	handleError (e) {
		avatarRegistry.set(this.getUnsizedURL(), false);
		e.target.src = this.getDefaultAvatar();

		this.setState({handledError: true});
	}

	render () {
		const {props} = this;

		const hasAvatar = !!(props.user && props.user.avatarURL);
		const unsizedURL = hasAvatar && this.getUnsizedURL();
		const loadResultKnown = hasAvatar && avatarRegistry.has(unsizedURL);
		const knownUnsuccessful = hasAvatar && loadResultKnown && !avatarRegistry.get(unsizedURL);

		return (
			<img
				className={style['avatar']}
				src={hasAvatar && !knownUnsuccessful ? `${unsizedURL}?size=${props.size}` : this.getDefaultAvatar()}
				onError={this.state.handledError ? null : this.handleError}
				width={props.size}
				height={props.size}
				style={`width: ${props.size}; height: ${props.size}`}
			/>
		);
	}
}

export default Avatar;
