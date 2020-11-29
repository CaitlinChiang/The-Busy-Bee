import React, { Component } from 'react'
import * as firebase from 'firebase'
import Select from 'react-select'
import helpers from './tools'
import '../client_css/03-Products.css'

class Products extends Component {
	state = {
        products: [],
        modal: false,
        modal_product: '',
        quantity: 0,

        // Special Offers
        modal_custom: false,
        options: [],
        modal_package3: false,
        package_offer_3: [],
        modal_package8: false,
        package_offer_8: []
	}

    componentDidMount = _ => this.products_fetch()
    
    // Fetch Data
    products_fetch = _ => {
        firebase.database().ref('products').once('value', snapshot => {
            snapshot.forEach((snap) => {
                var obj = {
                    stock: snap.val().stock,
                    product_name: snap.val().product_name,
                    price: snap.val().price,
                    description: snap.val().description
                }
                this.setState({ products: this.state.products.concat(obj) })

                var option = {
                    value: snap.val().product_name,
                    label: snap.val().product_name,
                }
                if (snap.val().stock === true) this.setState({ options: this.state.options.concat(option) })
            })
        })
    }

    // Render Data
    productImages_render = name => {
        if (name === 'Citrus Splash') return 'citrus_splash'
        else if (name === 'Grapefruit Crunch') return 'grapefruit_crunch'
        else if (name === 'Oatmeal') return 'oatmeal'
        else if (name === 'Pina Colada') return 'pina_colada'
        else if (name === 'Pink Guava') return 'pink_guava'
        else if (name === 'Tea Time') return 'tea_time'
        else if (name === 'The Sweet Life') return 'the_sweet_life'
        else if (name === 'Lemonade') return 'lemonade'
    }

    products_render = props => {
        return (
            <button onClick={() => this.setState({ modal: true, modal_product: props.product_name })}>
                <img src={`/images/${this.productImages_render(props.product_name)}.jpeg`} width="100%;"/>
                <div class="productItem">
                    <h2>{props.product_name}</h2>
                    <p>P{props.price}.00</p>
                </div>
            </button>
        ) 
    }

    productModals_render = props => {
        const { modal_product, quantity } = this.state

        if (modal_product == props.product_name) {
            return (
                <div id="modal" onClick={() => this.setState({ modal: false })}>
                    <div id="modal-content" onClick={this.stopPropagation}>
                        <div id="modal-header"></div>
                        <div id="modal-body">
                            <img src={`/images/${this.productImages_render(props.product_name)}.jpeg`} width="45%;"/>
                            <div id="modalDescription">
                                <h2>{props.product_name}</h2>
                                <p>{props.description}</p>
                                {props.stock === true ? 
                                    <div>
                                        <select class="modalSets" onChange={this.handleChange} value={quantity} name="quantity">
                                            <option value="">--Quantity of Order--</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </select>
                                        <button onClick={() => this.product_add(props.product_name, props.price, quantity)}>Add To Cart!</button>
                                    </div>
                                : <p>(Out of Stock)</p>}
                            </div>
                        </div>
                        <div id="modal-footer"></div>
                    </div>
                </div>
            )
        }
    }

    // Special Offers
    customModal_render = _ => {
        return (
            <div id="modal" class="specialOffer" onClick={() => this.setState({ modal_custom: false })}>
                <div id="modal-content" onClick={this.stopPropagation}>
                    <div id="modal-header"></div>
                    <div id="modal-body">
                        <img src='/images/bg7.jpeg' id="special_image"  />
                        <div id="modalDescription">
                            <h2>Custom Scents!</h2>
                            <p>We will be contacting you personally regarding the personalized scent of your choice. Kindly choose a package!</p>
                            <button onClick={() => this.product_add('Custom 6', 2850, 1)}>Collection of 6: P2850.00 Total</button>
                            <button onClick={() => this.product_add('Custom 20', 8500, 1)}>Collection of 20: P8500.00 Total</button>
                        </div>
                    </div>
                    <div id="modal-footer"></div>
                </div>
            </div>
        )
    }

