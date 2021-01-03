import style from './style';

import {Component} from 'preact';

class Tooltip extends Component {
	render () {
		return (
			<div className={style['tooltip'] + (this.props.className ? ` ${this.props.className}` : '')}>
				{this.props.children}
			</div>
		);
	}
}

export default Tooltip;
