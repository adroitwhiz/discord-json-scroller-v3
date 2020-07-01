import style from './style';

import {Component, createRef} from 'preact';

class MessageViewScrollbar extends Component {
	constructor (props) {
		super(props);

		this.rangeElem = createRef();
	}

	render () {
		return (
			<div className={style['scrollbar']}>
				<div className={style['scrollbar-range-wrapper']}>
					<div
						className={style['scrollbar-range-top-wrapper']}
						style={`top: ${(this.props.start / this.props.totalMessages) * 100}%;`}
					>
						<div className={`${style['scrollbar-range-top']} ${style['scrollbar-range-indicator']}`}>
							<div className={style['scrollbar-range-indicator-inner']}>{this.props.start}</div>
						</div>
					</div>

					<div
						className={style['scrollbar-range-bottom-wrapper']}
						style={`top: ${(this.props.end / this.props.totalMessages) * 100}%;`}
					>
						<div className={`${style['scrollbar-range-bottom']} ${style['scrollbar-range-indicator']}`}>
							<div className={style['scrollbar-range-indicator-inner']}>{this.props.end}</div>
						</div>
					</div>
				</div>

				<div className={style['scrollbar-indicator-wrapper']}>
					<div
						className={style['scrollbar-indicator']}
						ref={this.rangeElem}
						style={`top: ${(this.props.start / this.props.totalMessages) * 100}%; height: ${((this.props.end - this.props.start) / this.props.totalMessages) * 100}%;`}
					></div>
				</div>

			</div>
		);
	}
}

export default MessageViewScrollbar;
