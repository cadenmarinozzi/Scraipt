import './NavItem.scss';
import { Component, createRef } from 'react';
import { Link } from 'react-router-dom';

class NavItem extends Component {
	constructor(props) {
		super(props);

		this.ref = createRef();

		this.state = {
			current: props.current,
		};
	}

	componentDidMount() {
		const { setBounds, label } = this.props;

		const element = this.ref.current;

		const x = element.offsetLeft;
		const y = element.offsetTop;

		const width = element.getBoundingClientRect().width;
		const height = element.getBoundingClientRect().height;

		setBounds({ label, x, y, width, height });
	}

	setCurrent() {
		const { setCurrent, label } = this.props;

		this.setState({ current: true });

		setCurrent(label);
	}

	setHover() {
		const { setHover, label } = this.props;
		this.setState({ hover: true });

		setHover(label);
	}

	render() {
		const { label, link } = this.props;

		return (
			<div
				className='nav-item'
				ref={this.ref}
				// onMouseOver={this.setHover.bind(this)}
				onClick={this.setCurrent.bind(this)}>
				<Link className='label' to={link}>
					{label}
				</Link>
			</div>
		);
	}
}

export default NavItem;
