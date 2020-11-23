import React, { Component } from 'react'
import * as firebase from 'firebase'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import '../admin_css/03-Orders.css'
import '../admin_css/02-Controls.css'
import helpers from '../client/tools'

class Provincial_Distributor extends Component {
    state = {
        province: '',
        password: '',
        password_check: true,

        orders: [],

        account_method: '',
        account_number: '',
        payment_methods: [],
        available_payment_methods: [],

        dateFilter: '',
        arrangement: '',
        orderStatus: 'Pending',
        paymentStatus: '',
        orderType: ''
    }

    componentWillMount = _ => {
        const location = window.location.href.split('/')

        this.setState({ 
            province: location[location.length - 1].replace(/%20/g, " "),
            password: location[location.length - 2]
        })
    }

    componentDidMount = _ => {
        const { province, password } = this.state

        firebase.database().ref('distributors').child('provinces').child(province).child('distributor').once('value', snapshot => {
            if (password !== snapshot.val().password) this.setState({ password_check: false })
        })

        this.orders_fetch()
        this.paymentMethods_fetch()
        this.available_paymentMethods_fetch()
    }

    // Fetch Data
    orders_fetch = _ => {
        firebase.database().ref('orders').once('value', snapshot => {
            snapshot.forEach((snap) => {
                let order = []

                let key = snap.key
                order.push({ key })

                snap.forEach((detail) => {
                    if (detail.key == 'order_details') {
                        let order_detail = []

                        if (detail.val().order_type == 'Pickup') {
                            var order_details = {
                                name: detail.val().name,
                                mobile: detail.val().mobile,
                                email: detail.val().email,
                                province: detail.val().province,
                                payment_method: detail.val().payment_method,
                                price: detail.val().price,
                                date: detail.val().date,
                                order_type: detail.val().order_type,
                                payment_status: detail.val().payment_status,
                                order_status: detail.val().order_status,
                                timestamp: detail.val().timestamp
                            }

                            order_detail.push({ order_details })
                        }
                        else if (detail.val().order_type == 'Delivery') {
                            var order_details = {
                                name: detail.val().name,
                                mobile: detail.val().mobile,
                                email: detail.val().email,
                                address: detail.val().address,
                                province: detail.val().province,
                                city: detail.val().city,
                                payment_method: detail.val().payment_method,
                                price: detail.val().price,
                                date: detail.val().date,
                                order_type: detail.val().order_type,
                                payment_status: detail.val().payment_status,
                                order_status: detail.val().order_status,
                                timestamp: detail.val().timestamp
                            }

                            order_detail.push({ order_details })
                        }

                        order.push({ order_detail })
                    }

                    if (detail.key == 'order_items') {
                        let order_items = []

                        detail.forEach((item) => {
                            var order_item = {
                                product_name: item.val().product_name,
                                quantity: item.val().quantity
                            }

                            order_items.push({ order_item })
                        })

                        order.push({ order_items })
                    }
                })

                this.setState({ orders: [...this.state.orders, ...[order] ] })
            })
        })
    }

    paymentMethods_fetch = _ => {
        firebase.database().ref('distributors').child('provinces').child(this.state.province).child('payment_methods').once('value', snapshot => {
            snapshot.forEach((snap) => {
                var obj = {
                    account_method: snap.val().account_method,
                    account_number: snap.val().account_number
                }
                this.setState({ payment_methods: this.state.payment_methods.concat(obj) })
            })
        })
    }

    available_paymentMethods_fetch = _ => {
        firebase.database().ref('payment_methods').once('value', snapshot => {
            snapshot.forEach((snap) => {
                this.setState({ available_payment_methods: this.state.available_payment_methods.concat(snap.val().account_method) })
            })
        })
    }


    // Render Data
    orders_render = props => {
        const { province } = this.state

        const order_items = _ => {
            let products = []
            for (let i = 0; i < props[2].order_items.length; i++) {
                products.push(<p>{props[2].order_items[i].order_item.quantity} {props[2].order_items[i].order_item.product_name}</p>)
            }
            return products
        }

        if (province === props[1].order_detail[0].order_details.province) {
            return (
                <tr key={props[0].key}>
                    <td>{props[0].key} <br /><br /> {props[1].order_detail[0].order_details.timestamp}</td>
                    <td>{order_items()}</td>
                    <td>{props[1].order_detail[0].order_details.name} <br /><br /> {props[1].order_detail[0].order_details.email} <br /><br /> {props[1].order_detail[0].order_details.mobile}</td>
                    <td>{props[1].order_detail[0].order_details.address} <br /><br /> {props[1].order_detail[0].order_details.province} <br /><br /> {props[1].order_detail[0].order_details.city}</td>
                    <td>{props[1].order_detail[0].order_details.date}</td>
                    <td>P{props[1].order_detail[0].order_details.price}.00</td>
                    <td>{props[1].order_detail[0].order_details.payment_method}</td>
                    <td>
                        <select onChange={(event) => this.order_update(props[0].key, event.target.value, props[1].order_detail[0].order_details.payment_status)}>
                            <option value="" selected disabled hidden>{props[1].order_detail[0].order_details.order_status}</option>
                            <option value="Pending">Pending</option>
                            <option value="Ready">Ready</option>
                            <option value="Done">Done</option>
                            <option value="Issue">Issue</option>
                        </select> <br /><br />
    
                        <select onChange={(event) => this.order_update(props[0].key, props[1].order_detail[0].order_details.order_status, event.target.value)}>
                            <option value="" selected disabled hidden>{props[1].order_detail[0].order_details.payment_status}</option>
                            <option value="Not Paid">Not Paid</option>
                            <option value="Paid">Paid</option>
                        </select>
    
                        <div><button onClick={() => this.order_delete(props[0].key)}>Delete</button></div>
                    </td>
                </tr>
            )
        }
    }

