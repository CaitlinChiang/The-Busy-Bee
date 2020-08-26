import * as firebase from 'firebase'

const firebaseConfig = {
	apiKey: "AIzaSyDX5X6F2FoLApezbmtNWbZU-l5qc_9yFWg",
    authDomain: "the-busy-bee-d3383.firebaseapp.com",
    databaseURL: "https://the-busy-bee-d3383.firebaseio.com",
    projectId: "the-busy-bee-d3383",
    storageBucket: "the-busy-bee-d3383.appspot.com",
    messagingSenderId: "934542688306",
    appId: "1:934542688306:web:36a65d88561ddf5f473c2b"
}

firebase.initializeApp(firebaseConfig)

export default firebase