    package3Modal_render = _ => {
        const { options, package_offer_3 } = this.state

        const add_product = _ => {
            if (package_offer_3.length === 3) {
                let product_values = package_offer_3.map(item => item.value)
                let products = product_values.join(', ')
                this.product_add(products, 1080, 1)
            }
            else alert("Kindly Select 3 Products!")
        }

        return (
            <div id="modal" class="specialOffer" onClick={() => this.setState({ modal_package3: false, package_offer_3: [] })}>
                <div id="modal-content" onClick={this.stopPropagation}>
                    <div id="modal-header">
                        <p>***You may click on selected options more than 1x if you would like to repeat the scent!***</p>
                    </div>
                    <div id="modal-body">
                        <img src='/images/bg5.jpeg' id="special_image" />
                        <div id="modalDescription">
                            <h2>Choose Any 3 Scents!</h2>
                            { package_offer_3.map(item => <p>{item.value}</p>) }
                            {/* hideSelectedOptions={false} */}
                            <Select options={options} value={package_offer_3} name="package_offer_3" onChange={this.handleSelectChange_3} />
                            <button onClick={() => add_product()}>Add to Cart!</button>
                        </div>
                    </div>
                    <div id="modal-footer"></div>
                </div>
            </div>
        )
    }

    package8Modal_render = _ => {
        const { options, package_offer_8 } = this.state

        const add_product = _ => {
            if (package_offer_8.length === 8) {
                let product_values = package_offer_8.map(item => item.value)
                let products = product_values.join(', ')
                this.product_add(products, 2900, 1)
            }
            else alert("Kindly Select 8 Products!")
        }

        return (
            <div id="modal" class="specialOffer" onClick={() => this.setState({ modal_package8: false, package_offer_8: [] })}>
                <div id="modal-content" onClick={this.stopPropagation}>
                    <div id="modal-header">
                        <p>***You may click on selected options more than 1x if you would like to repeat the scent!***</p>
                    </div>
                    <div id="modal-body">
                        <img src='/images/bg8.jpeg' width="45%;" />
                        <div id="modalDescription">
                            <h2>Choose Any 8 Scents!</h2>
                            { package_offer_8.map(item => <p>{item.value}</p>) }
                            <Select options={options} value={package_offer_8} name="package_offer_8" onChange={this.handleSelectChange_8} />
                            <button onClick={() => add_product()}>Add to Cart!</button>
                        </div>
                    </div>
                    <div id="modal-footer"></div>
                </div>
            </div>
        )
    }

    // Save Data
    product_add = (name, price, quantity) => {
        let timestamp = helpers.timestamp()
        let finalPrice = price * quantity

        let cartItem = {
            timestamp: timestamp,
            product_name: name,
            price: finalPrice,
            quantity: quantity
        }
        
        if (quantity !== 0) {
            this.props.updateCart_add(cartItem)

            this.setState({ quantity: 0, package_offer: [] })
            alert("Item Added to Cart!")
        }
        else alert("Please fill in all item details.")
    }

    // Helper Functions
	handleChange = event => {
		event.preventDefault()
		const {name, value} = event.target
		this.setState({ [name]: value })
    }

    handleSelectChange_3 = option => {
        this.setState(state => {
            return {
                package_offer: option
            }
        })

        this.setState({ package_offer_3: this.state.package_offer_3.concat(option) })
    }

    handleSelectChange_8 = option => {
        this.setState(state => {
            return {
                package_offer: option
            }
        })

        this.setState({ package_offer_8: this.state.package_offer_8.concat(option) })
    }
    
    stopPropagation = event => event.stopPropagation()

	render() {
        const { products, modal, modal_custom, modal_package3, modal_package8 } = this.state

		return ( 
			<div>
				<section id="products">
					<div id="displayProducts">
                        <div id="showSpecialProducts" class="fade-in">
                            <div id="productHeader"> <h1>Special Offers</h1> </div>

                            <button onClick={() => this.setState({ modal_custom: true })}>
                                <img src='/images/bg7.jpeg' width="100%;"/>
                                <div class="productItem">
                                    <h2>Custom Scent</h2>
                                </div>
                            </button>

                            <button onClick={() => this.setState({ modal_package3: true })}>
                                <img src='/images/bg5.jpeg' width="100%;"/>
                                <div class="productItem">
                                    <h2>Package of 3</h2>
                                    <p>P1080.00</p>
                                </div>
                            </button>

                            <button onClick={() => this.setState({ modal_package8: true })}>
                                <img src='/images/bg8.jpeg' width="100%;"/>
                                <div class="productItem">
                                    <h2>Package of 8</h2>
                                    <p>P2900.00</p>
                                </div>
                            </button>
                        </div>

						<div id="showProducts" class="fade-in">
                            <div id="productHeader"> <h1>Our Products</h1> </div>
                            { products.map(this.products_render) }
						</div>
					</div>

					{ modal ===  true ? products.map(this.productModals_render) : null }

                    { modal_custom === true ? this.customModal_render() : null }

                    { modal_package3 === true ? this.package3Modal_render() : null }

                    { modal_package8 === true ? this.package8Modal_render() : null }
				</section>
                
                <footer>&#169; The Busy Bee</footer>
			</div>
		)
	}
}

export default Products