import React, { Component } from 'react'
import * as firebase from 'firebase'
import { HashLink as Link } from 'react-router-hash-link'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addMonths, addDays, getDay } from 'date-fns'
import moment from 'moment'
import '../client_css/06-Order.css'
import helpers from './tools'

class Order extends Component {
    state = {
        cart: this.props.cart,
        price: 0,
        
        // Data
        orderID: 1,
        orders: [],
        payment_mediums: [],
        provinces: [],

        // Order Details
        name: '',
        mobile: '',
        email: '',
        order_type: '',
        address: '',
        province: '',
        city: '',
        payment_method: '',
        date: ''
    }

    componentDidMount = _ => {
        this.price_set()
        this.orderID_set()
        this.provinces_fetch()
        this.paymentMediums_fetch()
    }

    // Fetch Data
    price_set = _ => {
        const { cart } = this.state

        let price = 0

        if (cart == null) {
            this.setState({ price: 0 })
        }
        else if (cart.length > 0) {
            for (let i = 0; i < cart.length; i++) {
                price += cart[i].price
            }
            this.setState({ price })
        }
    }

    orderID_set = _ => {
        firebase.database().ref('orders').once('value', snapshot => {
            snapshot.forEach((snap) => {
                this.setState({ orders: this.state.orders.concat(snap.key) })
            })
            this.setState({ orderID: this.state.orders.length + 1 })
        })
    }

    provinces_fetch = _ => {
        firebase.database().ref('provinces').once('value', snapshot => {
            snapshot.forEach((snap) => {
                var obj = {
                    province_name: snap.val().province_name
                }
                this.setState({ provinces: this.state.provinces.concat(obj) })
            })
        })
    }

    paymentMediums_fetch = _ => {
        firebase.database().ref('payment_mediums').once('value', snapshot => {
            snapshot.forEach((snap) => {
                var obj = {
                    payment_method: snap.val().payment_method,
                    account_number: snap.val().account_number
                }
                this.setState({ payment_mediums: this.state.payment_mediums.concat(obj) })
            })
        })
    }

    // Save Data
    order_add = _ => {
        const { cart, orderID, name, mobile, email, order_type, address, province, city, payment_method, date, price } = this.state

        if (order_type === 'Pickup') {
            firebase.database().ref('orders').child(orderID).child('order_details').update({
                name: name,
                mobile: mobile,
                email: email,
                order_type: order_type,
                payment_method: payment_method,
                date: moment(date).format('YYYY-MM-DD').substring(0, 10),
                price: price,
                payment_status: 'Not Paid',
                order_status: 'Pending',
                timestamp: helpers.timestamp()
            })

            for (let i = 0; i < cart.length; i++) {
                firebase.database().ref('orders').child(orderID).child('order_items').child(cart[i].timestamp).update({
                    product_name: cart[i].product_name,
                    quantity: cart[i].quantity
                })
            }
        }
        else if (order_type === 'Delivery') {
            firebase.database().ref('orders').child(orderID).child('order_details').update({
                name: name,
                mobile: mobile,
                email: email,
                order_type: order_type,
                address: address,
                province: province,
                city: city,
                payment_method: payment_method,
                date: moment(date).format('YYYY-MM-DD'),
                price: price,
                payment_status: 'Not Paid',
                order_status: 'Pending',
                timestamp: helpers.timestamp()
            })

            for (let i = 0; i < cart.length; i++) {
                firebase.database().ref('orders').child(orderID).child('order_items').child(cart[i].timestamp).update({
                    product_name: cart[i].product_name,
                    quantity: cart[i].quantity
                })
            }
        }
    }

    order_confirmation = _ => {
        const { cart, name, mobile, email, order_type, address, province, city, date, payment_method, payment_mediums } = this.state

        const order = _ => {
            for (let i = 0; i < payment_mediums.length; i++) {
                if (payment_mediums[i].payment_method === payment_method) {
                    if (payment_mediums[i].account_number !== '') {
                        let confirmation = window.confirm(`You have chosen ${payment_mediums[i].payment_method} as your mode of payment. Account Number: ${payment_mediums[i].account_number}. Would you like to confirm your order?`)
                        if (confirmation) {
                            alert("Kindly attach a screenshot of your proof of payment to: 0917 535 0923 (Viber). For deliveries, we will be messaging you shortly regarding the final amount inclusive of the delivery fee.")
                            this.order_add()
                            this.props.updateCart_clear()
                            this.clear()
                        }
                    }
                    else {
                        let confirmation = window.confirm(`You have chosen ${payment_mediums[i].payment_method} as your mode of payment. Would you like to confirm your order?`)
                        if (confirmation) {
                            alert("Kindly attach a screenshot of your proof of payment to: 0917 535 0923 (Viber). For deliveries, we will be messaging you shortly regarding the final amount inclusive of the delivery fee.")
                            this.order_add()
                            this.props.updateCart_clear()
                            this.clear()
                        }
                    }
                }
            }
        }

        if (cart.length > 0) {
            if (order_type === 'Pickup') {
                if (name.trim() !== '' && mobile.trim() !== '' && email.trim() !== '' && order_type.trim() !== '' && date !== '' && payment_method.trim() !== '') {
                    order()
                }
                else alert("Kindly fill in all input fields.")
            }
            else if (order_type === 'Delivery') {
                if (name.trim() !== '' && mobile.trim() !== '' && email.trim() !== '' && order_type.trim() !== '' && address.trim() !== '' && province.trim() !== '' && city.trim() !== '' && date.trim !== '' && payment_method.trim() !== '') {
                    order()
                }
                else alert("Kindly fill in all input fields.")
            }
            else alert("Kindly fill in all input fields.")
        }
        else alert("Your cart is empty.")
    }

