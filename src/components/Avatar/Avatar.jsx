import style from './style.scss';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

// Keep track of which avatars already failed to load so we don't make a new request to Discord every time they appear.
// This differs on a per-archive basis (some archives store avatars, some don't, and some store out-of-date avatars),
// so store a WeakMap mapping archives to their avatar registries.
const metaAvatarRegistry = new WeakMap();

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

		this.getUserID = this.getUserID.bind(this);
		this.handleError = this.handleError.bind(this);
		this.getAvatarURL = this.getAvatarURL.bind(this);
		this.getDefaultAvatar = this.getDefaultAvatar.bind(this);
		this.getAvatarRegistry = this.getAvatarRegistry.bind(this);
	}

	getUserID () {
		return this.props.userID || this.props.user.id;
	}

	getAvatarURL (size) {
		if (this.props.archive.avatars.has(this.getUserID())) {
			return this.props.archive.avatars.get(this.getUserID());
		}
		return this.props.user.avatarURL.replace(/\?size=\d+/, '') + `?size=${size}`;
	}

	getDefaultAvatar () {
		const svg =  defaultAvatar(
			this.props.user ? this.props.user.tag :
				this.props.userID ? this.props.userID :
					'✖');
		return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
	}

	getAvatarRegistry () {
		if (metaAvatarRegistry.has(this.props.archive)) {
			return metaAvatarRegistry.get(this.props.archive);
		}
		const registry = new Map();
		metaAvatarRegistry.set(this.props.archive, registry);
		return registry;
	}

	handleError (e) {
		this.getAvatarRegistry().set(this.getUserID(), false);
		e.target.src = this.getDefaultAvatar();

		this.setState({handledError: true});
	}

	render () {
		const {props} = this;
		const registry = this.getAvatarRegistry();

		const hasAvatar = !!(props.user && props.user.avatarURL);
		const avatarURL = hasAvatar && this.getAvatarURL(props.size);
		const loadResultKnown = hasAvatar && registry.has(this.getUserID());
		const knownUnsuccessful = hasAvatar && loadResultKnown && !registry.get(this.getUserID());

		return (
			<img
				className={style['avatar']}
				src={hasAvatar && !knownUnsuccessful ? avatarURL : this.getDefaultAvatar()}
				onError={this.state.handledError ? null : this.handleError}
				width={props.size}
				height={props.size}
				style={`width: ${props.size}; height: ${props.size}`}
			/>
		);
	}
}

export default connect('archive')(Avatar);
