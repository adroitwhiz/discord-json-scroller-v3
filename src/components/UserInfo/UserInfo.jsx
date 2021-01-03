import style from './style.scss';

import {connect} from 'unistore/preact';

import Avatar from '../Avatar/Avatar';

import formatTimestamp from '../../util/format-timestamp';

const UserInfo = props => {
	const user = props.archive.users.get(props.userID);
	const member = props.archive.type === 'server' && props.archive.data.members.get(props.userID);
	return (
		<div className={style['user-infobox']}>
			<div className={style['avatar']}>
				<Avatar user={user} userID={props.userID} size={128}/>
			</div>
			<div className={style['details']}>
				<section>
					<div className={style['user-tag']}>
						<span className={style['user-name']}>{user ? user.username : 'Unknown user'}</span>
						<span className={style['user-discriminator']}>#{user ? user.discriminator : '0000'}</span>
					</div>
					<div className={style['user-id']}>{props.userID}</div>
				</section>
				{
					member ?
						<section>
							{
								member.nickname === null ?
									null :
									<div className={style['user-nickname']}>{member.nickname}</div>
							}
							{
								member.joinedTimestamp === null ?
									null :
									<div
										className={style['user-joined-timestamp']}
									>Joined this server {formatTimestamp(member.joinedTimestamp)}</div>
							}
							{
								member.roles.filter(role => role.name !== '@everyone').map(role => (
									<div className={style['role']} key={role.id} style={role.color === '#000000' ? null : `border-color: ${role.color}`}>
										<span className={style['role-color']} style={role.color === '#000000' ? null : `background-color: ${role.color}`}></span>
										<span className={style['role-name']}>{role.name}</span>
									</div>
								))
							}
						</section> :
						null
				}
			</div>
		</div>
	);
};

export default connect('archive')(UserInfo);
