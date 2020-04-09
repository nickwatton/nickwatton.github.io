import React from 'react';
import Nav from '../nav/nav';

const header = (props) => {
	return (
		<React.Fragment>
			<header>
				<img alt="profile" src="./images/nickwatton.png" />
				<div>
					<h1>Nick Watton</h1>
					<p>Creative web developer</p>
				</div>
			</header>
			<Nav	click={props.click} 
						navList={props.navList}
						activeSection={props.activeSection} />
		</React.Fragment>
	)
}
export default header;