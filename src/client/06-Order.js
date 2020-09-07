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
        cities: [],
        payment_mediums: [],

        // Order Details
        orderID: '',
        name: '',
        mobile: '',
        email: '',
        address: '',
        city: '',
        paymentMethod: '',
        date: ''
    }

    componentDidMount = _ => {
        // this.price_set()
        // this.orderID_set()
        // this.cities_fetch()
        // this.paymentMediums_fetch()
    }

    // Fetch Data
    // price_set = _ => {
    //     const { cart } = this.state

    //     let price = 0

    //     if (cart == null) {
    //         this.setState({ price: 0 })
    //     }
    //     else if (cart.length > 0) {
    //         for (let i = 0; i < cart.length; i++) {
    //             price += cart[i].price
    //         }
    //         this.setState({ price })
    //     }
    // }

    // orderID_set = _ => {
    //     fetch('http://localhost:5000/order_details')
    //         .then(response => response.json())
    //         .then(response => this.setState({ orderID: response.data[0].orderDetail_id + 1 }) )
    // }

    // cities_fetch = _ => {
    //     fetch('http://localhost:5000/city_deliveries')
    //         .then(response => response.json())
    //         .then(response => this.setState({ cities: response.data }) )
    // }

    // paymentMediums_fetch = _ => {
    //     fetch('http://localhost:5000/payment_mediums')
    //         .then(response => response.json())
    //         .then(response => this.setState({ payment_mediums: response.data }) )
    // }

    // Save Data
    // order_add = _ => {
    //     const { cart, orderID, name, mobile, email, address, city, paymentMethod, date, price } = this.state
    //     let timestamp = helpers.timestamp()

    //     fetch(`http://localhost:5000/order_details/add?timestamp=${timestamp}&name=${name}&mobile=${mobile}&email=${email}&address=${address}&city=${city}&paymentMethod=${paymentMethod}&orderDate=${moment(date).format('YYYY-MM-DD')}&price=${price}`)
    //         .then(response => response.json())

    //     for (let i = 0; i < cart.length; i++) {
    //         fetch(`http://localhost:5000/order_items/add?orderDetail_id=${orderID}&name=${cart[i].name}&color=${cart[i].color}&size=${cart[i].size}&quantity=${cart[i].quantity}`)
    //             .then(response => response.json())
    //     }
    // }

    // receipt = _ => {
    //     const { cities, payment_mediums, email, orderID, name, price, address, city, paymentMethod, date, cart } = this.state

    //     const city_display = _ => {
    //         for (let i = 0; i < cities.length; i++) {
    //             if (cities[i].city_id == city) {
    //                 return cities[i].city_name
    //             }
    //         }
    //     }

    //     const paymentMethod_display = _ => {
    //         for (let i = 0; i < payment_mediums.length; i++) {
    //             if (payment_mediums[i].paymentMethod_id == paymentMethod) {
    //                 return payment_mediums[i].paymentMethod_name
    //             }
    //         }
    //     }

    //     fetch(`http://localhost:5000/receipt?email=${email}&orderID=${orderID}&name=${name}&price=${price}&address=${address}&city=${city_display()}&paymentMethod=${paymentMethod_display()}&date=${moment(date).format('YYYY-MM-DD').substring(0, 10)}&order_items=${cart}`)
    //         .then(response => response.json())

    //     alert("Thank you for purchasing from Soren! Kindly check your email for your order details. Have a nice day!")
    // }

    // order_confirmation = _ => {
    //     const { cart, name, mobile, email, address, city, date, payment_mediums, paymentMethod } = this.state

    //     if (cart.length > 0) {
    //         if (name.trim() !== '' && mobile.trim() !== '' && email.trim() !== '' && address.trim() !== '' && city.trim() !== '' && date.trim() !== '' && paymentMethod.trim() !== '') {
    //             for (let i = 0; i < payment_mediums.length; i++) {
    //                 if (payment_mediums[i].paymentMethod_id == paymentMethod) {
    //                     if (payment_mediums[i].paymentMethod_account !== null) {
    //                         let confirmation = window.confirm(`You have chosen ${payment_mediums[i].paymentMethod_name} as your mode of payment. Account Number: ${payment_mediums[i].paymentMethod_account}. Would you like to confirm your order?`)
    //                         if (confirmation) {
    //                             alert("Kindly attach a screenshot of your proof of payment to: sorenphilippines@gmail.com")
    //                             this.order_add()
    //                             this.receipt()
    //                             this.props.updateCart_clear()
    //                         }
    //                     }
    //                     else {
    //                         let confirmation = window.confirm(`You have chosen ${payment_mediums[i].paymentMethod_name} as your mode of payment. Would you like to confirm your order?`)
    //                         if (confirmation) {
    //                             this.order_add()
    //                             this.receipt()
    //                             this.props.updateCart_clear()
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         else alert("Kindly fill in all input fields.")
    //     }
    //     else alert("Your cart is empty.")
    // }

    // // Render Data
    // paymentMediums_render = props => {
    //     if (props.paymentMethod_account !== null) {
    //         return <p>{props.paymentMethod_name}: {props.paymentMethod_account}</p>
    //     }
    // }

    // // Helper Functions
    // handleChange = event => {
	// 	event.preventDefault()
	// 	const { name, value } = event.target
    //     this.setState({ [name]: value })
    // }

    // filterDeliveryDates = date => {
    //     const day = getDay(date)

    //     return day !== 0 && day !== 1 && day !== 2 && day !== 3 && day !== 4 && day !== 5
    // }

    render() {
        const { cities, payment_mediums, price, name, mobile, email, address, city, paymentMethod, date } = this.state

        return (
            <div>
                <section id="order">
                    <Link to="/cart"> <div>&#8592; Back to Cart</div> </Link>

                    {/* <h1>Total Cost: P{price}.00</h1>

                    <div>
                        <form autoComplete="off">
                            <div>
                                <input type="text" value={name} name="name" onChange={this.handleChange} placeholder="First Name, Last Name" required />
                                <input type="text" value={mobile.trim()} name="mobile" onChange={this.handleChange} placeholder="Phone Number" required />
                                <input type="text" value={email.trim()} name="email" onChange={this.handleChange} placeholder="Email Address" required />
                            </div>

                            <div>
                                <input type="text" value={address} name="address" onChange={this.handleChange} placeholder="Delivery Address" required />
                                
                                <select value={city} name="city" onChange={this.handleChange} required >
                                    <option value="">--Choose a City--</option>
                                    { cities.map(item => <option value={item.city_id}>{item.city_name}</option>) }
                                </select>

                                <select value={paymentMethod} name="paymentMethod" onChange={this.handleChange} required > 
                                    <option value="">--Choose a Payment Method--</option>
                                    { payment_mediums.map(item => <option value={item.paymentMethod_id}>{item.paymentMethod_name}</option>) }
                                </select>
                            </div>

                            <div class="datepicker">
                                <h2>Date of Delivery</h2>
                                <DatePicker inline selected={date} onChange={date => this.setState({ date })} minDate={addDays(new Date(), 1)} maxDate={addMonths(new Date(), 2)} filterDate={this.filterDeliveryDates} format='YYYY-MM-DD' required />
                            </div>

                            <button type="submit" onClick={() => this.order_confirmation()}>Order</button>
                        </form>
                    </div> */}

                </section>

                {/* <div id="accountDetails">
                    { payment_mediums.map(this.paymentMediums_render) }
                    <br/> <p>Send proof of payment to: sorenphilippines@gmail.com</p>
                </div> */}
                
                <footer>&#169; Rolls.</footer>
            </div>
        )
    }
}

export default Order