<script setup>
import {
  app,
  auth,
  controllerPath,
  logInUser,
  updateESPComponentState,
  updateESPComponentTime,
  writeDefaultControllerState,
  userIsSignedIn,
  signInWithEmailAndPassword
} from '../assets/firebase'
import { getDatabase, onValue, set, update, ref as dbRef } from 'firebase/database'

import SplashItem from '@/components/SplashItem.vue'

import CommunityIcon from './icons/IconCommunity.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import SupportIcon from './icons/IconSupport.vue'

import { componentButtonList, componentButtonState, isESP32Connected } from '@/assets/templates.js'
import { reactive, ref, computed } from 'vue'

const userData = reactive({
  credentials: {
    email: '',
    password: ''
  },
  auth: {
    isUserSignedIn: false
  }
})

function accountLogin(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      console.log(user)
      userData.auth.isUserSignedIn = user ? true : false

      userData.credentials.email = ''
      userData.credentials.password = ''
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message

      console.log(errorCode, errorMessage)
    })
}

function logout() {
  auth
    .signOut()
    .then(() => {
      userData.auth.isUserSignedIn = false
      // Sign-out successful.
      alert('User logged Out')
    })
    .catch((error) => {
      // An error happened.

      console.log(error)
    })
}

//NEED SOMETHING TO RESET THE DATABASE DEFAULT VALUES
// const espID = 1
// writeDefaultControllerState(espID)

const ESPData = ref({})
onValue(controllerPath, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    if (!childSnapshot.exists()) {
      alert('SC: ChildSnapshot <- No Data Retrieved')
      return
    }
    const data = childSnapshot.val()

    ESPData.value[childSnapshot.key] = {
      id: childSnapshot.key,
      ...data
    }
  })
})

// function getESPComponentTime(espID, modelName){
onValue(
  dbRef(getDatabase(app), '/Controllers/ESP_1/componentButtonState/chargerESP_1/duration'),
  (snapshot) => {
    const chargerDuration = snapshot.val()
    if (chargerDuration > 0) {
      startTimer('ESP_1', snapshot.val(), 'chargerESP_1')
      updateESPComponentState('ESP_1', 'chargerESP_1', true)

      console.log(snapshot.val())
    }
    // snapshot.forEach((childSnapshot) => {
    //   if (!childSnapshot.exists()) {
    //     alert('SC: ChildSnapshot <- No Data Retrieved')
    //     return
    //   }
    //   const data = childSnapshot.val()
    // })
  }
)
// }

const r = reactive({
  isESPConnected: isESP32Connected,
  data: ESPData.value,
  selected: {},
  value: {},
  display: {}, // {hrs, min, sec}
  displayTimerId: []
})
/**
 * @deprecated
 * @param {*} modelName
 */
function getTime(modelName) {
  let hrs, min, sec

  hrs = r.display[`hrs${modelName}`]
  min = r.display[`min${modelName}`]
  sec = r.display[`sec${modelName}`]

  if (isNaN(Number(hrs)) && isNaN(Number(min)) && isNaN(Number(sec))) return ''
  if (hrs === '' && min === '' && sec === '') return ''

  return `${hrs} : ${min} : ${sec}`
}

writeDefaultControllerState(Object.keys(ESPData.value).length)

function toggleButton(id, modelName) {
  updateESPComponentState(id, modelName, false)
  updateESPComponentTime(id, modelName, 0)

  stopTimer(id, modelName)
  console.log(ESPData.value)
  console.log(ESPData.value[id].componentButtonState[modelName])
}
/**
 * @deprecated
 * @param {*} modelName
 */
function stopTimer(modelName) {
  clearInterval(r.displayTimerId[modelName])

  r.display[`hrs${modelName}`] = ''
  r.display[`min${modelName}`] = ''
  r.display[`sec${modelName}`] = ''
}
/**
 * @deprecated
 * @param {*} id
 * @param {*} modelName
 */
function setTime(id, modelName) {
  let hours = r.value[`hrs${id}`]
  let minutes = r.value[`min${id}`]

  let duration = hours * 3600 + minutes * 60
  updateESPComponentTime(id, modelName, duration)
  updateESPComponentState(id, modelName, true)

  stopTimer(modelName)
  startTimer(id, duration, modelName)

  r.value[`hrs${id}`] = ''
  r.value[`min${id}`] = ''
}
/**
 * @deprecated
 * @param {*} id
 * @param {*} duration
 * @param {*} modelName
 */
