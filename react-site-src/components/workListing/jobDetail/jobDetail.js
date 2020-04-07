import React from 'react';
import JobLink from './jobLink';
import JobAward from './jobAward';

const jobDetail = (props) => {
	const details = props.job;

	let awards = '';
	if(details.awards){
		awards = details.awards.map (
			(award, index) => <JobAward key={details.uid + index} url={award.url} copy={award.copy} />
		)
	}

	let links = '';
	if(details.links){
		links = details.links.map (
			(link, index) => <JobLink key={details.uid + index} url={link.url} copy={link.copy} />
		)
	}

	return (
		<details>
			<summary>
				<img className='thumb' alt='thubnail' src={'./images/thumb/' + details.thumb} />
			</summary>

			<p className='job-date'>{details.date.substr(4,2) + '.' + details.date.substr(0,4)}</p>
			<section>
				{details.copy.split('|').map( (p,i) => <p key={i}>{p}</p>)}
			</section>

			<h4>Tech stack:</h4>
			<p>{details.tech}</p>
			
			{ links !== '' ? <h4>Links:</h4> : ''}
			{links}
			
			{ awards !== '' ? <h4>Awards:</h4> : ''}
			{awards}
			
		</details>
	)
}

export default jobDetail;