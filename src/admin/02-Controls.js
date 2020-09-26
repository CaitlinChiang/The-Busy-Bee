import React, { Component } from 'react'
import * as firebase from 'firebase'
import '../admin_css/02-Controls.css'
import helpers from '../client/tools'

class Controls extends Component {
    state = {
        products: [],
        product: '',
        stock: true
    }

    componentDidMount = _ => this.products_fetch()

    // Fetch Data
    products_fetch = _ => {
        firebase.database().ref('products').once('value', snapshot => {
            snapshot.forEach((snap) => {
                this.setState({ products: this.state.products.concat(snap.val().product_name) })
            })
        })
    }

    // Helper Functions
    handleChange = event => {
        event.preventDefault()
        const { name, value } = event.target
        this.setState({ [name]: value })
    }

    render() {
        const { products, product } = this.state
        return (
            <div>
                <section id="controls">
                    <div class="container">
                        <div id="controlsHeader"> <h1>Controls</h1> </div>
                        <div id="panel">
                            <select value={product} name="product" onChange={this.handleChange}>
                                <option value="">--Choose Product--</option>
                                { products.map(item => <option value={item}>{item}</option>) }
                            </select>

                            <button>In Stock</button>
                            <button>Out of Stock</button>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default Controls