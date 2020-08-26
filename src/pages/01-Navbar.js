import React, { Component } from 'react'
import * as firebase from 'firebase'


class Navbar extends Component {
	state = {
		// consumer: this.props.consumer
	}

	// logout = () => {
	// 	const confirm = window.confirm('Are you sure you would like to logout?')
	// 	if (confirm) { firebase.auth().signOut() }
	// 	window.location.reload(false)
	// }

	goHome = () => this.props.goHome()
	goProducts = () => this.props.goProducts()
	goArticles = () => this.props.goArticles()
	goCart = () => this.props.goCart()

	render() {
		return (
			<header>
				<div class="navbar_buttons">
					<div class="logo"> 
						{/* <img src="/images/logo_navbar.jpg" />  */}
						<p>The Busy Bee</p>
					</div>

					<button onClick={this.goHome}><a href="#home">Home</a></button>
					<button onClick={this.goHome}><a href="#about">About</a></button>
					<button onClick={this.goProducts}>Order</button>
					{/* <button onClick={this.goArticles}>Articles</button> */}
					{/* {this.props.consumer.trim() !== "" ? <button onClick={() => this.logout()}>Logout</button> : null} */}

					{/* <div class="profile"> <img onClick={this.goCart} src="/images/cart.png" /> </div> */}
				</div>					
			</header>
		)
	}
}

export default Navbar 