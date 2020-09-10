import React, { Component } from 'react'
import '../client_css/05-Cart.css'
import { HashLink as Link } from 'react-router-hash-link'

class Cart extends Component {
	state = {
		cart: this.props.cart
    }
    
    // Render Data
    cart_render = props => {
        return (
            <tr>
                <td>{props.product_name}</td>
                <td>{props.quantity}</td>
                <td>P{props.price}.00</td>
                <td><span onClick={() => this.props.updateCart_delete(props.timestamp)}>&times;</span></td>
            </tr>
        )
    }

	render() {
        const { cart } = this.state

		return (
            <div>
                <section id="cart">
                    <div class="container">
                        <div id="cartHeader"> <h1>Cart</h1> </div>
                        <div class="table">
                            <table class="customerTable">
                                <thead>
                                    <tr>
                                        <th>ORDER</th>
                                        <th>QUANTITY</th>
                                        <th>PRICE</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { cart == null ? '' : cart.map(this.cart_render) }
                                </tbody>
                            </table>
                        </div>

                        <Link to="/order"><button id="checkoutButton">Checkout</button></Link>
                    </div>
                </section>

                <footer>&#169; The Busy Bee</footer>
            </div>
		)
	}
}

export default Cart