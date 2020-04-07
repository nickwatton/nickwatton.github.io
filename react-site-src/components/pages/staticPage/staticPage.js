import React from 'react';
import StaticSection from './staticSection/staticSection';

const staticPage = (props) => {
	return (
		<div>
			{props.page.sections.map(
				section => (
					<StaticSection body={section.body}
													header={section.header} 
													key={Math.random()}/>
				)
			)}
		</div>
	)
}
export default staticPage;