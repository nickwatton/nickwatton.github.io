import React from 'react';
import StaticSection from './staticSection/staticSection';

const staticPage = (props) => {
	return (
		<div>
			{props.page.sections.map(
				section => (
					(!section.archived) ? 
						<StaticSection body={section.body}
													header={section.header} 
													className={section.className}
													key={Math.random()}/> : ''
				)
			)}
		</div>
	)
}
export default staticPage;