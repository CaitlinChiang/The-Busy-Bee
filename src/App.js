import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Client from './client'
import Admin from './admin'
import Distributor from './distributors'

function App() {
	return (
		<Router>
			<Route path="/" component={Client} />
			<Route path="/mzU4d@t45acsXzBUKKhwaq543jjf0ldkAnE9L4Xrr725ZcVRKWysVJDFSAFBQE7xky3PbVQU8Dq3q@534fgdgjtsryhfdsajfjdsekolhjZAvppAZ" component={Admin} />
			<Route path="/mFDADFSAfdsafdsfeEFEFSGDDFjf0ldkAnE9L4Xrr725ZcVRKWffd4444twdsJFLEdkHFHFlKDJGJIEOgnsogheisKFHGkdjKDLGHdlKKjZAvppAZ" component={Distributor} />
		</Router>
	)
}

export default App