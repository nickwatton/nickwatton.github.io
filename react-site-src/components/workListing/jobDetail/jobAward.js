import React from 'react';

const jobAward = (props) => {
	return(
		<p className='job-award'>
			<a href={props.url} alt={props.copy}>{props.copy}</a>
		</p>
	)
}

export default jobAward;