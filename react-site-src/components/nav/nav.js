import React from 'react';
import NavOption from './navOption/navOption';

const nav = (props) => {
	return (
		<div className='menu'>
			{props.navList.map( nav => <NavOption 
																			click={props.click} 
																			label={nav.id} 
																			id={nav.id} 
																			key={nav.id}
																			activeSection={props.activeSection} /> )}
		</div>
	)
}
export default nav;