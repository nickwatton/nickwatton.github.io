import React from 'react';
import Recommendation from '../../../components/recommendation/recommendation';
import StaticSection from '../staticPage/staticSection/staticSection';
import WorkListing from '../../../components/workListing/workListing';

const homePage = (props) => {
	return (
		<div>
			{/* Recommendation quotes */}
			{props.quotes.map( 
					(quote, index) => <Recommendation quote={quote.quote} 
							key={'q'+index} 
							name={quote.name} 
							company={quote.position} /> 
			)}

			{/* Static content sections - section title in this special case */}
			{props.page.sections.map(
				section => (
					<StaticSection 
							body={section.body}
							header={section.header} 
							key={Math.random()}/>
				)
			)}

			{/* Job list */}
			<WorkListing jobs={props.jobs} 
							// jobClick={props.jobClick}
							filter={props.filter} />
			
		</div>
	)
}

export default homePage;
