import './style';

import {Component, createRef} from 'preact';

class MessageViewScrollbar extends Component {
	constructor (props) {
		super(props);

		this.rangeElem = createRef();
	}

	render () {
		return (
			<div className="message-view-scrollbar">
				<div
					className="message-view-scrollbar-range"
					ref={this.rangeElem}
					style={`top: ${(this.props.start / this.props.totalMessages) * 100}%; height: ${((this.props.end - this.props.start) / this.props.totalMessages) * 100}%;`}
				></div>
			</div>
		);
	}
}

export default MessageViewScrollbar;
