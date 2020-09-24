import style from './style';

import {Component} from 'preact';

import FindPanel from './FindPanel/FindPanel';
import UsersPanel from './UsersPanel/UsersPanel';

import classNames from '../../util/class-names';

class Sidebar extends Component {
	constructor (props) {
		super(props);

		this.state = {
			collapsed: false,
			activeTab: 'users'
		};

		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.getActivePanel = this.getActivePanel.bind(this);
		this.setUsersTab = this.setActiveTab.bind(this, 'users');
		this.setFindTab = this.setActiveTab.bind(this, 'find');
	}

	toggleSidebar () {
		this.setState(state => {
			return {collapsed: !state.collapsed};
		});
	}

	getActivePanel () {
		switch (this.state.activeTab) {
			case 'users': return <UsersPanel />;
			case 'find': return <FindPanel />;
			default: return null;
		}
	}

	setActiveTab (tab) {
		this.setState({activeTab: tab});
	}

	render () {
		return (
			<div
				className={classNames({
					[style['sidebar']]: true,
					[style['collapsed']]: this.state.collapsed
				})}
			>
				<div
					className={style['sidebar-toggle']}
					onClick={this.toggleSidebar}
				>{this.state.collapsed ? '«' : '»'}</div>
				<div className={style['tabs']}>
					<div
						className={classNames({
							[style['tab']]: true,
							[style['selected']]: this.state.activeTab === 'users'
						})}
						onClick={this.setUsersTab}
					>
						<div className={`${style['icon']} ${style['icon-users']}`}></div>
					</div>
					<div
						className={classNames({
							[style['tab']]: true,
							[style['selected']]: this.state.activeTab === 'find'
						})}
						onClick={this.setFindTab}
					>
						<div className={`${style['icon']} ${style['icon-find']}`}></div>
					</div>
				</div>
				<div className={style['panel']}>
					{this.getActivePanel()}
				</div>
			</div>
		);
	}
}

export default Sidebar;
