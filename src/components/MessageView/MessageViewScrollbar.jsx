import style from './style';

import {Component, createRef} from 'preact';

class MessageViewScrollbar extends Component {
	constructor (props) {
		super(props);

		this.rangeElem = createRef();
	}

	render () {
		return (
			<div className={style['message-view-scrollbar']}>
				<div
					className={style['message-view-scrollbar-top']}
				>
					{this.props.start}
				</div>
				<div
					className={style['message-view-scrollbar-range']}
					ref={this.rangeElem}
					style={`top: ${(this.props.start / this.props.totalMessages) * 100}%; height: ${((this.props.end - this.props.start) / this.props.totalMessages) * 100}%;`}
				></div>
			</div>
		);
	}
}

export default MessageViewScrollbar;
