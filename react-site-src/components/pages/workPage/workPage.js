import React from 'react';
import StaticSection from '../staticPage/staticSection/staticSection';
import WorkListing from '../../../components/workListing/workListing';
import Filter from '../../filter/filter';

const workPage = (props) => {
	return (
		<div>
			{/* Add in static content sections - section title in this special case */}
			{props.page.sections.map(
				section => (
					<StaticSection body={section.body}
													header={section.header} 
													key={Math.random()}/>
				)
			)}

			{/* Add filter menu */}
			<Filter	filters={props.filters} 
							filterClick={props.filterClick}
							currentJobFilter={props.currentJobFilter} />

			{/* Filtered job list */}
			<WorkListing jobs={props.jobs} 
							// jobClick={props.jobClick}
							filter={props.currentJobFilter} />
		</div>
	)
}
export default workPage;