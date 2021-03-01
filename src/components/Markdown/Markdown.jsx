/* eslint-disable react/display-name */
import style from './style.scss';

import {Component} from 'preact';
import {connect} from 'unistore/preact';
import {parser, markdownEngine} from 'discord-markdown';

import setUserInfoID from '../../actions/set-user-info-id';
import setCurrentChannel from '../../actions/set-current-channel';

import classNames from '../../util/class-names';
import getMemberName from '../../util/get-member-name';

class Spoiler extends Component {
	constructor (props) {
		super(props);

		this.state = {spoiled: false};
		this.toggleSpoiled = this.toggleSpoiled.bind(this);
	}

	toggleSpoiled () {
		this.setState(state => {
			return {spoiled: !state.spoiled};
		});
	}

	render () {
		return <span
			className={classNames({
				[style['spoiler']]: true,
				[style['open']]: this.state.spoiled
			})}
			onClick={this.toggleSpoiled}
		>
			{this.props.children}
		</span>;
	}
}

const UserMention = connect('archive', {setUserInfoID})(props =>
	<span
		className={`${style['mention']} ${style['user']}`}
		onClick={() => props.setUserInfoID(props.id)}
	>
		{getMemberName(props.id, props.archive, true)}
	</span>
);

const ChannelMention = connect('archive', {setCurrentChannel})(props => {
	const hasChannel = props.archive.channels.has(props.id);
	const channel = props.archive.channels.get(props.id);
	return (
		<span
			className={`${style['mention']} ${style['channel']}`}
			onClick={hasChannel ? () => props.setCurrentChannel(props.id) : null}
		>
			{hasChannel ? `#${channel.name}` : '#deleted-channel'}
		</span>
	);
});

const RoleMention = connect('archive')(props => {
	const role = props.archive.data.roles.get(props.id);
	if (!role) return '@deleted-role';

	// If the role has no color, use the default blue. Otherwise, define a custom style.
	let styleString = '';
	if (role.color !== '#000000') {
		const roleColorInt = parseInt(role.color.slice(1), 16);
		const roleColorR = (roleColorInt >> 16) & 0xff;
		const roleColorG = (roleColorInt >> 8) & 0xff;
		const roleColorB = roleColorInt & 0xff;
		styleString = `color: ${role.color}; background-color: rgba(${roleColorR}, ${roleColorG}, ${roleColorB}, 0.1)`;
	}

	return (
		<span
			className={style['mention']}
			style={styleString}
		>
			@{role.name}
		</span>
	);
});

// If the URL is "dangerous" (cannot be sanitized), return regular text. Otherwise, create a link.
const makeLink = (content, node) => {
	const target = markdownEngine.sanitizeUrl(node.target);

	return target ?
		<a href={target}>{content}</a> :
		<span>{content}</span>;
};

const reactRules = {
	text: content => content,
	em: content => <em>{content}</em>,
	strong: content => <strong>{content}</strong>,
	u: content => <u>{content}</u>,
	strike: content => <strike>{content}</strike>,
	spoiler: content => <Spoiler>{content}</Spoiler>,
	br: () => <br/>,
	inlineCode: content => <code className={style['code']}>{content}</code>,
	codeBlock: content => <pre className={style['code-block']}>{content}</pre>,
	blockQuote: content => <blockquote className={style['block-quote']}>{content}</blockquote>,
	url: makeLink,
	autolink: makeLink,
	discordUser: (content, node) => <UserMention id={node.id} />,
	discordEveryone: () => <span className={style['mention']}>@everyone</span>,
	discordHere: () => <span className={style['mention']}>@here</span>,
	discordRole: (content, node) => <RoleMention id={node.id} />,
	discordChannel: (content, node) => <ChannelMention id={node.id} />
};

const reactify = nodeArray => nodeArray.map(node => {
	const nodeHasContent = Object.prototype.hasOwnProperty.call(node, 'content');
	let content = node.content;
	if (nodeHasContent && Array.isArray(node.content)) {
		content = reactify(node.content);
	}

	if (Object.prototype.hasOwnProperty.call(reactRules, node.type)) {
		return reactRules[node.type](content, node);
	}

	console.warn(`Unknown Markdown node type: ${node.type}`);
	return nodeHasContent ? reactRules.text(content) : null;
});

const Markdown = props => reactify(parser(props.text));

export default Markdown;
