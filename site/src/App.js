import Home from 'Components/pages/Home';
import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Navbar from 'Components/containers/Navbar';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className='background-radial-gradient' />
				<div className='content'>
					<Navbar />
					<div className='app'>
						<Routes>
							<Route path='*' element={<Home />} />
						</Routes>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
