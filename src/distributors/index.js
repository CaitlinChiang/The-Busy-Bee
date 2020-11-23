import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './Navbar'
import Regional_Distributor from './Regional'
import Provincial_Distributor from './Provincial'

export const DistributorRoute = ({ component: Component , ...rest}) => {
    return (
        <Route {...rest} component={(props) => (
            <div>
                <Navbar />
                <Component {...props} />
            </div>
        )} />
    )
}

function Distributor() {
    return (
        <Router>
            <DistributorRoute exact path="/mFDADFSAfdsafdsfeEFEFSGDDFjf0ldkAnE9L4Xrr725ZcVRKWffd4444twdsJFLEdkHFHFlKDJGJIEOgnsogheisKFHGkdjKDLGHdlKKjZAvppAZ/regional/:password/:region" component={Regional_Distributor} />
            <DistributorRoute exact path="/mFDADFSAfdsafdsfeEFEFSGDDFjf0ldkAnE9L4Xrr725ZcVRKWffd4444twdsJFLEdkHFHFlKDJGJIEOgnsogheisKFHGkdjKDLGHdlKKjZAvppAZ/provincial/:password/:province" component={Provincial_Distributor} />
        </Router>
    )
}

export default Distributor