import style from './style.scss';

import {Component} from 'preact';

class ErrorBoundary extends Component {
	constructor (props) {
		super(props);

		this.state = {
			hasError: false,
			error: null
		};
	}

	componentDidCatch (error) {
		this.setState({
			hasError: true,
			error
		});
	}

	render () {
		if (!this.state.hasError) return this.props.children;


		return (
			<div className={style['crash-wrapper']}>
				<header className={style['crash-header']}>Oopsie Woopsie UwU</header>
				<div className={style['error']}>{this.state.error.message}</div>
				<div className={style['stack']}>{this.state.error.stack}</div>
			</div>
		);
	}
}

const ErrorBoundaryHOC = WrappedComponent => (
	props => (
		<ErrorBoundary>
			<WrappedComponent {...props} />
		</ErrorBoundary>
	)
);

export {ErrorBoundaryHOC};
export default ErrorBoundary;
