import React, { Component } from 'react'
import { HashLink as Link } from 'react-router-hash-link'
import { withRouter } from 'react-router-dom'
import '../admin_css/01-Navbar.css'

class Navbar extends Component {
	
	// Desktop Menu Contact Us Toggle
	contact_show = _ => document.getElementById('contact').style.width = '370px'
	contact_hide = _ => document.getElementById('contact').style.width = '0px'

	// Mobile Menu Toggle
	mobileMenu_hide = _ => document.getElementById('mobileMenuToggler').checked = false

	render() {
		return (
			<header id="admin_navbar">
				<section class="desktopNavbar">
					<ul>
						<li> <Link to="/mzU4d@t45acsXzBUKKhwaq543jjf0ldkAnE9L4Xrr725ZcVRKWysVJDFSAFBQE7xky3PbVQU8Dq3q@534fgdgjtsryhfdsajfjdsekolhjZAvppAZ">Controls</Link> </li>
						<li> <Link to="/mzU4d@t45acsXzBUKKhwaq543jjf0ldkAnE9L4Xrr725ZcVRKWysVJDFSAFBQE7xky3PbVQU8Dq3q@534fgdgjtsryhfdsajfjdsekolhjZAvppAZ/orders">Orders</Link> </li>
					</ul>
				</section>

				<section class="mobileNavbar">
					<div class="mobileMenuContainer" id="admin_mobileMenuContainer">
						<input type="checkbox" class="mobileMenuToggler" id="mobileMenuToggler" />

						<div class="hamburger"><div></div></div>

						<div class="mobileMenu">
							<div>
								<div>
									<ul>
										<li> <Link to="/mzU4d@t45acsXzBUKKhwaq543jjf0ldkAnE9L4Xrr725ZcVRKWysVJDFSAFBQE7xky3PbVQU8Dq3q@534fgdgjtsryhfdsajfjdsekolhjZAvppAZ" onClick={this.mobileMenu_hide}>Controls</Link> </li>
										<li> <Link to="/mzU4d@t45acsXzBUKKhwaq543jjf0ldkAnE9L4Xrr725ZcVRKWysVJDFSAFBQE7xky3PbVQU8Dq3q@534fgdgjtsryhfdsajfjdsekolhjZAvppAZ/orders" onClick={this.mobileMenu_hide}>Orders</Link> </li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</section>
			</header>
		)
	}
}

export default withRouter(Navbar)