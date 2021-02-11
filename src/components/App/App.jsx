import style from './style.scss';
import '../../../vendor/normalize.css';
import {Component} from 'preact';
import createStore from 'unistore';
import {Provider, connect} from 'unistore/preact';

import deserializeArchiveFile from '../../deserialization/deserialization';

import ChannelList from '../ChannelList/ChannelList';
import ChannelView from '../ChannelView/ChannelView';
import Sidebar from '../Sidebar/Sidebar';
import Modal from '../Modal/Modal';
import UserInfo from '../UserInfo/UserInfo';
import {ErrorBoundaryHOC} from '../ErrorBoundary/ErrorBoundary';

import setArchive from '../../actions/set-archive';
import setUserInfoID from '../../actions/set-user-info-id';
import setCurrentChannel from '../../actions/set-current-channel';

const store = createStore({
	archive: null,
	currentChannel: null,
	showInfoOfUserID: null,
	channelScrollState: {},
	showSidebar: true
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

		deserializeArchiveFile(file)
			.then(archive => {
				// TODO: race condition from disposing new archive before old one is set?
				if (this.props.archive) this.props.archive.dispose();
				this.props.setArchive(archive);
				this.props.setCurrentChannel(archive.channels.size === 1 ?
					archive.channels.values().next().value.id :
					null);
			});
	}

	hideUserInfo () {
		this.props.setUserInfoID(null);
	}

	render () {
		return (
			<div id={style.app}>
				{this.props.archive ?
					<div className={style['channels-and-messages']}>
						{
							this.props.archive.type === 'server' ?
								<div className={style['channel-list-panel']}>
									<ChannelList channels={this.props.archive ? this.props.archive.channels : null} />
								</div> :
								null
						}
						<ChannelView channel={this.props.archive ?
							this.props.archive.channels.get(this.props.currentChannel) :
							null
						}/>
						<Sidebar />
					</div> :
					null
				}


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

const App = ErrorBoundaryHOC(
	connect(['archive', 'currentChannel', 'showInfoOfUserID'], {setUserInfoID, setArchive, setCurrentChannel})(_App)
);

export default class Main extends Component {
	render () {
		return (
			<Provider store={store}>
				<App />
			</Provider>
		);
	}
}
