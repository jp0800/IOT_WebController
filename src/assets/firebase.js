import { initializeApp } from 'firebase/app'
import { ref, getDatabase, onValue, set, update } from 'firebase/database'

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

initializeApp(firebaseConfig)

const db = getDatabase()
const espID = 1
console.log()
export const cursor = ref(db, '/Controllers') //`/ESP_${espID}/componentButtonList`) ////

let tempData
let ESPData = {}

// onValue(cursor, (snapshot) => {
//   const data = snapshot

//   /* FOR DEBUGGING */
//   console.log('SC: Snapshot Data:')
//   console.log(data.val())

//   ESPData[`ESP_${espID}`] = data.val()
//   console.log(ESPData)
//   console.log('SC: Child Snapshot Data:')
//   /* END */

//   snapshot.forEach((childSnapshot) => {
//     if (!childSnapshot.exists()) {
//       alert('SC: ChildSnapshot <- No Data Retrieved')
//       return
//     }

//     //Iterator
//     const data = childSnapshot.val()
//     /* FOR DEBUGGING */
//     console.log(childSnapshot.key, ':', data)
//     console.log()
//     /* END */
//   })
// })

function writeDefaultControllerState(espID) {
  for (let i = 0; i < espID; i++) {
    let id = i + 1
    // const db = getDatabase()

    const componentButtonList = [
      //sa loob ng ESP tong line na to
      { name: 'Fan', icon: 'bi-fan', model: `isFanOn${id}` },
      { name: 'Light', icon: 'bi-lightbulb-fill', model: `isLightOn${id}` },
      { name: 'Charger', icon: 'bi-lightning-charge-fill', model: `isChargerOn${id}` },
      { name: 'Outlet', icon: 'bi-plug-fill', model: `isOutletOn${id}` }
    ]
    const componentButtonState = {}
    componentButtonState[`isFanOn${id}`] = false
    componentButtonState[`isLightOn${id}`] = false
    componentButtonState[`isChargerOn${id}`] = false
    componentButtonState[`isOutletOn${id}`] = false

    console.log(id)

    set(ref(db, `/Controllers/ESP_${id}/componentButtonList`), componentButtonList)
    set(ref(db, `/Controllers/ESP_${id}/componentButtonState`), componentButtonState)
  }
}

export { tempData, ESPData, writeDefaultControllerState }
export function updateESPComponentState(espID, modelName, state) {
  const stateUpdate = {}
  stateUpdate[modelName] = state
  // alert(`${espID} ${modelName} ${state}`)
  update(ref(db, `/Controllers/${espID}/componentButtonState`), stateUpdate)
}
