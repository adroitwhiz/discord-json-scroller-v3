import style from './style';

const Attachment = props => {
	return (
		<div className={style.attachment}>
			{
				/\.(jpe?g|png|gif)$/.test(props.attachment.url.toLowerCase()) ?
					<img
						width={props.attachment.width || null}
						height={props.attachment.height || null}
						src={props.attachment.url}
						className={style['attachment-image']}
					/> :
					<div className={style['attachment-file']}>
						<a href={props.attachment.url}>{props.attachment.name}</a>
						<span className={style['attachment-size']}>{props.attachment.size} bytes</span>
					</div>
			}

		</div>
	);
};

export default Attachment;
