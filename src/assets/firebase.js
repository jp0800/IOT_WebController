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

const controllerPath = ref(db, '/Controllers')

/* INITIALIZE AUTHENTICATION */

/* FUNCTIONS */
function writeDefaultControllerState(espID) {
  for (let i = 0; i < espID; i++) {
    let id = i + 1

    const componentButtonList = [
      //sa loob ng ESP tong line na to
      { name: 'Fan', icon: 'bi-fan', model: `fanESP_${id}` },
      { name: 'Light', icon: 'bi-lightbulb-fill', model: `lightESP_${id}` },
      { name: 'Charger', icon: 'bi-lightning-charge-fill', model: `chargerESP_${id}` },
      { name: 'Outlet', icon: 'bi-plug-fill', model: `outletESP_${id}` }
    ]
    const componentButtonState = {}
    componentButtonState[`fanESP_${id}`] = { state: false, duration: 0 }
    componentButtonState[`lightESP_${id}`] = { state: false, duration: 0 }
    componentButtonState[`chargerESP_${id}`] = { state: false, duration: 0 }
    componentButtonState[`outletESP_${id}`] = { state: false, duration: 0 }

    const manual = {}
    manual[`manualControlESP_${id}`] = false

    set(ref(db, `/Controllers/ESP_${id}/componentButtonList`), componentButtonList)
    set(ref(db, `/Controllers/ESP_${id}/componentButtonState`), componentButtonState)
    set(ref(db, `/Controllers/ESP_${id}/manual`), manual)
  }
}

/**
 *
 * @param {String} espID the string id of the component
 * @param {String} modelName the object modelname of the component
 * @param {Boolean} state state of the component object model
 *
 */
function updateESPComponentState(espID, modelName, state) {
  const stateUpdate = {}
  stateUpdate['state'] = state
  // alert(`${espID} ${modelName} ${state}`)
  update(ref(db, `/Controllers/${espID}/componentButtonState/${modelName}`), stateUpdate)
}

function updateESPManualControl(espID, state) {
  const stateUpdate = {}
  stateUpdate[`manualControl${espID}`] = state
  // alert(`${espID} ${modelName} ${state}`)
  update(ref(db, `/Controllers/${espID}/manual`), stateUpdate)
}

/**
 *
 * @param {String} espID the string id of the component
 * @param {String} modelName the object modelname of the component
 * @param {Boolean} state state of the component object model
 *
 */
function updateESPComponentTime(espID, modelName, duration) {
  const stateUpdate = {}
  stateUpdate['duration'] = duration
  // alert(`${espID} ${modelName} ${duration}`)
  update(ref(db, `/Controllers/${espID}/componentButtonState/${modelName}`), stateUpdate)
}

import { signInWithEmailAndPassword } from 'firebase/auth'
let userIsSignedIn = false

function logInUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      let user = userCredential.user
      userIsSignedIn = user ? true : false
      console.log(userIsSignedIn)
      return user;
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message

      console.log(errorCode, errorMessage)
    })
}

export { app, db, auth, controllerPath, userIsSignedIn, logInUser }
export { updateESPComponentState, updateESPComponentTime, writeDefaultControllerState, signInWithEmailAndPassword, updateESPManualControl }
