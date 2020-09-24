import style from './style.scss';

import {Component} from 'preact';

class Modal extends Component {
	constructor (props) {
		super(props);
	}

	render () {
		return (
			<>
				<div
					className={style['modal-bg']}
					onClick={this.props.onClose}
				/>
				<div className={style['modal-positioner']}>
					<div className={style['modal']}>
						{this.props.children}
					</div>
				</div>
			</>
		);
	}
}

export default Modal;
