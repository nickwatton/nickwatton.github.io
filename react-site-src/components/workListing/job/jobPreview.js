import React from 'react'
import JobDetail from '../jobDetail/jobDetail';

const job = (props) => {
	const details = props.job;
	let classes = (props.id % 2 === 0) ? 'job even' : 'job odd';
	return (
		<div className={classes}>
			<p className='client'>{details.client}</p>
			<p className='title'>{details.job}</p>
			<p className='agency'>{details.agency}</p>
			<JobDetail job={details} />
		</div>
	)
}
export default job;