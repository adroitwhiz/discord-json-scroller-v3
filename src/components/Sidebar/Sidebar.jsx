import style from './style';

import {Component} from 'preact';

import FindPanel from './FindPanel/FindPanel';

import classNames from '../../util/class-names';

class Sidebar extends Component {
	constructor (props) {
		super(props);

		this.state = {
			collapsed: true
		};

		this.toggleSidebar = this.toggleSidebar.bind(this);
	}

	toggleSidebar () {
		this.setState(state => {
			return {collapsed: !state.collapsed};
		});
	}

	render () {
		return (
			<div className={classNames({
				[style['sidebar']]: true,
				[style['collapsed']]: this.state.collapsed
			})}>
				<div
					className={style['sidebar-toggle']}
					onClick={this.toggleSidebar}
				>{this.state.collapsed ? '«' : '»'}</div>
				<FindPanel />
			</div>
		);
	}
}

export default Sidebar;
