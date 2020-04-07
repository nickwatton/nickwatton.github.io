import React from 'react'

const staticSection = (props) => {
	return (
		<section>
			<header>{props.header}</header>
			<article>
				{props.body.split('|').map( (p,i) => <p key={i}>{p}</p>)}
			</article>
		</section>
	)
}
export default staticSection;