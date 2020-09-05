import style from './style';

import {Component, createRef} from 'preact';

class MessageViewScrollbar extends Component {
	constructor (props) {
		super(props);

		this.rangeElem = createRef();

		this.handleSetStart = this.handleSetStart.bind(this);
		this.handleSetEnd = this.handleSetEnd.bind(this);
	}

	handleSetStart (e) {
		const {value} = e.target;
		const numVal = parseInt(value);
		this.props.setNewStart(numVal);
	}

	handleSetEnd (e) {
		const {value} = e.target;
		const numVal = parseInt(value);
		this.props.setNewEnd(numVal);
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
							<input
								className={style['scrollbar-range-input']}
								type="text"
								value={this.props.start}
								onChange={this.handleSetStart}
							/>
						</div>
					</div>

					<div
						className={style['scrollbar-range-bottom-wrapper']}
						style={`top: ${(this.props.end / this.props.totalMessages) * 100}%;`}
					>
						<div className={`${style['scrollbar-range-bottom']} ${style['scrollbar-range-indicator']}`}>
							<input
								className={style['scrollbar-range-input']}
								type="text"
								value={this.props.end}
								onChange={this.handleSetEnd}
							/>
						</div>
					</div>
				</div>

				<div className={style['scrollbar-indicator-wrapper']}>
					<div
						className={style['scrollbar-indicator']}
						ref={this.rangeElem}
						style={`top: ${(this.props.start / this.props.totalMessages) * 100}%;
							height: ${((this.props.end - this.props.start) / this.props.totalMessages) * 100}%;`}
					></div>
				</div>

			</div>
		);
	}
}

export default MessageViewScrollbar;
