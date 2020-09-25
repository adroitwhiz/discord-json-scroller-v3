import style from './style';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

import MessageList from '../../MessageList/MessageList';

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
			foundMessages: []
		};

		this.toggleFindPanel = this.toggleFindPanel.bind(this);
		this.searchMessages = this.searchMessages.bind(this);

		this.setFilterByText = makeCheckboxSetter('filterByText', this);
		this.setFilterText = makeInputSetter('filterText', this);

		this.setFilterByUser = makeCheckboxSetter('filterByUser', this);
		this.setFilterUser = makeInputSetter('filterUser', this);

		this.setFilterByChannel = makeCheckboxSetter('filterByChannel', this);
		this.setFilterChannel = makeInputSetter('filterChannel', this);
	}

	toggleFindPanel () {
		this.setState(state => {
			return {collapsed: !state.collapsed};
		});
	}

	searchMessages () {
		const MAX_MESSAGES = 10000;
		const allMessages = [];
		const {channels} = this.props.archive;
		for (const channel of channels.values()) {
			if (
				channel.type !== 'text' ||
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

			if (allMessages.length + messages.length > MAX_MESSAGES) {
				alert(`More than ${MAX_MESSAGES} messages found. Not displaying results.`);
				return;
			}

			for (let i = 0; i < messages.length; i++) {
				allMessages.push(messages[i]);
			}
		}

		this.setState({foundMessages: allMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp)});
	}

	render () {
		const listID = Math.random().toString(36);

		const userTagOptions = [];
		const archiveChannelOptions = [];
		if (this.props.archive) {
			for (const user of this.props.archive.users.values()) {
				userTagOptions.push(
					<option key={user.id} value={user.tag} />
				);
			}

			for (const channel of this.props.archive.channels.values()) {
				if (channel.type !== 'text') continue;
				archiveChannelOptions.push(
					<option key={channel.id} value={channel.id}>{channel.name}</option>
				);
			}
		}

		return (
			<div className={style['find-inner']}>
				<div className={style['find-controls']}>
					<div>
						<label>
							<input
								type="checkbox"
								onChange={this.setFilterByText}
							></input>
							<span> Contains text: </span>
						</label>
						<input type="text" onChange={this.setFilterText}></input>
					</div>
					<div>
						<label>
							<input
								type="checkbox"
								onChange={this.setFilterByUser}
							></input>
							<span> From user (name or ID): </span>
						</label>
						<input type="text" onChange={this.setFilterUser} list={listID}></input>
						<datalist id={listID}>
							{userTagOptions}
						</datalist>
					</div>
					<div>
						<label>
							<input
								type="checkbox"
								onChange={this.setFilterByChannel}
							></input>
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
				<div className={style['found-messages']}>
					{
						this.state.foundMessages.map((message, i) =>
							<MessageList
								start={i}
								end={i + 1}
								messages={this.state.foundMessages}
								key={this.state.foundMessages[i].id}
							/>
						)
					}
				</div>
			</div>
		);
	}
}

export default connect('archive')(FindPanel);