    // Render Data
    paymentMediums_render = props => {
        const { order_type } = this.state

        if (order_type === 'Pickup') {
            if (props.payment_method !== 'Cash on Delivery') {
                return <option value={props.payment_method}>{props.payment_method}</option>
            }
        }
        else if (order_type === 'Delivery') {
            if (props.payment_method !== 'Payment on Pickup') {
                return <option value={props.payment_method}>{props.payment_method}</option>
            }
        }
    }

    accountNumbers_render = props => {
        if (props.account_number !== '') {
            return <p>{props.payment_method}: {props.account_number}</p>
        }
    }

    // Helper Functions
    handleChange = event => {
		event.preventDefault()
		const { name, value } = event.target
        this.setState({ [name]: value })
    }

    clear = _ => {
        this.setState({ 
            name: '',
            mobile: '',
            email: '',
            order_type: '',
            address: '',
            province: '',
            city: '',
            payment_method: '',
            date: ''
        })

        alert("Thank you for shopping with us!")

        window.location = "/"
    }

    filterDeliveryDates = date => {
        const day = getDay(date)

        return date
    }

    sortArray = (array) => {
	    return array.sort((a, b) => {
	        var x = a.province_name
	        var y = b.province_name
	        return ((x > y) ? 1 : ((x < y) ? -1 : 0));
	    })
	}

    render() {
        const { provinces, payment_mediums, price, name, mobile, email, order_type, address, province, city, payment_method, date } = this.state
        const Provinces = this.sortArray(provinces)

        return (
            <div>
                <section id="order">
                    <Link to="/cart"> <div>&#8592; Back to Cart</div> </Link>

                    <h1>Total Cost: P{price}.00</h1>

                    <div>
                        <form autoComplete="off">
                            <div>
                                <input type="text" value={name} name="name" onChange={this.handleChange} placeholder="First Name, Last Name" required />
                                <input type="text" value={mobile.trim()} name="mobile" onChange={this.handleChange} placeholder="Phone Number" required />
                                <input type="text" value={email.trim()} name="email" onChange={this.handleChange} placeholder="Email Address" required />
                            </div>

                            <select value={order_type} name="order_type" onChange={this.handleChange} required >
                                <option value="">--Receive Method--</option>
                                <option value="Pickup">Pickup</option>
                                <option value="Delivery">Delivery</option>
                            </select>

                            { order_type !== '' ?
                                <div>
                                    { order_type === 'Delivery' ?
                                        <div>
                                            <input type="text" value={address} name="address" onChange={this.handleChange} placeholder="Delivery Address" required />
                                            
                                            <select value={province} name="province" onChange={this.handleChange} required >
                                                <option value="">--Province/Region--</option>
                                                { this.sortArray(provinces).map(item => <option value={item.province_name}>{item.province_name}</option>) }
                                            </select>

                                            <input type="text" value={city} name="city" onChange={this.handleChange} placeholder="City" required />
                                        </div>
                                    : null }

                                    <select value={payment_method} name="payment_method" onChange={this.handleChange} required > 
                                        <option value="">--Payment Method--</option>
                                        { payment_mediums.map(this.paymentMediums_render) }
                                    </select>
                                </div>
                            : null }

                            <div class="datepicker">
                                <h2>Date of Pickup / Delivery</h2>
                                <DatePicker inline selected={date} onChange={date => this.setState({ date })} minDate={addDays(new Date(), 1)} maxDate={addMonths(new Date(), 2)} filterDate={this.filterDeliveryDates} format='YYYY-MM-DD' required />
                            </div>

                            <button type="submit" onClick={() => this.order_confirmation()}>Order</button>
                        </form>
                    </div>
                </section>

                <div id="accountDetails">
                    { payment_mediums.map(this.accountNumbers_render) }
                    <br/> <p>Send Your Proof of Payment To: 0917 535 0923 (Viber)</p>
                </div>
                
                <footer>&#169; The Busy Bee</footer>
            </div>
        )
    }
}

export default Order