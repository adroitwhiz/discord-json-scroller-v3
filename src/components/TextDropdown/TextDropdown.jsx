import style from './style';

import {Component, createRef} from 'preact';

import classNames from '../../util/class-names';

class TextDropdown extends Component {
	constructor (props) {
		super(props);

		this.state = {
			showDropdown: false,
			value: ''
		};

		this.textInput = createRef();

		this.hideDropdown = this.setDropdownState.bind(this, false);
		this.showDropdown = this.setDropdownState.bind(this, true);
		this.setValue = this.setValue.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	setDropdownState (showDropdown) {
		this.setState({showDropdown});
	}

	setValue (value) {
		this.setState({value});
		if (this.props.onChange) this.props.onChange(value);
	}

	handleChange (event) {
		this.setValue(event.target.value);
	}

	render () {
		const lowerValue = this.state.value.toLowerCase();
		let {options} = this.props;
		if (lowerValue !== '') {
			options = options.filter(option => option.toLowerCase().indexOf(lowerValue) !== -1);
		}

		return (
			<div className={style['text-dropdown']}>
				<input
					type="text"
					value={this.state.value}
					ref={this.textInput}
					onFocus={this.showDropdown}
					onBlur={this.hideDropdown}
					onChange={this.handleChange}
				/>
				<div className={classNames({[style['menu']]: true, [style['hidden']]: !this.state.showDropdown})}>
					{options.map(option => (
						<div
							className={style['menu-option']}
							key={option}
							onMouseDown={() => this.setValue(option)}
						>
							{option}
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default TextDropdown;
