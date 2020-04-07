import React from 'react';
import FilterOption from './filterOption/filterOption';

const filter = (props) => {
	return (
		<div className='filterMenu'>
			{props.filters.map( filter => <FilterOption 
																			filterClick={props.filterClick} 
																			label={filter.label} 
																			id={filter.id} 
																			key={filter.id}
																			currentJobFilter={props.currentJobFilter} /> )}
		</div>
	)
}

export default filter;