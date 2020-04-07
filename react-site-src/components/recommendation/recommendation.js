import React from 'react';

const recommendation = (props) => {
	return (
		<blockquote>
			<p>{props.quote}</p>
			<footer>{props.name} - <cite>{props.company}</cite></footer>
		</blockquote>
	)
}
export default recommendation;