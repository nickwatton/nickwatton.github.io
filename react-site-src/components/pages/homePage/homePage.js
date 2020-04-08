import React from 'react';
import Recommendation from '../../../components/recommendation/recommendation';
import StaticSection from '../staticPage/staticSection/staticSection';
import WorkListing from '../../../components/workListing/workListing';

const homePage = (props) => {

	/* Recommendation quotes */
	const recommendations = props.quotes.map( 
		(quote, index) => <Recommendation quote={quote.quote} 
													key={'q'+index} 
													name={quote.name} 
													company={quote.position} /> 
		);

	/* Static content sections - section title in this special case */
	const staticSections = props.page.sections.map(
		section => (
			(!section.archived) ? 
				<StaticSection 
						body={section.body}
						header={section.header} 
						className={section.className}
						key={Math.random()}/> : ''
		)
	)

	return (
		<div>
			{recommendations}

			{staticSections}

			{/* Job list */}
			<WorkListing jobs={props.jobs} filter={props.filter} />
		</div>
	)
}

export default homePage;
