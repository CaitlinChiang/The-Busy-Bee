import React from 'react'
import '../client_css/02-Homepage.css'

function Slider() {
	return (
		<div id="slider">
			<figure>
				<img src="/images/bg1.jpeg" />
				<img src="/images/bg2.jpeg" />
				<img src="/images/bg3.jpeg" />
				<img src="/images/bg4.jpeg" />
				<img src="/images/bg1.jpeg" />
			</figure>
		</div>
	)
}

function Home() {
	return (
		<div>
			<section id="home">

				{Slider()}
				<div class="fade-in"> <h1>The Busy Bee</h1> </div>
			
			</section>

			<section id="about">
				<div class="container">

					<div id="letter">
						<p>Our whipped sugar scrubs are handcrafted in small batches. They come in multiple scents and are sure to leave your skin feeling soft and smelling fresh. 😉</p>
						<p>You can use it for shaving too. 🥴</p>
					</div>
				</div>
			</section>
		</div>
	)
}

export default Home