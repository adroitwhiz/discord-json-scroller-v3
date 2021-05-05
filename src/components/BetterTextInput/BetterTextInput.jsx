import {Component} from 'preact';

/**
 * React ****s up text inputs by making onChange fire on *every* input. We only want it to fire when the user confirms
 * their input, either by unfocusing/blurring the input or by pressing the enter key.
 */
export default class BetterTextInput extends Component {
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
