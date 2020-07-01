import './style.scss';
import '../../../public/css/normalize.css';
import {Component} from 'preact';
import createStore from 'unistore';
import {Provider, connect} from 'unistore/preact';

import readJSONFromFile from '../../util/read-json-from-file';
import deserializeArchive from '../../deserialization/deserialization';

import ChannelList from '../ChannelList/ChannelList';
import ChannelView from '../ChannelView/ChannelView';

const store = createStore({
	archive: null,
	currentChannel: null,
	channelScrollState: {}
});

class _App extends Component {
	constructor (props) {
		super(props);

		this.handleUpload = this.handleUpload.bind(this);
	}

	handleUpload (event) {
		const file = event.target.files[0];
		if (!file) return;

		readJSONFromFile(file)
			.then(archiveJSON => {
				const archive = deserializeArchive(archiveJSON);
				this.props.store.setState({archive, channelScrollProgress: {}});
			});
	}

	render () {
		return (
			<div id="app">
				<div className="channels-and-messages">
					<div className="channel-list-panel">
						<ChannelList channels={this.props.archive ? this.props.archive.channels : null} />
					</div>
					<ChannelView channel={this.props.archive ?
						this.props.archive.channels.get(this.props.currentChannel) :
						null
					}/>
				</div>

				<div className="json-file-upload-form">
					<span>.json or .zip log file: </span>
					<input
						type="file"
						onChange={this.handleUpload}
					></input>
				</div>
			</div>
		);
	}
}

const App = connect(['archive', 'currentChannel'])(_App);

export default class Main extends Component {
	render () {
		return (
			<Provider store={store}>
				<App />
			</Provider>
		);
	}
}