    orders_filters = order => {
        const { orderStatus, paymentStatus, orderType, dateFilter } = this.state

        const order_status = order => {
            if (orderStatus === '') return this.orders_render(order)
            else {
                if (order[1].order_detail[0].order_details.order_status == orderStatus) return this.orders_render(order)
            }
        }

        const payment_status = order => {
            if (paymentStatus === '') return order_status(order)
            else {
                if (order[1].order_detail[0].order_details.payment_status === paymentStatus) return order_status(order)
            }
        }

        const order_type = order => {
            if (orderType === '') return payment_status(order)
            else {
                if (order[1].order_detail[0].order_details.order_type === orderType) return payment_status(order)
            }
        }

        const date = order => {
            if (dateFilter == '') return order_type(order)
            else {
                if (order[1].order_detail[0].order_details.timestamp.substring(0, 10) == moment(dateFilter).format('YYYY-MM-DD')) return order_type(order)
            }
        }

        return date(order)
    }

    // Add Data
    paymentMethod_add = _ => {
        const { account_number, account_method } = this.state

        if (account_method.trim() !== '' && account_number.trim() !== '') {
            const confirm = window.confirm("Are you sure you would like to add this payment method and account number?")
            if (confirm) {
                firebase.database().ref('distributors').child('provinces').child(this.state.province).child('payment_methods').child(helpers.timestamp()).update({
                    account_method: account_method,
                    account_number: account_number
                })
            }
        }
        else alert("Kindly fill in all the input fields.")
        
        this.setState({ account_method: '', account_number: '', payment_methods: [] })
        this.paymentMethods_fetch()
    }

    // Update Data
    order_update = (order_id, new_orderStatus, new_paymentStatus) => {
        firebase.database().ref('orders').child(order_id).child('order_details').update({ 
            order_status: new_orderStatus,
            payment_status: new_paymentStatus
        })

        this.setState({ orders: [] })
        this.orders_fetch()
    }

    // Helper Functions
    handleChange = event => {
        event.preventDefault()
        const {name, value} = event.target
        this.setState({ [name]: value })
    }

    render() {
        const { password_check, orders, dateFilter, arrangement, orderStatus, paymentStatus, orderType, account_method, available_payment_methods, account_number, payment_methods } = this.state

        return (
            <section id="admin_orders">
                { password_check == false ?
                    <div style={{ marginTop: '300px', color: 'white', fontSize: '25px' }}>
                        <p>Kindly check the inputted password again.</p>
                    </div>
                :
                    <div class="orders">
                        <div>
                            <DatePicker inline selected={dateFilter} onChange={date => this.setState({ dateFilter: date })} maxDate={new Date()} format='MM-dd-yyyy' />
                        </div>

                        <select value={arrangement} name="arrangement" onChange={this.handleChange}>
                            <option value="Old_to_New">Oldest to Newest</option>
                            <option value="New_to_Old">Newest to Oldest</option>
                        </select>

                        <select value={orderType} name="orderType" onChange={this.handleChange}>
                            <option value="">All Order Types</option>
                            <option value="Delivery">Delivery</option>
                            <option value="Pickup">Pickup</option>
                        </select>

                        <select value={orderStatus} name="orderStatus" onChange={this.handleChange}>
                            <option value="">All Order Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Ready">Ready</option>
                            <option value="Done">Done</option>
                            <option value="Issue">Issue</option>
                        </select>

                        <select value={paymentStatus} name="paymentStatus" onChange={this.handleChange}>
                            <option value="">All Payment Statuses</option>
                            <option value="Not Paid">Not Paid</option>
                            <option value="Paid">Paid</option>
                        </select>

                        <div>
                            <div class="table">
                                <table class="orderTable">
                                    <thead>
                                        <tr>
                                            <th>Order</th>
                                            <th>Items</th>
                                            <th>Buyer Details</th>
                                            <th>Address</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Payment Method</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody class="dataTable">
                                        { arrangement === 'New_to_Old' ? orders.reverse().map(this.orders_filters) : orders.map(this.orders_filters) }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <div class="panel_distributor">
                                <select value={account_method} name="account_method" onChange={this.handleChange} >
                                    <option value="">--Payment Methods--</option>
                                    { available_payment_methods.map(item => <option value={item}>{item}</option>) }
                                </select>
                                <input type="text" value={account_number} name="account_number" onChange={this.handleChange} placeholder="Account Number" />
                                <button type="submit" onClick={() => this.paymentMethod_add()}>Add Payment Method</button>
                                <ul>
                                    { payment_methods.map(item => <li>{item.account_method}: {item.account_number}</li>) }
                                </ul>
                            </div>
                            <div class="panel_distributor">

                            </div>
                        </div>
                    </div>
                }
            </section>
        )
    }
}

export default Provincial_Distributor