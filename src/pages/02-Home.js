import React from 'react' 

function Slider() {
	return (
		<div id="slider">
			<figure>
				{/* <img src="/images/bg1.png" />
				<img src="/images/bg2.JPG" />
				<img src="/images/bg3.jpg" />
				<img src="/images/bg4.jpg" />
				<img src="/images/bg1.png" /> */}
			</figure>
		</div>
	)
}

function Home(props) {
	return (
		<div>
			<section id="home">

				{/* {Slider()}
				<div class="fade-in"> <h1>Rolls</h1> <button onClick={props.goProducts}>Order Now!</button> </div>
				<a href="#about"><img class="downArrow" src="https://image.flaticon.com/icons/svg/2316/2316598.svg" /></a> */}
			
			</section>

			<section id="about">
				<div class="container">

					<div id="letter">
						{/* <h6>A Letter From Rolls</h6>
						<p>We've always loved baking. It came as second nature to us. We always baked together during the holidays and would give out our creations to family and friends. Since we were both 16 when we first started it November 2019, we wanted a bit of entrepreneurial experience. We decided to open up a small online business focusing on - you guessed it! - Cinnamon Rolls.
						<br /><br />Being in high school and managing a business was very challenging. This really tested our time management and would often lead to sleepless nights and early mornings. Since we were young, we still had many aspects to learn and we believe that this helped shape both us and our business. 
						<br /><br />Cinammon Rolls was one of our favorite foods but we wanted to experiment to create a Roll that was both timeless and ageless. We tried countless tweaks and improvements to come up with the Rolls we serve today!
						<br /><br />Today, we make sure each Roll is handmade with love and is individually checked for their quality. Before sending them out, we carefully roll each one and shower them with our creamy frosting. All our Rolls mirror our love, passion, and commitment and we are sure that you will be able to taste it in every bite!
						<br /><br />Always with love, Raffy and Francine.
						</p>
						<img src="/images/logo_navbar.jpg" height="100px" /> */}
					</div>

					<div id="siteInfo">
						{/* <h6>Contact Us:</h6>
						<p>Facebook: <a href="https://www.facebook.com/officialrolls.ph/">Rolls</a>
						<br /><br />Instagram: <a href="https://www.instagram.com/rolls.ph/">rolls.ph</a>
						<br /><br />Phone: 0917 535 0923
						<br /><br />Customer Support: support@therollskitchen.com
						<br /><br />Payment Concerns: payment@therollskitchen.com
						<br /><br />Business Inquiries: officialrolls.ph@therollskitchen.com</p> */}
					</div>
				</div>
			</section>
		</div>
	)
}

export default Home