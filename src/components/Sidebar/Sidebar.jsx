import style from './style';
import icons from '../../icons/icons';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

import FindPanel from './FindPanel/FindPanel';
import UsersPanel from './UsersPanel/UsersPanel';

import classNames from '../../util/class-names';

class Sidebar extends Component {
	constructor (props) {
		super(props);

		this.state = {
			activeTab: 'users'
		};

		this.getActivePanel = this.getActivePanel.bind(this);
		this.setUsersTab = this.setActiveTab.bind(this, 'users');
		this.setFindTab = this.setActiveTab.bind(this, 'find');
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
					[style['collapsed']]: !this.props.showSidebar
				})}
			>
				<div className={style['tabs']}>
					<div
						className={classNames({
							[style['tab']]: true,
							[style['selected']]: this.state.activeTab === 'users'
						})}
						onClick={this.setUsersTab}
					>
						<div className={`${icons['icon']} ${icons['users']}`}></div>
					</div>
					<div
						className={classNames({
							[style['tab']]: true,
							[style['selected']]: this.state.activeTab === 'find'
						})}
						onClick={this.setFindTab}
					>
						<div className={`${icons['icon']} ${icons['find']}`}></div>
					</div>
				</div>
				<div className={style['panel']}>
					{this.getActivePanel()}
				</div>
			</div>
		);
	}
}

export default connect('showSidebar')(Sidebar);