function startTimer(id, duration, modelName) {
  var timer = duration,
    hours,
    minutes,
    remainingSeconds,
    seconds

  // r.displayTimerId[modelName] = setInterval(function () {
  hours = Math.floor(timer / 3600)
  remainingSeconds = timer % 3600
  minutes = Math.floor(remainingSeconds / 60)
  seconds = parseInt(timer % 60, 10)

  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  r.display[`hrs${modelName}`] = hours
  r.display[`min${modelName}`] = minutes
  r.display[`sec${modelName}`] = seconds

  if (timer < 0) {
    timer = duration
    stopTimer(modelName)
    // updateESPComponentTime(id, modelName, 0)
    updateESPComponentState(id, modelName, false)
  }
  // }, 1000)
}

/**
 * TODO
 * yung nodemcu connection
 * yung timer need sa node mcu manggaling para centralized
 *
 * remove all unnecesary comments
 */
</script>

<template>
  <SplashItem>
    <template #icon>
      <i class="bi bi-bezier2 logo green"></i>
    </template>

    <template #heading> Power Management System </template>
    <button v-if="userData.auth.isUserSignedIn" @click.prevent="logout" class="sc-logout-button">
      <i class="bi bi-box-arrow-right"></i> LOGOUT
    </button>
    <form
      v-if="!userData.auth.isUserSignedIn"
      class="sc-form"
      @submit.prevent="accountLogin(userData.credentials.email, userData.credentials.password)"
    >
      <h4 class="sc-form-title">LOGIN</h4>
      <label class="sc-label" for="sc-username">Email Address</label>
      <input
        v-model.trim="userData.credentials.email"
        class="sc-input"
        id="sc-username"
        type="email"
        autocomplete="off"
        required
      />

      <label class="sc-label" for="sc-password">Password</label>
      <input
        v-model.trim="userData.credentials.password"
        class="sc-input"
        id="sc-password"
        type="password"
        autocomplete="off"
        required
      />

      <button class="sc-button">Login</button>
    </form>
  </SplashItem>

  <SplashItem v-if="userData.auth.isUserSignedIn">
    <template #icon>
      <i class="bi bi-book"></i>
    </template>
    <template #heading> Abstract </template>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam quasi tenetur esse optio amet
    eveniet nostrum molestiae animi asperiores et mollitia sed doloremque, incidunt aliquam
    consectetur? Quia alias iusto impedit!
  </SplashItem>

  <SplashItem v-if="userData.auth.isUserSignedIn">
    <template #icon>
      <i class="bi bi-sliders"></i>
    </template>
    <template #heading> Tooling • ESP8266 </template>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, debitis praesentium ullam
      aspernatur ducimus fugiat qui? Natus eius fugiat aliquid consequatur iste. Voluptatibus
      nostrum magni illo incidunt maxime minus exercitationem!
    </p>
    <span class="component-header overflow-auto">
      <span v-for="comp in r.data" :key="comp.id">
        <h3>
          {{ comp.id }}
          <span class="con-status" :class="r.isESPConnected ? 'green' : ''">
            <b>
              {{ r.isESPConnected ? 'Connected' : 'Disconnected' }}
            </b>
          </span>
        </h3>
        <div>
          <form
            class="form"
            @keypress.enter.prevent
            @submit.prevent="setTime(comp.id, r.selected[`component${comp.id}`])"
          >
            <div class="form-input-group">
              <input
                class="form-input"
                type="number"
                maxlength="2"
                max="24"
                min="0"
                :id="`hrs${comp.id}`"
                v-model="r.value[`hrs${comp.id}`]"
                required
              />
              <label :for="`hrs${comp.id}`">hrs</label> :
              <input
                class="form-input"
                type="number"
                maxlength="2"
                max="59"
                min="0"
                :id="`min${comp.id}`"
                v-model="r.value[`min${comp.id}`]"
                required
              />
              <label :for="`min${comp.id}`">mins</label>
            </div>
            <div class="form-dropdown-group">
              <label :for="`component${comp.id}`">Component:</label>
              <select
                class="form-dropdown"
                v-model="r.selected[`component${comp.id}`]"
                name="component"
                :id="`component${comp.id}`"
                required
              >
                <option :value="`fan${comp.id}`">Fan</option>
                <option :value="`light${comp.id}`">Light</option>
                <option :value="`charger${comp.id}`">Charger</option>
                <option :value="`outlet${comp.id}`">Outlet</option>
              </select>
            </div>
            <div class="form-button-group">
              <button class="form-button">Set</button>
            </div>
          </form>
        </div>
        <div class="component-button-container">
          <div v-for="item in comp.componentButtonList" :key="item.id">
            <button
              type="button"
              class="btn"
              data-bs-toggle="button"
              @click="toggleButton(comp.id, item.model)"
              :class="comp.componentButtonState[item.model].state ? 'green' : ''"
              :disabled="!comp.componentButtonState[item.model].state"
            >
              <i class="bi" :class="item.icon"></i>
              <b>{{ item.name }}</b>
              {{ getTime(item.model) }}
            </button>
          </div>
        </div>
      </span>
    </span>
  </SplashItem>

  <SplashItem v-if="userData.auth.isUserSignedIn">
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Ecosystem</template>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem quo blanditiis nobis enim ex
    sint recusandae maxime beatae eum eaque. Necessitatibus vel assumenda architecto exercitationem
    aspernatur optio aliquam facilis ab!
  </SplashItem>

  <SplashItem v-if="userData.auth.isUserSignedIn">
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor, labore illo culpa tempore
    reprehenderit laboriosam nemo corporis, debitis odit fuga, at quasi perspiciatis omnis!
    Molestiae sequi harum eveniet cupiditate voluptatibus!
  </SplashItem>

  <SplashItem v-if="userData.auth.isUserSignedIn">
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading><a href="">Developers</a></template>

    Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, commodi minus! Quibusdam
    officia sunt quidem a quae. Quae nisi totam error, blanditiis dicta reprehenderit voluptate, nam
    suscipit distinctio eos debitis.
  </SplashItem>
