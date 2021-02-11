import style from './style';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

import classNames from '../../util/class-names';

import toggleSidebar from '../../actions/toggle-sidebar';

class Header extends Component {
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
				<div className={style['controls']}>
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
			</div>
		);
	}
}

export default connect('showSidebar', {toggleSidebar})(Header);
