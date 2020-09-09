import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './01-Navbar'
import Controls from './02-Controls'
import Orders from './03-Orders'

// Navbar for Admin Routes
export const AdminRoute = ({ component: Component , ...rest}) => {
    return (
        <Route {...rest} component={(props) => (
            <div>
                <Navbar />
                <Component {...props} />
            </div>
        )} />
    )
}

function Admin() {
    return (
        <Router>
            <Switch>
                <AdminRoute exact path="/mzU4d@t45acsXzBUKKhwaq543jjf0ldkAnE9L4Xrr725ZcVRKWysVJDFSAFBQE7xky3PbVQU8Dq3q@534fgdgjtsryhfdsajfjdsekolhjZAvppAZ" component={Controls} />
                <AdminRoute exact path="/mzU4d@t45acsXzBUKKhwaq543jjf0ldkAnE9L4Xrr725ZcVRKWysVJDFSAFBQE7xky3PbVQU8Dq3q@534fgdgjtsryhfdsajfjdsekolhjZAvppAZ/orders" component={Orders} />
            </Switch>
        </Router>
    )
}

export default Admin