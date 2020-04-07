import React from 'react';

const jobLink = (props) => {
	return (
		<p className='job-link'>
			<a href={props.url} alt={props.copy}>{props.copy}</a>
		</p>
	)
}
export default jobLink;