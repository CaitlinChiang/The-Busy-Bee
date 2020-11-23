import React, { Component } from 'react'
import * as firebase from 'firebase'
import '../admin_css/02-Controls.css'

class Controls extends Component {
    state = {
        products: [],
        product: '',
        stock: true,
        username_regional: '',
        password_regional: '',
        proof_regional: '',
        username_provincial: '',
        password_provincial: '',
        proof_provincial: '',
        regions: [],
        region: '',
        provinces: [],
        province: ''
    }

    componentDidMount = _ => {
        this.products_fetch()
        this.regions_fetch()
        this.provinces_fetch()
    }

    // Fetch Data
    products_fetch = _ => {
        firebase.database().ref('products').once('value', snapshot => {
            snapshot.forEach((snap) => {
                this.setState({ products: this.state.products.concat(snap.val().product_name) })
            })
        })
    }
    
    regions_fetch = _ => {
        firebase.database().ref('locations').once('value', snapshot => {
            snapshot.forEach((snap) => {
                if (!this.state.regions.includes(snap.val().province_region)) {
                    this.setState({ regions: this.state.regions.concat(snap.val().province_region) })
                }
            })
        })
    }

    provinces_fetch = _ => {
        firebase.database().ref('locations').once('value', snapshot => {
            snapshot.forEach((snap) => {
                this.setState({ provinces: this.state.provinces.concat(snap.key) })
            })
        })
    }

    // Add Data
    distributor_add = place => {
        const { region, province, username_regional, password_regional, proof_regional, username_provincial, password_provincial, proof_provincial } = this.state

        if (place === 'regional') {
            if (region.trim() !== '' && username_regional.trim() !== '' && password_regional.trim() !== '' && proof_regional.trim() !== '') {
                const confirm = window.confirm("Are you sure you would like to add this regional distributor?")
    
                if (confirm) {
                    firebase.database().ref('distributors').child('regions').child(region).child('distributor').update({
                        username: username_regional,
                        password: password_regional,
                        proof: proof_regional
                    })
                }
            }
            else alert("Please fill in all needed input fields.")
        }
        else if (place === 'provincial') {
            if (province.trim() !== '' && username_provincial.trim() !== '' && password_provincial.trim() !== '' && proof_provincial.trim() !== '') {
                const confirm = window.confirm("Are you sure you would like to add this provincial distributor?")
    
                if (confirm) {
                    firebase.database().ref('distributors').child('provinces').child(province).child('distributor').update({
                        username: username_provincial,
                        password: password_provincial,
                        proof: proof_provincial
                    })
                }
            }
            else alert("Please fill in all needed input fields.")
        }

        this.clear()
    }

    // Edit Data
    stock_change = action => {
        const { product } = this.state

        firebase.database().ref('products').once('value', snapshot => {
            snapshot.forEach((snap) => {
                if (snap.val().product_name === product) {
                    if (action === 'available') {
                        firebase.database().ref('products').child(snap.key).update({ stock: true })
                    }
                    else if (action === 'not-available') {
                        firebase.database().ref('products').child(snap.key).update({ stock: false })
                    }
                }
            })
        })
    }

    // Helper Functions
    handleChange = event => {
        event.preventDefault()
        const { name, value } = event.target
        this.setState({ [name]: value })
    }

    sortArray = (array) => {
	    return array.sort((a, b) => {
	        var x = a.province_region
	        var y = b.province_region
	        return ((x > y) ? 1 : ((x < y) ? -1 : 0));
	    })
    }
    
    clear = _ => {
        this.setState({
            username_regional: '',
            password_regional: '',
            proof_regional: '',
            region: '',
            username_provincial: '',
            password_provincial: '',
            proof_provincial: '',
            province: ''
        })
    }

    render() {
        const { products, product, username_regional, password_regional, proof_regional, username_provincial, password_provincial, proof_provincial, regions, region, provinces, province } = this.state

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
                            <button onClick={() => this.stock_change('available')}>In Stock</button>
                            <button onClick={() => this.stock_change('not-available')}>Out of Stock</button>
                        </div>

                        <div class="panel_distributor">
                            <select value={region} name="region" onChange={this.handleChange}> 
                                <option value="">--Region--</option>
                                { this.sortArray(regions).map(item => <option value={item}>{item}</option>) }
                            </select>
                            <input type="text" value={username_regional.trim()} name="username_regional" onChange={this.handleChange} placeholder="Distributor Email" />
                            <input type="text" value={password_regional.trim()} name="password_regional" onChange={this.handleChange} placeholder="Distributor Password" />
                            <input type="text" value={proof_regional} name="proof_regional" onChange={this.handleChange} placeholder="Proof of Payment" />
                            <button type="submit" onClick={() => this.distributor_add('regional')}>Add Regional Distributor</button>
                        </div>

                        <div class="panel_distributor">
                            <select value={province} name="province" onChange={this.handleChange}> 
                                <option value="">--Province--</option>
                                { this.sortArray(provinces).map(item => <option value={item}>{item}</option>) }
                            </select>
                            <input type="text" value={username_provincial.trim()} name="username_provincial" onChange={this.handleChange} placeholder="Distributor Email" />
                            <input type="text" value={password_provincial.trim()} name="password_provincial" onChange={this.handleChange} placeholder="Distributor Password" />
                            <input type="text" value={proof_provincial} name="proof_provincial" onChange={this.handleChange} placeholder="Proof of Payment" />
                            <button type="submit" onClick={() => this.distributor_add('provincial')}>Add Provincial Distributor</button>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default Controls