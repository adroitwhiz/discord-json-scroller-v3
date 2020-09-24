import style from './style.scss';
import '../../../public/css/normalize.css';
import {Component} from 'preact';
import createStore from 'unistore';
import {Provider, connect} from 'unistore/preact';

import readJSONFromFile from '../../util/read-json-from-file';
import deserializeArchive from '../../deserialization/deserialization';

import ChannelList from '../ChannelList/ChannelList';
import ChannelView from '../ChannelView/ChannelView';
import Sidebar from '../Sidebar/Sidebar';
import Modal from '../Modal/Modal';
import UserInfo from '../UserInfo/UserInfo';

import setArchive from '../../actions/set-archive';
import setUserInfoID from '../../actions/set-user-info-id';

const store = createStore({
	archive: null,
	currentChannel: null,
	showInfoOfUserID: null
});

class _App extends Component {
	constructor (props) {
		super(props);

		this.handleUpload = this.handleUpload.bind(this);
		this.hideUserInfo = this.hideUserInfo.bind(this);
	}

	handleUpload (event) {
		const file = event.target.files[0];
		if (!file) return;

		readJSONFromFile(file)
			.then(archiveJSON => {
				const archive = deserializeArchive(archiveJSON);
				this.props.setArchive(archive);
			});
	}

	hideUserInfo () {
		this.props.setUserInfoID(null);
	}

	render () {
		return (
			<div id={style.app}>
				<div className={style['channels-and-messages']}>
					<div className={style['channel-list-panel']}>
						<ChannelList channels={this.props.archive ? this.props.archive.channels : null} />
					</div>
					<ChannelView channel={this.props.archive ?
						this.props.archive.channels.get(this.props.currentChannel) :
						null
					}/>
					<Sidebar />
				</div>

				<div className={style['json-file-upload-form']}>
					<span>.json or .zip log file: </span>
					<input
						type="file"
						onChange={this.handleUpload}
					></input>
				</div>

				{this.props.showInfoOfUserID ?
					<Modal onClose={this.hideUserInfo}>
						<UserInfo userID={this.props.showInfoOfUserID}/>
					</Modal> :
					null}
			</div>
		);
	}
}

const App = connect(['archive', 'currentChannel', 'showInfoOfUserID'], {setUserInfoID, setArchive})(_App);

export default class Main extends Component {
	render () {
		return (
			<Provider store={store}>
				<App />
			</Provider>
		);
	}
}
