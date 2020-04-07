import React from 'react';

const filterOption = (props) => {

	return (
		<div	className={props.id === props.currentJobFilter ? 'active' : ''} 
					data-id={props.id} 
					onClick={() => props.filterClick(props.id)} >
			{props.label.toUpperCase()}
		</div>
	)
}

export default filterOption;