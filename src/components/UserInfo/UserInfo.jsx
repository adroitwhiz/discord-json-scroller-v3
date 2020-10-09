import style from './style.scss';

import {connect} from 'unistore/preact';

import Avatar from '../Avatar/Avatar';

const UserInfo = props => {
	const user = props.archive.users.get(props.userID);
	const member = props.archive.type === 'server' && props.archive.data.members.get(props.userID);
	return (
		<div className={style['user-info']}>
			<div className={style['avatar']}>
				<Avatar user={user} userID={props.userID} size={128}/>
			</div>
			<div className={style['name-and-nick']}>
				<div className={style['user-tag']}>
					<span className={style['user-name']}>{user ? user.username : 'Unknown user'}</span>
					<span className={style['user-discriminator']}>#{user ? user.discriminator : '0000'}</span>
				</div>
				{member && member.nickname !== null ? <div className={style['user-nickname']}>{member.nickname}</div> : null}
				<div className={style['user-id']}>{props.userID}</div>
			</div>
		</div>
	);
};

export default connect('archive')(UserInfo);
