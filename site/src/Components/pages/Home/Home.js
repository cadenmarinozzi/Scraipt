import { Component } from 'react';
import './Home.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { Gradient } from 'react-gradient';
import Sparkles from 'Components/shared/Sparkles';

const gradients = [
	['rgb(255, 0, 0)', 'rgb(255, 20, 150)'],
	['rgb(0, 255, 0)', 'rgb(0, 0, 255)'],
];

class Home extends Component {
	render() {
		return (
			<div className='home'>
				<div className='section'>
					<div className='hero-container'>
						<span className='hero-title'>
							<span>Scrape</span> <span>away</span>{' '}
							<span>inefficient</span> <span>code</span>{' '}
							<span>using</span>{' '}
							<Sparkles>
								<Gradient
									gradients={gradients}
									property='text'
									element='span'
									angle='30deg'>
									AI
								</Gradient>
							</Sparkles>
						</span>
					</div>
					<div className='copy-container'>
						<Sparkles>
							<span className='copy-text'>
								npm install scraipt
							</span>
						</Sparkles>
						<FontAwesomeIcon icon={faCopy} className='copy-icon' />
					</div>
					<span className='caption'>Website in progress...</span>
				</div>
			</div>
		);
	}
}

export default Home;
