import React, { Component } from 'react'
import '../services/firebaseConfig'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './01-Navbar'
import Homepage from './02-Homepage'
import Products from './03-Products'
import Articles from './04-Articles'
import Cart from './05-Cart'
import Order from './06-Order'

class Client extends Component {
	state = {
		cart: []
	}

	// Data Management
	componentWillMount = _ => this.fetchLocalStorage()

	componentDidMount = _ => setInterval(() => { this.updateLocalStorage(); }, 500)

	fetchLocalStorage = _ => {
		var storedCart = JSON.parse(localStorage.getItem("cart"))
	
		if (storedCart !== '' || storedCart !== null) {
			this.setState({ cart: storedCart })
		}
	}

	updateLocalStorage = _ => localStorage.setItem("cart", JSON.stringify(this.state.cart))

	// Update Global Cart State
	updateCart_add = item => this.setState({ cart: [...this.state.cart, ...[item] ] })

	updateCart_delete = item_timestamp => {
		const { cart } = this.state

		for (let i = cart.length - 1; i >= 0; i--) {
			if (cart[i].timestamp === item_timestamp) {
				cart.splice(i, 1)
				this.setState({ cart })
			}
		}
	}

	updateCart_clear = _ => this.setState({ cart: [] })

	render() {
		const { cart } = this.state

		return (
			<Router>
				<Navbar />
				<Switch>
					<Route exact path="/" component={Homepage} />
					<Route exact path="/products" render={() => <Products updateCart_add={this.updateCart_add} />} />
					<Route exact path="/features" component={Articles} />
					<Route exact path="/cart" render={() => <Cart cart={cart} updateCart_delete={this.updateCart_delete} />} />
					<Route exact path="/order" render={() => <Order cart={cart} updateCart_clear={this.updateCart_clear} />} />
				</Switch>
			</Router>
		)
	}
}

export default Client