import style from './style';

import {Component, createRef} from 'preact';

/**
 * React ****s up text inputs by making onChange fire on *every* input. We only want it to fire when the user confirms
 * their input, either by unfocusing/blurring the input or by pressing the enter key.
 */
class BetterTextInput extends Component {
	constructor (props) {
		super(props);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleKeyPress (event) {
		if (event.code === 'Enter' || event.code === 'NumpadEnter') {
			this.props.onChange(event);
		}
	}

	render () {
		return (
			<input
				className={this.props.className}
				type="text"
				value={this.props.value}
				onBlur={this.props.onChange}
				onKeyPress={this.handleKeyPress}
			/>
		);
	}
}

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
		if (!Number.isInteger(numVal)) return;
		this.props.setNewStart(numVal);
	}

	handleSetEnd (e) {
		const {value} = e.target;
		const numVal = parseInt(value);
		if (!Number.isInteger(numVal)) return;
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
							<BetterTextInput
								className={style['scrollbar-range-input']}
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
							<BetterTextInput
								className={style['scrollbar-range-input']}
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
