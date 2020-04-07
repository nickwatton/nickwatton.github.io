import React from 'react';
import JobLink from './jobLink';
import JobAward from './jobAward';

const jobDetail = (props) => {
	const details = props.job;

	let awards = '';
	if(details.awards){
		awards = details.awards.map (
			(award, index) => <JobAward key={'award' + details.uid + index} url={award.url} copy={award.copy} />
		)
	}

	let links = '';
	if(details.links){
		links = details.links.map (
			(link, index) => <JobLink key={'link' + details.uid + index} url={link.url} copy={link.copy} />
		)
	}

	return (
		<details>
			<summary>
				<img className='thumb' alt='thubnail' src={'./images/thumb/' + details.thumb} />
			</summary>

			<p className='job-date'>{details.date.substr(4,2) + '.' + details.date.substr(0,4)}</p>
			
			<section>
				{details.copy.split('|').map( (p,i) => <p key={'copy'+i}>{p}</p>)}

				<h4>Tech stack:</h4>
				<div>{details.tech.split('|').map( (p,i) => <p className='tech-stack' key={'tech'+i}>{p}</p>)}</div>
				
				{ links !== '' ? <h4>Links:</h4> : ''}
				{links}
				
				{ awards !== '' ? <h4>Awards:</h4> : ''}
				{awards}
			</section>
			
		</details>
	)
}

export default jobDetail;