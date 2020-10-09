import style from './style';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

import Avatar from '../../Avatar/Avatar';

import setUserInfoID from '../../../actions/set-user-info-id';

import getMemberName from '../../../util/get-member-name';
import getMemberColor from '../../../util/member-role-color';

const UserListing = connect([], {setUserInfoID})(props => {
	const {memberID, archive} = props;
	return (
		<div
			className={style['user']}
			onClick={() => props.setUserInfoID(memberID)}
		>
			<div className={style['user-avatar']}>
				<Avatar user={archive.users.get(memberID)} size={32}/>
			</div>
			<div
				className={style['username']}
				style={`color: ${getMemberColor(memberID, archive)}`}
			>
				{getMemberName(memberID, archive)}
			</div>
		</div>
	);
});

class UsersPanel extends Component {
	constructor (props) {
		super(props);
	}

	render () {
		const {archive} = this.props;

		if (archive === null || archive.type !== 'server') return null;

		const server = archive.data;

		const roleGroups = [];
		const roleMap = new Map();

		for (const member of server.members.values()) {
			const highestRole = member.roles.reduce((prevRole, curRole) =>
				prevRole && (prevRole.position > curRole.position) ? prevRole : curRole, null);

			if (roleMap.has(highestRole)) {
				roleMap.get(highestRole).push(member);
			} else {
				roleMap.set(highestRole, [member]);
			}
		}

		for (const [role, members] of roleMap) {
			members.sort((a, b) => a.name < b.name ? 1 : -1);
			roleGroups.push({role, members});
		}

		roleGroups.sort((a, b) => b.role.position - a.role.position);

		const nonMembers = [];

		for (const user of archive.users.values()) {
			if (server.members.has(user.id)) continue;
			nonMembers.push(user);
		}

		const roleGroupsElems = roleGroups.map(({role, members}) => (
			<div className={style['role-group']} key={role ? role.id : null}>
				{role ? <div className={style['role-header']}>{role.name}</div> : null}
				<div className={style['role-members']}>
					{
						members.map(member => (
							<UserListing
								memberID={member.id}
								archive={archive}
								key={member.id}
							/>
						))
					}
				</div>
			</div>
		));

		const panelInner = nonMembers.length > 0 ? (
			<>
				<section>
					<header>Current members</header>
					<div>{roleGroupsElems}</div>
				</section>
				<section>
					<header>Past users</header>
					<div>
						{
							nonMembers.map(user => (
								<UserListing
									memberID={user.id}
									archive={archive}
									key={user.id}
								/>
							))
						}
					</div>
				</section>
			</>
		) : roleGroupsElems;

		return (
			<div className={style['users-list']}>
				{panelInner}
			</div>
		);
	}
}

export default connect('archive')(UsersPanel);
