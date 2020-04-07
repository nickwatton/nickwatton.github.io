import React from "react";

const contactPage = (props) => {
	return(
		<section className='contact-page'>
			<p>Nick Watton</p>
			<p>Edinburgh</p>
			<p><a href='mailto:nickwatton@gmail.com'>nickwatton@gmail.com</a></p>

			<div className="social codepen">
					<a href="https://codepen.io/2Mogs/">
							<img src="images/codepen-logo.svg" width="150" height="33" border="0" alt="Visit my CodePen" />
					</a>
			</div>

			<div className="social">
					<a href="http://www.linkedin.com/in/nickwatton">
						<img src="http://www.linkedin.com/img/webpromo/btn_myprofile_160x33.png" width="160" height="33" border="0" alt="View my profile on LinkedIn" />
					</a>
			</div>

		</section>
	)
}

export default contactPage;