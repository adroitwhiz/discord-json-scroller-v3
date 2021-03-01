import style from './style';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

import classNames from '../../util/class-names';

import toggleSidebar from '../../actions/toggle-sidebar';

import JumpableMessage from '../JumpableMessage/JumpableMessage';

class Header extends Component {
	constructor (props) {
		super(props);

		this.state = {
			showPinnedMessages: false
		};

		this.toggleShowPinnedMessages = this.toggleShowPinnedMessages.bind(this);
	}

	toggleShowPinnedMessages () {
		this.setState(prevState => ({
			showPinnedMessages: !prevState.showPinnedMessages
		}));
	}

	render () {
		const {channel} = this.props;
		return (
			<div className={style['header']}>
				<div className={style['channel-info']}>
					{channel ? <>
						<div className={style['channel-name']}>{channel.name}</div>
						<div className={style['channel-topic']}>{channel.topic}</div>
					</> : null}
				</div>
				<div className={style['buttons']}>
					{channel && channel.pinnedMessages ?
						<div
							onClick={this.toggleShowPinnedMessages}
							className={classNames({
								[style['button']]: true,
								[style['icon-pinned-messages']]: true,
								[style['active']]: this.state.showPinnedMessages
							})}
							title="Pinned messages"
						></div> :
						null
					}
					<div
						onClick={this.props.toggleSidebar}
						className={classNames({
							[style['button']]: true,
							[style['sidebar-open']]: !this.props.showSidebar,
							[style['sidebar-close']]: this.props.showSidebar
						})}
						title="Toggle sidebar"
					></div>
				</div>
				{this.state.showPinnedMessages ?
					<div className={style['pinned-messages']}>
						{
							channel.pinnedMessages.map((message, i) =>
								<JumpableMessage
									key={channel.pinnedMessages[i].id}
									message={channel.pinnedMessages[i]}
									channelID={channel.id}
								/>
							)
						}
					</div> :
					null
				}
			</div>
		);
	}
}

export default connect('showSidebar', {toggleSidebar})(Header);
