import { Component } from 'react';
import Logo from 'assets/images/Logo.png';
import './Navbar.scss';
import NavItem from './NavItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const navItems = [
	{
		name: 'Home',
		link: '/',
	},
	// {
	// 	name: 'About',
	// 	link: '/about',
	// },
	// {
	// 	name: 'Contact',
	// 	link: '/contact',
	// },
];

class Navbar extends Component {
	constructor() {
		super();

		this.state = {
			selectedNavItem: navItems[0].name,
			hoveredNavItem: null,
		};
	}

	setBounds({ label, x, y, width, height }) {
		this.bounds = {
			...this.bounds,
			[label]: { x, y, width, height },
		};
	}

	setCurrent(selectedNavItem) {
		this.setState({ selectedNavItem });
	}

	setHover(hoveredNavItem) {
		this.setState({ hoveredNavItem });
	}

	render() {
		const { round } = this.props;
		const { hoveredNavItem, selectedNavItem } = this.state;
		const bounds = this.bounds ?? {};

		const navItemsMap = navItems.map((item, index) => {
			const isCurrent = selectedNavItem === item.name;

			return (
				<NavItem
					key={index}
					label={item.name}
					link={item.link}
					setBounds={this.setBounds.bind(this)}
					setCurrent={this.setCurrent.bind(this)}
					setHover={this.setHover.bind(this)}
					current={isCurrent}
				/>
			);
		});

		const currentBounds = hoveredNavItem
			? bounds[hoveredNavItem]
			: bounds[selectedNavItem];

		console.log(bounds);

		const x = Math.round(currentBounds?.x ?? 0);
		const width = Math.round(currentBounds?.width ?? 0);

		return (
			<div className={`navbar ${round && 'navbar-round'}`}>
				<div className='section'>
					<img className='logo' src={Logo} alt='Scraipt Logo' />
				</div>
				<div className='section center-section'>
					{/* <div
						className='nav-item-hover'
						style={{
							transform: `translate(calc(${x}px), -50%)`,
							width: `calc(${width}px)`,
						}}
					/> */}
					{navItemsMap}
				</div>
				<div className='section'>
					<a href='https://npmjs.com/package/scraipt'>
						<i className='fa-brands fa-npm icon fa-xl' />
					</a>
					<a href='https://github.com/cadenmarinozzi/Scraipt'>
						<i className='fa-brands fa-github icon' />
					</a>
				</div>
			</div>
		);
	}
}

export default Navbar;
