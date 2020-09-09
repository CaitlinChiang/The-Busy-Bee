import React, { Component } from 'react'
import { HashLink as Link } from 'react-router-hash-link'
import { withRouter } from 'react-router-dom'
import '../client_css/01-Navbar.css'

class Navbar extends Component {
	
	// Desktop Menu Contact Us Toggle
	contact_show = _ => document.getElementById('contact').style.width = '370px'
	contact_hide = _ => document.getElementById('contact').style.width = '0px'

	// Mobile Menu Toggle
	mobileMenu_hide = _ => document.getElementById('mobileMenuToggler').checked = false

	render() {
		return (
			<header>
				<section class="desktopNavbar">
					<div class="logo"> 
						<img src="/images/logo.jpg" /> 
					</div>

					<ul>
						<li> <Link to="/#home">Home</Link> </li>
						<li> <Link to="/#about">About</Link> </li>
						<li> <Link to="/products">Shop</Link> </li>
						<li> <Link to="/features">Features</Link> </li>
						<li> <Link onClick={() => this.contact_show()}>Contact Us</Link> </li>
					</ul>
					
					<div class="cart"> 
						<Link to="/cart"> <img src="/images/cart.png" /> </Link>
					</div>
				</section>

				<section class="contact" id="contact">
					<span class="contactClose" onClick={this.contact_hide}>&times;</span>

					<div>
						<h1>CONTACT US</h1>
						<p>thebusybee.ph@gmail.com</p>
						<div>
							<a href=""> <i class="fa fa-facebook" aria-hidden="true"></i> </a>
							<a href=""> <i class="fa fa-instagram" aria-hidden="true"></i> </a>
						</div>
					</div>
				</section>

				<section class="mobileNavbar">
					<div class="logo"> 
						<img src="/images/logo.jpg" /> 
					</div>
					
					<div class="mobileMenuContainer">
						<input type="checkbox" class="mobileMenuToggler" id="mobileMenuToggler" />

						<div class="hamburger"><div></div></div>

						<div class="mobileMenu">
							<div>
								<div>
									<ul>
										<li> <Link to="/#home" onClick={this.mobileMenu_hide}>Home</Link> </li>
										<li> <Link to="/#about" onClick={this.mobileMenu_hide}>About</Link> </li>
										<li> <Link to="/products" onClick={this.mobileMenu_hide}>Shop</Link> </li>
										<li> <Link to="/features" onClick={this.mobileMenu_hide}>Features</Link> </li>
									</ul>

									<div>
										<p>thebusybee.ph@gmail.com</p>
										<div>
											<a href=""> <i class="fa fa-facebook" aria-hidden="true"></i> </a>
											<a href=""> <i class="fa fa-instagram" aria-hidden="true"></i> </a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="cart"> 
						<Link to="/cart"> <img src="/images/cart.png" /> </Link>
					</div>
				</section>
			</header>
		)
	}
}

export default withRouter(Navbar)