</template>

<style scoped>
.sc-logout-button {
  background-color: transparent;
  padding: 0.5rem;

  outline: none;
  border: none;
  transition: 0.4s ease;

  color: white;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.sc-logout-button:hover {
  box-shadow: inset 0px 0px 5px 2px #00bd7e;
}

.bi.bi-box-arrow-right {
  font-size: 2rem;
  color: #00bd7e;
}
.sc-form {
  max-width: 20rem;
  box-shadow: inset 0px 0px 5px 2px #00bd7e;
  display: flex;
  flex-direction: column;

  padding: 2rem;
  margin: 2.5rem 0;

  border-radius: 0.8rem;
}
.sc-form-title{
  margin-bottom: 1rem;
}
.sc-label {
  font-size: 0.9rem;
  font-weight: bold;

  text-transform: lowercase;
}
.sc-input {
  margin-bottom: 1rem;
  padding: 0.2rem;

  border-radius: 0.4rem;
}

.sc-button {
  border-radius: 0.4rem;

  padding: 0.5rem;
  margin-top: 1.5rem;

  font-weight: bold;
  text-transform: uppercase;

  background-color: transparent;
  border: 5px solid rgb(0, 189, 126);

  color: rgb(0, 189, 126);
  transition: 0.4s ease;
}

.sc-button:hover {
  box-shadow: 0px 0px 5px 1px rgb(0, 189, 126);
}
button > .bi {
  font-size: 4rem;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.btn {
  display: flex;
  flex-direction: column;
  place-items: center;
  margin: 1rem 0.5rem;
}
.btn:disabled {
  border: none;
  color: #222222;
}
.con-status {
  float: right;
  font-size: 1rem;
}

.form {
  display: flex;
  flex-wrap: wrap;
  gap: 0 1rem;
  justify-content: space-between;
}
.form-dropdown-group,
.form-input-group,
.form-button-group {
  display: flex;
  gap: 0 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}
.form-input {
  overflow: hidden;
  outline: none;
  border-radius: 0.5rem;

  background: #555;
  color: white;

  font-weight: bold;
  text-align: center;

  width: 4rem;
  padding: 0 1rem;
}
.form-dropdown {
  background-color: #555;
  color: white;

  font-weight: bold;
  border-radius: 0.5rem;

  padding: 0 0.5rem;
}
.form-button {
  border-radius: 0.4rem;
  padding: 0 1rem;
  background: #555;
  color: white;
}
.component-header {
  width: 100%;
  max-height: 25rem;

  overflow-y: auto;
  display: block;

  box-shadow: inset 0px 0px 5px 2px rgb(0, 189, 126);
  border-radius: 0.8rem;
  padding: 2rem;
}
.component-header > span {
  width: 100%;
}

.component-button-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

@media (max-width: 1024px) {
  .form-button-group {
    justify-content: start;
  }
  .form-button {
    margin: 0;
    margin-bottom: 0.5rem;
  }
}
</style>
