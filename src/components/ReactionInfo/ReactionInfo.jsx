import style from './style.scss';

import {connect} from 'unistore/preact';

import Avatar from '../Avatar/Avatar';
import {ReactionEmoji} from '../Emoji/Emoji';

import setReactionInfoIndex from '../../actions/set-reaction-info-index';

import classNames from '../../util/class-names';
import getMemberName from '../../util/get-member-name';

const ReactionInfo = connect(['reactionsToShow', 'showReactionIndex', 'archive'], {setReactionInfoIndex})(props => {
	const {archive, reactionsToShow, showReactionIndex, setReactionInfoIndex} = props;
	const reaction = reactionsToShow[showReactionIndex];
	return (
		<div className={style['reaction-info']}>
			<div className={style['reactions']}>
				{reactionsToShow.map((reaction, index) =>
					<div
						className={classNames({
							[style['reaction']]: true,
							[style['selected']]: index === showReactionIndex
						})}
						key={reaction.emoji}
						onClick={() => setReactionInfoIndex(index)}
					>
						<ReactionEmoji emoji={reaction.emojiIsCustom ?
							archive.emojis.get(reaction.emoji) :
							reaction.emoji} />
						<span className={style['count']}>{reaction.count}</span>
					</div>
				)}
			</div>
			<div className={style['reaction-users']}>
				{reaction.users.map(userID => {
					const user = archive.users.get(userID);
					// There's one archive where I forgot to save users that only exist through reactions
					if (!user) return null;

					return (
						<div
							className={style['reaction-user']}
							key={userID}
						>
							<div className={style['user-avatar']}>
								<Avatar user={user} size={32}/>
							</div>
							<div className={style['user-nickname']}>
								{getMemberName(userID, archive)}
							</div>
							<div className={style['username']}>
								{user.username}#{user.discriminator}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
});

export default ReactionInfo;
