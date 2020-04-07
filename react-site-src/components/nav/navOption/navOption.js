import React from 'react'

const navOption = (props) => {
	return (
		<div	className={props.label === props.activeSection ? 'active' : ''} 
					// data-id={props.id} 
					onClick={() => props.click(props.id)} >
			{props.label.toUpperCase()}
		</div>
	)
}
export default navOption;