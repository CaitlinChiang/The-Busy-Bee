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
						<div>
							<h1>How We Started</h1>
							<p>I have always loved Chemistry! I loved learning about different chemicals and its real world applications! Since i am just in high school, i wanted to come up with a line of products that not only ties with my love of chemistry but also spread the love to other people! Since this is a one-(wo)man operation, i handmake each product in small batches to ensure the quality of each and every scrub i sell. I want to be able to sell products that are proudly made by me! - Raffy</p>
						</div>

						<div>
							<h1>About Our Scrubs</h1>
							<p>Our scrubs are not only exfoliating, but they are also moisturizing. We formulated the recipe specifically with skin-loving oils and natural humectants! They are made with locally sourced ingredients and are sure to leave you feeling smooth and smelling fresh!</p>
						</div>
					</div>
				</div>
			</section>

			<section id="questions">
				<h1>FAQ's</h1>

				<div class="flip-card">
					<div class="flip-card-inner">
						<div class="flip-card-front">
							<p>Shelf Life</p>
						</div>
						<div class="flip-card-back">
							<p>🐝 8-10 months IF
							<br />Lid is closed tightly, no water trapped in container, no direct sunlight </p>
						</div>
					</div>
				</div>

				<div class="flip-card">
					<div class="flip-card-inner">
						<div class="flip-card-front">
							<p>Can the body scrub be used for the face?</p>
						</div>
						<div class="flip-card-back">
							<p>Our body scrubs are not recommended for extended use on the face. Sugar is very rough and can damage your pores (skin on the face is more sensitive than the rest of your body!) but don’t worry! We are whipping up something for your face soon 😜</p>
						</div>
					</div>
				</div>

				<div class="flip-card">
					<div class="flip-card-inner">
						<div class="flip-card-front">
							<p>Natural Whitening vs. Chemical Whitening</p>
						</div>
						<div class="flip-card-back">
							<p>Chemical whitening is harmful because it affects your body’s natural melanin production. This may cause future harm to your skin like wrinkles, uneven texture, and even increase your chances for skin cancer. Our scrubs are made to NATURALLY whiten your skin, we have no added chemicals to change your natural skin color. Our scrubs will remove darker spots but not your regular skin color!</p>
						</div>
					</div>
				</div>

				<div class="flip-card">
					<div class="flip-card-inner">
						<div class="flip-card-front">
							<p>Can you use the body scrub for shaving? </p>
						</div>
						<div class="flip-card-back">
							<p>Of course! Since it is very exfoliating, it will ensure that the razor will glide smoothly! It also leaves you moisturized so after shaving, you’ll be silky smooth!</p>
						</div>
					</div>
				</div>
			</section>

			<footer>&#169; The Busy Bee</footer>
		</div>
	)
}

export default Home