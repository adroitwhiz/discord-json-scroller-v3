import style from './style';

import {Component, createRef} from 'preact';
import {connect} from 'unistore/preact';

import JumpableMessage from '../../JumpableMessage/JumpableMessage';
import Toggle from '../../Toggle/Toggle';
import TextDropdown from '../../TextDropdown/TextDropdown';

import classNames from '../../../util/class-names';

const makeCheckboxSetter = (prop, target) => {
	return event => {
		target.setState({[prop]: event.target.checked});
	};
};

const makeInputSetter = (prop, target) => {
	return event => {
		target.setState({[prop]: event.target.value});
	};
};

const MESSAGES_PER_PAGE = 100;

class FindPanel extends Component {
	constructor (props) {
		super(props);

		this.state = {
			collapsed: true,
			filterByUser: false,
			filterByText: false,
			filterByChannel: false,
			filterUser: null,
			filterText: null,
			filterChannel: null,

			foundMessages: [],
			foundMessageChannels: null,
			pageNumber: -1,
			numPages: 0
		};

		this.foundMessagesElem = createRef();

		this.toggleFindPanel = this.toggleFindPanel.bind(this);
		this.searchMessages = this.searchMessages.bind(this);

		this.setFilterByText = makeCheckboxSetter('filterByText', this);
		this.setFilterText = makeInputSetter('filterText', this);

		this.setFilterByUser = makeCheckboxSetter('filterByUser', this);
		this.setFilterUser = this.setFilterUser.bind(this);

		this.setFilterByChannel = makeCheckboxSetter('filterByChannel', this);
		this.setFilterChannel = makeInputSetter('filterChannel', this);

		this.prevPage = this.prevPage.bind(this);
		this.nextPage = this.nextPage.bind(this);
	}

	setFilterUser (filterUser) {
		this.setState({filterUser});
	}

	toggleFindPanel () {
		this.setState(state => {
			return {collapsed: !state.collapsed};
		});
	}

	prevPage () {
		this.setState(state => {
			if (state.pageNumber < 1) return {};
			return {
				pageNumber: state.pageNumber - 1
			};
		});
	}

	nextPage () {
		this.setState(state => {
			if (state.pageNumber >= state.numPages - 1) return {};
			return {
				pageNumber: state.pageNumber + 1
			};
		});
	}

	componentDidUpdate (prevProps, prevState) {
		if (this.state.pageNumber > prevState.pageNumber) {
			this.foundMessagesElem.current.scrollTop = 0;
		} else if (this.state.pageNumber < prevState.pageNumber) {
			this.foundMessagesElem.current.scrollTop = this.foundMessagesElem.current.scrollHeight;
		}
	}

	searchMessages () {
		if (!this.props.archive) return;

		const allMessages = [];

		// When we jump to a message we need to know what channel it belongs to. Since we search over all channels here,
		// we may as well cache which channel each message belongs to so we don't have to loop over them all again.
		const messageChannels = new Map();

		const {channels} = this.props.archive;
		for (const channel of channels.values()) {
			if (
				(!channel.messages) ||
				(this.state.filterByChannel && this.state.filterChannel !== channel.id)
			) continue;

			let messages = channel.messages;

			if (this.state.filterByText) {
				const matchText = this.state.filterText.toLowerCase();
				messages = messages.filter(message => message.content.toLowerCase().includes(matchText));
			}

			if (this.state.filterByUser) {
				const userFilter = this.state.filterUser.toLowerCase();
				const {users} = this.props.archive;
				messages = messages.filter(message => {
					if (message.authorID === userFilter) return true;

					if (!users.has(message.authorID)) return false;
					const memberUser = users.get(message.authorID);

					if (typeof memberUser === 'undefined') return false;
					return (
						users.has(message.authorID) &&
						(
							memberUser.username.toLowerCase() === userFilter ||
							memberUser.tag.toLowerCase() === userFilter
						)
					);
				});
			}

			for (let i = 0; i < messages.length; i++) {
				allMessages.push(messages[i]);
				messageChannels.set(messages[i].id, channel.id);
			}
		}

		this.setState({
			foundMessages: allMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp),
			foundMessageChannels: messageChannels,
			pageNumber: 0,
			numPages: Math.ceil(allMessages.length / MESSAGES_PER_PAGE)
		});
	}

	render () {
		const userTagOptions = [];
		const archiveChannelOptions = [];
		if (this.props.archive) {
			for (const user of this.props.archive.users.values()) {
				userTagOptions.push(user.tag);
			}

			for (const channel of this.props.archive.channels.values()) {
				if (channel.type !== 'text') continue;
				archiveChannelOptions.push(
					<option key={channel.id} value={channel.id}>{channel.name}</option>
				);
			}
		}

		const start = this.state.pageNumber * MESSAGES_PER_PAGE;
		const end = start + MESSAGES_PER_PAGE;

		return (
			<div className={style['find-inner']}>
				<div className={style['find-controls']}>
					<div className={style['form-row']}>
						<label className={style['form-label']}>
							<Toggle
								onChange={this.setFilterByText}
								checked={this.state.filterByText}
							/>
							<span> Contains text: </span>
						</label>
						<input type="text" onChange={this.setFilterText}></input>
					</div>
					<div className={style['form-row']}>
						<label className={style['form-label']}>
							<Toggle
								onChange={this.setFilterByUser}
								checked={this.state.filterByUser}
							/>
							<span> From user (name or ID): </span>
						</label>
						<TextDropdown
							onChange={this.setFilterUser}
							options={userTagOptions}
						/>
					</div>
					<div className={style['form-row']}>
						<label className={style['form-label']}>
							<Toggle
								type="checkbox"
								onChange={this.setFilterByChannel}
								checked={this.state.filterByChannel}
							/>
							<span> In channel: </span>
						</label>
						<select type="text" onChange={this.setFilterChannel}>
							{archiveChannelOptions}
						</select>
					</div>
					<div>
						<button onClick={this.searchMessages}>Find</button>
					</div>
				</div>
				<div className={style['found-messages']} ref={this.foundMessagesElem}>
					{
						this.state.foundMessages.slice(start, end).map(message =>
							<JumpableMessage
								key={message.id}
								message={message}
								channelID={this.state.foundMessageChannels.get(message.id)}
							/>
						)
					}
				</div>
				<div className={style['paginator']}>
					<div
						className={classNames({
							[style['page-button']]: true,
							[style['prev']]: true,
							[style['disabled']]: this.state.pageNumber < 1
						})}
						onClick={this.prevPage}
					></div>
					<div className={style['page-num']}>Page {this.state.pageNumber + 1} of {this.state.numPages}</div>
					<div
						className={classNames({
							[style['page-button']]: true,
							[style['next']]: true,
							[style['disabled']]: this.state.pageNumber >= this.state.numPages - 1
						})}
						onClick={this.nextPage}
					></div>
				</div>
			</div>
		);
	}
}

export default connect(['archive', 'currentChannel'])(FindPanel);
