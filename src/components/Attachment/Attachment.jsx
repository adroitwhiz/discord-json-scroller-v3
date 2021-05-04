import style from './style';

import {connect} from 'unistore/preact';

import setViewedImage from '../../actions/set-viewed-image';

const MAX_IMAGE_SIZE = 500;

// `width: auto; height: auto` overrides unloaded images' "intrinsic size", causing the scroll to jump when they load,
// so use this JS to style them instead
const sizeImageAttachment = attachment => {
	if (!attachment.width || !attachment.height) {
		// fall back to CSS for dynamically-sized images
		return `max-width: ${MAX_IMAGE_SIZE}px; max-height: ${MAX_IMAGE_SIZE}px; width: auto; height: auto;`;
	}

	const largestDimension = Math.max(attachment.width, attachment.height);
	if (largestDimension <= MAX_IMAGE_SIZE) return '';
	const scaleFactor = MAX_IMAGE_SIZE / largestDimension;

	return `width: ${attachment.width * scaleFactor}px; height: ${attachment.height * scaleFactor}px;`;
};

const Attachment = props => {
	return (
		<div className={style.attachment}>
			{
				/\.(jpe?g|png|gif)$/i.test(props.attachment.url) ?
					<img
						width={props.attachment.width || null}
						height={props.attachment.height || null}
						src={props.attachment.url}
						className={style['attachment-image']}
						style={sizeImageAttachment(props.attachment)}
						onClick={props.setViewedImage.bind(null, props.attachment)}
					/> :
					<div className={style['attachment-file']}>
						<a href={props.attachment.url}>{props.attachment.name}</a>
						<span className={style['attachment-size']}>{props.attachment.size} bytes</span>
					</div>
			}

		</div>
	);
};

export default connect([], {setViewedImage})(Attachment);
