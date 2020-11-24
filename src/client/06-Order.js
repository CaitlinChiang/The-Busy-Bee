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
        ncr_cities: [],

        regionalDistributor: false,
        regional_distributors: [],
        provincialDistributor: false,
        provincial_distributors: [],

        // Order Details
        name: '',
        mobile: '',
        email: '',
        order_type: '',
        address: '',
        province: '',
        region: '',
        city: '',
        ncr_city: '',
        payment_method: '',
        date: ''
    }

    componentDidMount = _ => {
        this.price_set()
        this.orderID_set()
        this.provinces_fetch()
        this.ncr_fetch()
        this.distributors_fetch()
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
        firebase.database().ref('locations').once('value', snapshot => {
            snapshot.forEach((snap) => {
                var obj = {
                    province_name: snap.key,
                    province_region: snap.val().province_region
                }
                this.setState({ provinces: this.state.provinces.concat(obj) })
            })
        })
    }

    distributors_fetch = _ => {
        firebase.database().ref('distributors').once('value', snapshot => {
            snapshot.forEach((snap) => {
                if (snap.key == 'regions') {
                    snap.forEach((region) => {
                        let regional_distributor = []

                        let key = region.key
                        regional_distributor.push({ key })

                        region.forEach((detail) => {
                            if (detail.key == 'distributor') {
                                let proof_account = ''
                                proof_account = detail.val().proof
                                regional_distributor.push({ proof_account })
                            }

                            if (detail.key == 'payment_methods') {
                                let payment_mediums = []

                                detail.forEach((medium) => {
                                    var payment_medium = {
                                        account_method: medium.val().account_method,
                                        account_number: medium.val().account_number
                                    }

                                    payment_mediums.push({ payment_medium })
                                })

                                regional_distributor.push({ payment_mediums })
                            }
                        })

                        this.setState({ regional_distributors: [...this.state.regional_distributors, ...[regional_distributor] ] })
                    })
                }
            })
        })

        firebase.database().ref('distributors').once('value', snapshot => {
            snapshot.forEach((snap) => {
                if (snap.key == 'provinces') {
                    snap.forEach((province) => {
                        let provincial_distributor = []

                        let key = province.key
                        provincial_distributor.push({ key })

                        province.forEach((detail) => {
                            if (detail.key == 'distributor') {
                                let proof_account = ''
                                proof_account = detail.val().proof
                                provincial_distributor.push({ proof_account })
                            }

                            if (detail.key == 'payment_methods') {
                                let payment_mediums = []

                                detail.forEach((medium) => {
                                    var payment_medium = {
                                        account_method: medium.val().account_method,
                                        account_number: medium.val().account_number
                                    }

                                    payment_mediums.push({ payment_medium })
                                })

                                provincial_distributor.push({ payment_mediums })
                            }
                        })

                        this.setState({ provincial_distributors: [...this.state.provincial_distributors, ...[provincial_distributor] ] })
                    })
                }
            })
        })
    }

    ncr_fetch = _ => {
        firebase.database().ref('locations').child('NCR').once('value', snapshot => {
            snapshot.forEach((snap) => {
                var obj = {
                    city_name: snap.key,
                    city_fee_bottles8: snap.val().bottles_8,
                    city_fee_bottles8COD: snap.val().bottles_8_COD,
                    city_fee_bottles9: snap.val().bottles_9,
                    city_fee_bottles9COD: snap.val().bottles_9_COD
                }
                this.setState({ ncr_cities: this.state.ncr_cities.concat(obj) })
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
        const { cart, orderID, name, mobile, email, order_type, address, province, city, ncr_city, payment_method, date, price } = this.state

        if (order_type === 'Pickup') {
            firebase.database().ref('orders').child(orderID).child('order_details').update({
                name: name,
                mobile: mobile,
                email: email,
                order_type: order_type,
                province: province,
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
                city: ncr_city.trim() !== "" ? ncr_city : city,
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
        const { cart, name, mobile, email, order_type, address, province, region, city, ncr_city, date, payment_method, payment_mediums, proof_account, provincialDistributor, regionalDistributor, provincial_distributors, regional_distributors } = this.state

        const proof = _ => {
            if (provincialDistributor === true) {
                for (let i = 0; i < provincial_distributors.length; i++) {
                    if (provincial_distributors[i][0].key == province) {
                        return provincial_distributors[i][1].proof_account
                    }
                }
            }
            else if (regionalDistributor === true) {
                for (let i = 0; i < regional_distributors.length; i++) {
                    if (regional_distributors[i][0].key == province) {
                        return regional_distributors[i][1].proof_account
                    }
                }
            }
        }

        const order = _ => {
            for (let i = 0; i < payment_mediums.length; i++) {
                if (payment_mediums[i].payment_method === payment_method) {
                    if (provincialDistributor === true || regionalDistributor === true) {
                        if (payment_mediums[i].account_number !== '') {
                            let confirmation = window.confirm(`You have chosen ${payment_mediums[i].payment_method} as your mode of payment. Account Number: ${payment_mediums[i].account_number}. Would you like to confirm your order?`)
                            if (confirmation) {
                                alert(`Kindly attach a screenshot of your proof of payment to: ${proof()} (Viber). For deliveries, we will be messaging you shortly regarding the final amount inclusive of any possible additional delivery fee.`)
                                this.order_add()
                                this.props.updateCart_clear()
                                this.clear()
                            }
                        }
                        else {
                            let confirmation = window.confirm(`You have chosen ${payment_mediums[i].payment_method} as your mode of payment. Would you like to confirm your order?`)
                            if (confirmation) {
                                alert(`Kindly attach a screenshot of your proof of payment to: ${proof()} (Viber). For deliveries, we will be messaging you shortly regarding the final amount inclusive of any possible additional delivery fee.`)
                                this.order_add()
                                this.props.updateCart_clear()
                                this.clear()
                            }
                        }
                    }
                    else {
                        if (payment_mediums[i].account_number !== '') {
                            let confirmation = window.confirm(`You have chosen ${payment_mediums[i].payment_method} as your mode of payment. Account Number: ${payment_mediums[i].account_number}. Would you like to confirm your order?`)
                            if (confirmation) {
                                alert("Kindly attach a screenshot of your proof of payment to: 0917 535 0923 (Viber). For deliveries, we will be messaging you shortly regarding the final amount inclusive of any possible additional delivery fee.")
                                this.order_add()
                                this.props.updateCart_clear()
                                this.clear()
                            }
                        }
                        else {
                            let confirmation = window.confirm(`You have chosen ${payment_mediums[i].payment_method} as your mode of payment. Would you like to confirm your order?`)
                            if (confirmation) {
                                alert("Kindly attach a screenshot of your proof of payment to: 0917 535 0923 (Viber). For deliveries, we will be messaging you shortly regarding the final amount inclusive of any possible additional delivery fee.")
                                this.order_add()
                                this.props.updateCart_clear()
                                this.clear()
                            }
                        }
                    }
                }
            }
        }
        
        const subtract_inventory = cart_array => {
            if (provincialDistributor === true) {
                firebase.database().ref('distributors').child('provinces').child(province).child('products').once('value', snapshot => {
                    snapshot.forEach((snap) => {
                        for (let i = 0; i < cart_array.length; i++) {
                            if (cart_array[i].product_name == snap.key) {
                                let original_amount = parseInt(snap.val().amount)
                                firebase.database().ref('distributors').child('provinces').child(province).child('products').child(snap.key).update({ amount: original_amount - cart_array[i].product_quantity })
                            }
                        }
                    })
                })
                
            }
            else if (regionalDistributor === true) {
                firebase.database().ref('distributors').child('regions').child(region).child('products').once('value', snapshot => {
                    snapshot.forEach((snap) => {
                        for (let i = 0; i < cart_array.length; i++) {
                            if (cart_array[i].product_name == snap.key) {
                                let original_amount = parseInt(snap.val().amount)
                                firebase.database().ref('distributors').child('regions').child(region).child('products').child(snap.key).update({ amount: original_amount - cart_array[i].product_quantity })
                            }
                        }
                    })
                })
            }
            else if (provincialDistributor === false && regionalDistributor === false) {
                firebase.database().ref('products').once('value', snapshot => {
                    snapshot.forEach((snap) => {
                        for (let i = 0; i < cart_array.length; i++) {
                            if (cart_array[i].product_name == snap.val().product_name) {
                                let original_amount = parseInt(snap.val().amount)
                                firebase.database().ref('products').child(snap.key).update({ amount: original_amount - cart_array[i].product_quantity })
                            }
                        }
                    })
                })
            }
        }

        const check_inventory = _ => {
            if (provincialDistributor === true) {
                firebase.database().ref('distributors').child('provinces').child(province).child('products').once('value', snapshot => {
                    let check_cart = []

                    for (let i = 0; i < cart.length; i++) {
                        if (cart[i].product_name.includes(',')) {
                            let array = cart[i].product_name.split(',')

                            for (let j = 0; j < array.length; j++) {
                                var obj_split = {
                                    product_name: array[j].trim(),
                                    quantity: cart[i].quantity
                                }
                                check_cart.push(obj_split)
                            }
                        }
                        else {
                            var obj_notSplit = {
                                product_name: cart[i].product_name,
                                quantity: cart[i].quantity
                            }
                            check_cart.push(obj_notSplit)
                        }
                    }

                    let all_available = true
                    let cart_items = []
                    
                    snapshot.forEach((snap) => {
                        let product_name = ''
                        let inventory_quantity = 0
                        let order_quantity = []
                        
                        for (let i = 0; i < check_cart.length; i++) {
                            if (check_cart[i].product_name == snap.key) {
                                product_name = snap.key
                                inventory_quantity = snap.val().amount
                                order_quantity.push(check_cart[i].quantity)
                            }
                        }

                        let cart_quantity = order_quantity.reduce((a, b) => parseInt(a) + parseInt(b), 0)
                        if (cart_quantity > parseInt(inventory_quantity)) {
                            all_available = false
                            alert(`Sorry, we only have ${inventory_quantity} stock of ${product_name} at ${province}. Your order is at quantity ${cart_quantity}.`)
                        }
                        else {
                            var cart_item = {
                                product_name: product_name,
                                product_quantity: cart_quantity
                            }
                            if (cart_item.product_name.trim() !== '') cart_items.push(cart_item)
                        }
                    })
                    if (all_available) {
                        subtract_inventory(cart_items)
                        order()
                    }
                })
            }
            else if (regionalDistributor === true) {
                firebase.database().ref('distributors').child('regions').child(region).child('products').once('value', snapshot => {
                    let check_cart = []

                    for (let i = 0; i < cart.length; i++) {
                        if (cart[i].product_name.includes(',')) {
                            let array = cart[i].product_name.split(',')

                            for (let j = 0; j < array.length; j++) {
                                var obj_split = {
                                    product_name: array[j].trim(),
                                    quantity: cart[i].quantity
                                }
                                check_cart.push(obj_split)
                            }
                        }
                        else {
                            var obj_notSplit = {
                                product_name: cart[i].product_name,
                                quantity: cart[i].quantity
                            }
                            check_cart.push(obj_notSplit)
                        }
                    }

                    let all_available = true
                    let cart_items = []
                    
                    snapshot.forEach((snap) => {
                        let product_name = ''
                        let inventory_quantity = 0
                        let order_quantity = []
                        
                        for (let i = 0; i < check_cart.length; i++) {
                            if (check_cart[i].product_name == snap.key) {
                                product_name = snap.key
                                inventory_quantity = snap.val().amount
                                order_quantity.push(check_cart[i].quantity)
                            }
                        }

                        let cart_quantity = order_quantity.reduce((a, b) => parseInt(a) + parseInt(b), 0)
                        if (cart_quantity > parseInt(inventory_quantity)) {
                            all_available = false
                            alert(`Sorry, we only have ${inventory_quantity} stock of ${product_name} at ${province}. Your order is at quantity ${cart_quantity}.`)
                        }
                        else {
                            var cart_item = {
                                product_name: product_name,
                                product_quantity: cart_quantity
                            }
                            if (cart_item.product_name.trim() !== '') cart_items.push(cart_item)
                        }
                    })

                    if (all_available) {
                        subtract_inventory(cart_items)
                        order()
                    }
                })
            }
            else if (regionalDistributor === false && provincialDistributor === false) {
                firebase.database().ref('products').once('value', snapshot => {
                    let check_cart = []

                    for (let i = 0; i < cart.length; i++) {
                        if (cart[i].product_name.includes(',')) {
                            let array = cart[i].product_name.split(',')

                            for (let j = 0; j < array.length; j++) {
                                var obj_split = {
                                    product_name: array[j].trim(),
                                    quantity: cart[i].quantity
                                }
                                check_cart.push(obj_split)
                            }
                        }
                        else {
                            var obj_notSplit = {
                                product_name: cart[i].product_name,
                                quantity: cart[i].quantity
                            }
                            check_cart.push(obj_notSplit)
                        }
                    }

                    let all_available = true
                    let cart_items = []
                    
                    snapshot.forEach((snap) => {
                        let product_name = ''
                        let inventory_quantity = 0
                        let order_quantity = []
                        
                        for (let i = 0; i < check_cart.length; i++) {
                            if (check_cart[i].product_name == snap.val().product_name) {
                                product_name = snap.val().product_name
                                inventory_quantity = snap.val().amount
                                order_quantity.push(check_cart[i].quantity)
                            }
                        }

                        let cart_quantity = order_quantity.reduce((a, b) => parseInt(a) + parseInt(b), 0)
                        if (cart_quantity > parseInt(inventory_quantity)) {
                            all_available = false
                            alert(`Sorry, we only have ${inventory_quantity} stock of ${product_name} at ${province}. Your order is at quantity ${cart_quantity}.`)
                        }
                        else {
                            var cart_item = {
                                product_name: product_name,
                                product_quantity: cart_quantity
                            }
                            if (cart_item.product_name.trim() !== '') cart_items.push(cart_item)
                        }
                    })
                    if (all_available) {
                        subtract_inventory(cart_items)
                        order()
                    }
                })
            }
        }

        // if (cart.length > 0) {
        //     if (order_type === 'Pickup') {
        //         if (name.trim() !== '' && mobile.trim() !== '' && email.trim() !== '' && order_type.trim() !== '' && province.trim() !== '' && date !== '' && payment_method.trim() !== '') {
        //             check_inventory()
        //         }
        //         else alert("Kindly fill in all input fields.")
        //     }
        //     //&& address.trim() !== ''
        //     else if (order_type === 'Delivery') {
        //         if (name.trim() !== '' && mobile.trim() !== '' && email.trim() !== '' && order_type.trim() !== ''  && province.trim() !== '' && (city.trim() !== '' || ncr_city.trim() !== '') && date.trim !== '' && payment_method.trim() !== '') {
        //             check_inventory()
        //         }
        //         else alert("Kindly fill in all input fields.")
        //     }
        //     else alert("Kindly fill in all input fields.")
        // }
        // else alert("Your cart is empty.")
        check_inventory()
    }

    // Render Data
    paymentMediums_render = props => {
        const { order_type, province, ncr_city } = this.state
       
        if (order_type === 'Pickup') {
            if (props.payment_method !== 'Cash on Delivery') {
                return <option value={props.payment_method}>{props.payment_method}</option>
            }
        }
        else if (order_type === 'Delivery') {
            if (props.payment_method !== 'Payment on Pickup') {
                if (province === 'NCR' && (ncr_city !== 'Cainta' && ncr_city !== 'Antipolo' && ncr_city !== 'Taytay' && ncr_city !== 'San Mateo' && ncr_city !== 'Santa Rosa')) {  
                    return <option value={props.payment_method}>{props.payment_method}</option>
                }
                else {
                    if (props.payment_method !== 'Cash on Delivery') {
                        return <option value={props.payment_method}>{props.payment_method}</option>
                    }
                }
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
        this.setState({ [name]: value }, () => { this.NCR_cities(); this.distributor_paymentMediums() })
    }

    NCR_cities = _ => {
        const { price, ncr_cities, payment_method, province, ncr_city } = this.state

        if (province === "NCR") {
            for (let i = 0; i < ncr_cities.length; i++) {
                if (ncr_cities[i].city_name === ncr_city && payment_method !== "Cash on Delivery") {
                    if (price > 2900 && price !== 3225 && price !== 3600) {
                        this.setState({ price: 0 })
                        this.price_set()
                        this.setState(prevState => ({ price: prevState.price + ncr_cities[i].city_fee_bottles9 }))
                    }
                    else {
                        this.setState({ price: 0 })
                        this.price_set()
                        this.setState(prevState => ({ price: prevState.price + ncr_cities[i].city_fee_bottles8 }))
                    }
                }
                else if (ncr_cities[i].city_name === ncr_city && payment_method === "Cash on Delivery") {
                    if (price > 2900 && price !== 3225 && price !== 3600) {
                        this.setState({ price: 0 })
                        this.price_set()
                        this.setState(prevState => ({ price: prevState.price + ncr_cities[i].city_fee_bottles9COD }))
                    }
                    else {
                        this.setState({ price: 0 })
                        this.price_set()
                        this.setState(prevState => ({ price: prevState.price + ncr_cities[i].city_fee_bottles8COD }))
                    }
                }
            }
        }
        else {
            this.price_set()
        }
    }

    distributor_paymentMediums = _ => {
        const { province, provinces, provincial_distributors, regional_distributors } = this.state

        const paymentMediums_provincial = _ => {
            let paymentMediums = []

            for (let i = 0; i < provincial_distributors.length; i++) {
                if (provincial_distributors[i][0].key == province) {
                    for (let j = 0; j < provincial_distributors[i][2].payment_mediums.length; j++) {
                        var obj = {
                            payment_method: provincial_distributors[i][2].payment_mediums[j].payment_medium.account_method,
                            account_number: provincial_distributors[i][2].payment_mediums[j].payment_medium.account_number
                        }
                        paymentMediums.push(obj)
                    }
                }
            }
            
            this.setState({ payment_mediums: paymentMediums.map(item => item) })
        }

        const paymentMediums_regional = _ => {
            let paymentMediums = []

            for (let i = 0; i < regional_distributors.length; i++) {
                if (regional_distributors[i][0].key == region) {
                    for (let j = 0; j < regional_distributors[i][2].payment_mediums.length; j++) {
                        var obj = {
                            payment_method: regional_distributors[i][2].payment_mediums[j].payment_medium.account_method,
                            account_number: regional_distributors[i][2].payment_mediums[j].payment_medium.account_number
                        }
                        paymentMediums.push(obj)
                    }
                }
            }
            
            this.setState({ 
                payment_mediums: paymentMediums.map(item => item),
                region: region
            })
        }

        let check_provinces = []
        for (let i = 0; i < provincial_distributors.length; i++) {
            check_provinces.push(provincial_distributors[i][0].key)
        }

        let check_regions = []
        for (let i = 0; i < regional_distributors.length; i++) {
            check_regions.push(regional_distributors[i][0].key)
        }
        
        let region = ''
        for (let i = 0; i < provinces.length; i++) {
            if (provinces[i].province_name == province) {
                region = provinces[i].province_region
            }
        }

        if (check_provinces.includes(province)) {
            this.setState({ provincialDistributor: true, regionalDistributor: false })
            paymentMediums_provincial()
        }
        else if (check_regions.includes(region)) {
            this.setState({ regionalDistributor: true, provincialDistributor: false })
            paymentMediums_regional()
        }
        else {
            this.setState({ provincialDistributor: false, regionalDistributor: false })
            this.setState({ payment_mediums: [] })
            this.paymentMediums_fetch()
        }
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
            ncr_city: '',
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
        const { provinces, ncr_cities, payment_mediums, price, name, mobile, email, order_type, address, province, city, ncr_city, payment_method, date } = this.state

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
                                    <select value={province} name="province" onChange={this.handleChange} required >
                                        <option value="">--Province/Region--</option>
                                        { this.sortArray(provinces).map(item => <option value={item.province_name}>{item.province_name}</option>) }
                                    </select>
                                    
                                    <select value={payment_method} name="payment_method" onChange={this.handleChange} required > 
                                        <option value="">--Payment Method--</option>
                                        { payment_mediums.map(this.paymentMediums_render) }
                                    </select>

                                    { order_type === 'Delivery' ?
                                        <div>
                                            <input type="text" value={address} name="address" onChange={this.handleChange} placeholder="Delivery Address" required />
                                            
                                            { province === 'NCR' ?
                                                <select value={ncr_city} name="ncr_city" onChange={this.handleChange} required > 
                                                    <option value="">--City / Municipality--</option>
                                                    { this.sortArray(ncr_cities).map(item => <option value={item.city_name}>{item.city_name}</option>) }
                                                </select>
                                            :
                                                <input type="text" value={city} name="city" onChange={this.handleChange} placeholder="City" />
                                            }
                                        </div>
                                    : null }
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