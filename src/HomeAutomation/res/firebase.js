import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { ref, getDatabase, onValue, set, update } from 'firebase/database'

/* INITIALIZE DATABASE */
const firebaseConfig = {
  apiKey: 'AIzaSyBdoIbJ4Pv8pBhdNjXonNEbB4BFmRLjroI',
  authDomain: 'homeautomation-4af1c.firebaseapp.com',
  databaseURL: 'https://homeautomation-4af1c-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'homeautomation-4af1c',
  storageBucket: 'homeautomation-4af1c.appspot.com',
  messagingSenderId: '461594337801',
  appId: '1:461594337801:web:df4d57542b0ebe5e124ed8',
  measurementId: 'G-MWJNR1EQRF'
}
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

auth.useDeviceLanguage()

const db = getDatabase(app)

function apiPOST(params, path) {
  set(ref(db, path), params)
}

// Create initial data

// apiPOST(
//   {
//     fanStatus: {
//       name: 'fanStatus',
//       reference: '00:00:00',
//       indefiniteOn: false
//     },
//     lightStatus: {
//       name: 'lightStatus',
//       reference: '00:00:00',
//       indefiniteOn: false
//     },
//     outletStatus: {
//       name: 'outletStatus',
//       reference: '00:00:00',
//       indefiniteOn: false
//     },
//     chargerStatus: {
//       name: 'chargerStatus',
//       reference: '00:00:00',
//       indefiniteOn: false
//     }
//   },
//   `/Controllers/ESP_${1}/componentButtonList`
// )
export { app, auth, apiPOST }
