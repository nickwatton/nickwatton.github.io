import React from 'react';
import Nav from '../nav/nav';

const header = (props) => {
	return (
		<React.Fragment>
			<header>
				<img alt="profile" src="./images/header.png" />
				<h1>Nick Watton</h1>
				<p>Creative web developer</p>
			</header>
			<Nav	click={props.click} 
						navList={props.navList}
						activeSection={props.activeSection} />
		</React.Fragment>
	)
}
export default header;