import style from './style.scss';

const ImageModal = props => (
	<div className={style['image-modal']}>
		<img
			src={props.viewedImage.url}
			width={props.viewedImage.width || null}
			height={props.viewedImage.height || null}
			className={style['image']}
		/>
		<a
			className={style['image-link']}
			href={props.viewedImage.url}
			rel="noopener noreferrer"
			target="_blank"
		>Open original</a>
	</div>
);

export default ImageModal;
