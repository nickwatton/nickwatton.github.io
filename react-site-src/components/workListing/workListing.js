import React from 'react';
import JobPreview from './job/jobPreview';

const workListing = (props) => {
	const filteredList = props.jobs.filter(job => job.filter.includes(props.filter));
	return (
		<div className='jobListing'>
			{filteredList.map(
				(job, index) => (
					<JobPreview 
							id={index}
							key={'job' + job.uid}
							job={job} />
				)
			)}
		</div>
	)
}
export default workListing;