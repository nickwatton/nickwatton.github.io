import React, { Component } from 'react';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import StaticPage from './components/pages/staticPage/staticPage';
import HomePage from './components/pages/homePage/homePage';
import WorkPage from './components/pages/workPage/workPage';
import ContactPage from './components/pages/contactPage/contactPage';
import './App.scss';

class App extends Component {

	state = {
		jobs:[],
		pages:[],
		quotes:[]
	}

	navHandler = (sectionID) => {
		const mutable = {...this.state};
		mutable.activeSection = sectionID;
		this.setState(mutable);
	}

	filterHandler = (filterID) => {
		const mutable = {...this.state};
		mutable.currentJobFilter = filterID;
		this.setState(mutable);
	}

	componentDidMount() {
		let serviceURL = './data/data.json';
		let requestOptions = {
			method: 'GET',
			redirect: 'follow'
		};
		fetch(serviceURL, requestOptions)
			.then(response => response.text())
			.then(result => { this.setData(JSON.parse(result)) })
			.catch(error => { console.log(error) });
	}

	setData(data) {
		const mutable = {...this.state};
		mutable.pages = [...mutable.pages, ...data.pages];

		// Exclude archived recommendations
		mutable.quotes = [...mutable.quotes, ...data.quotes.filter(quote => !quote.archived)];

		// Exclude archived examples
		mutable.jobs = data.work.filter(job => !job.archived);

		mutable.jobFilters = data.workFilters;
		mutable.activeSection = data.activeSection;
		mutable.copyrightYear = data.copyrightYear;
		mutable.homeFilter = data.homeFilter;
		mutable.currentJobFilter = data.homeFilter;
		this.setState(mutable);
	}

	render() {
		let pageToDisplay = '';
		for(let i = 0; i < this.state.pages.length; i++){
			if(this.state.pages[i].id === this.state.activeSection){
				let page = this.state.pages[i];
				if(!page.static){
					switch(page.id){
						case 'home':
							pageToDisplay = <HomePage key={page.id}
															filter={this.state.homeFilter}
															page={page} 
															quotes={this.state.quotes} 
															jobs={this.state.jobs} />;
							break;
						case 'work':
							pageToDisplay = <WorkPage key={page.id} 
															page={page} 
															currentJobFilter={this.state.currentJobFilter}
															filters={this.state.jobFilters}
															activeSection={this.state.activeSection}
															filterClick={ this.filterHandler }
															jobs={this.state.jobs} />;
							break;
						case 'contact':
							pageToDisplay = <ContactPage key={page.id} />;
							break;
						default:
							console.log('Error. Unknown page:', page.id);
					}
				}
				else{
					pageToDisplay = <StaticPage key={page.id} page={page} />;
				}
			}
		}
		
		return(
			<div className = "App">
				<Header
					click={ this.navHandler }
					navList={this.state.pages}
					activeSection={this.state.activeSection}/>

				{pageToDisplay}

				<Footer year={this.state.copyrightYear} />
			</div>
		)
	};
}

export default App;
