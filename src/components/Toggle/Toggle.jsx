import style from './style.scss';

import classNames from '../../util/class-names';

const Toggle = ({checked, ...props}) => (
	<>
		<input type="checkbox" className={style['hidden-checkbox']} checked={checked} {...props} />
		<div className={classNames({[style['toggle']]: true, [style['checked']]: checked})}>
			<div className={style['slider']} />
		</div>
	</>
);

export default Toggle;
