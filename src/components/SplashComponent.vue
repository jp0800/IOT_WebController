<script setup>
import {
  app,
  auth,
  controllerPath,
  updateESPComponentState,
  updateESPComponentTime,
  writeDefaultControllerState,
  updateESPManualControl
} from '../assets/firebase'
import { getDatabase, onValue, ref as dbRef } from 'firebase/database'

import SplashItem from '@/components/SplashItem.vue'

import { reactive, ref} from 'vue'

const emitter = defineEmits(['scUserLogout'])

function logout() {
  auth
    .signOut()
    .then(() => {
      emitter('scUserLogout', false)
      alert('User logged Out')
    })
    .catch((error) => {
      alert(error)
    })
}

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

    console.log(ESPData.value)
  })
})

onValue(
  dbRef(getDatabase(app), '/Controllers/ESP_1/componentButtonState/chargerESP_1/duration'),
  (snapshot) => {
    const chargerDuration = snapshot.val()
    if (chargerDuration > 0) {
      normalizeTimeData('ESP_1', snapshot.val(), 'chargerESP_1')
      updateESPComponentState('ESP_1', 'chargerESP_1', true)
    }
  }
)
onValue(
  dbRef(getDatabase(app), '/Controllers/ESP_1/componentButtonState/fanESP_1/duration'),
  (snapshot) => {
    const chargerDuration = snapshot.val()
    if (chargerDuration > 0) {
      normalizeTimeData('ESP_1', snapshot.val(), 'fanESP_1')
      updateESPComponentState('ESP_1', 'fanESP_1', true)
    }
  }
)
onValue(
  dbRef(getDatabase(app), '/Controllers/ESP_1/componentButtonState/lightESP_1/duration'),
  (snapshot) => {
    const chargerDuration = snapshot.val()
    if (chargerDuration > 0) {
      normalizeTimeData('ESP_1', snapshot.val(), 'lightESP_1')
      updateESPComponentState('ESP_1', 'lightESP_1', true)
    }
  }
)
onValue(
  dbRef(getDatabase(app), '/Controllers/ESP_1/componentButtonState/outletESP_1/duration'),
  (snapshot) => {
    const chargerDuration = snapshot.val()
    if (chargerDuration > 0) {
      normalizeTimeData('ESP_1', snapshot.val(), 'outletESP_1')
      updateESPComponentState('ESP_1', 'outletESP_1', true)
    }
  }
)

const r = reactive({
  isESPConnected: {},
  data: ESPData.value,
  dropDownSelected: {},
  inputValue: {},
  display: {}, // {hrs, min, sec}
  displayTimerId: [],
  isManualOn: {}
})

function toggleManualControl(id) {
  if (r.isManualOn[id] === undefined) {
    r.isManualOn[id] = true

    console.log(r.isManualOn)
  } else {
    r.isManualOn[id] = !r.isManualOn[id]
  }
  
  updateESPManualControl(id,r.isManualOn[id])

  if(r.isManualOn[id] === false){
    writeDefaultControllerState(1)
    updateESPManualControl(id,false)
  }
}
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
  if (Number(hrs) === 0 && Number(min) === 0 && Number(sec) <= 1 ) return ''
  if (hrs === '' && min === '' && sec === '') return ''

  return `${hrs} : ${min} : ${sec}`
}

writeDefaultControllerState(Object.keys(ESPData.value).length)

function toggleApplianceButton(id, modelName) {
  if (r.isManualOn[id]) {
    updateESPComponentState(id, modelName, !ESPData.value[id].componentButtonState[modelName].state)
    stopTimer(id, modelName)
  } else {
    updateESPComponentState(id, modelName, false)
  }
  updateESPComponentTime(id, modelName, 0)

  console.log(id)
  console.log(ESPData.value)
  console.log(ESPData.value[id].componentButtonState[modelName])
}

/**
 * @param {*} modelName
 */
function stopTimer(modelName) {
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
  let hours = r.inputValue[`hrs${id}`]
  let minutes = r.inputValue[`min${id}`]

  let duration = hours * 3600 + minutes * 60
  updateESPComponentTime(id, modelName, duration)
  updateESPComponentState(id, modelName, true)

  normalizeTimeData(id, duration, modelName)

  r.inputValue[`hrs${id}`] = ''
  r.inputValue[`min${id}`] = ''
}
/**
 *
 * @param {*} id
 * @param {*} duration
 * @param {*} modelName
 */
function normalizeTimeData(id, duration, modelName) {
  var timer = duration,
    hours,
    minutes,
    remainingSeconds,
    seconds

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

  if (timer === 1) {
    updateESPComponentState(id, modelName, false)
  }
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
  <button @click.prevent="logout" class="sc-logout-button">
    <i class="bi bi-box-arrow-right"></i> LOGOUT
  </button>
  <!-- <SplashItem>
    <template #icon>
      <i class="bi bi-book"></i>
    </template>
    <template #heading> Abstract </template>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam quasi tenetur esse optio amet
    eveniet nostrum molestiae animi asperiores et mollitia sed doloremque, incidunt aliquam
    consectetur? Quia alias iusto impedit!
  </SplashItem> -->

  <SplashItem>
    <template #icon>
      <i class="bi bi-sliders"></i>
    </template>
    <template #heading> Tooling • ESP8266 </template>
    <!-- <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, debitis praesentium ullam
      aspernatur ducimus fugiat qui? Natus eius fugiat aliquid consequatur iste. Voluptatibus
      nostrum magni illo incidunt maxime minus exercitationem!
    </p> -->
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
            @submit.prevent="setTime(comp.id, r.dropDownSelected[`component${comp.id}`])"
          >
            <div class="form-input-group">
              <input
                class="form-input"
                type="number"
                maxlength="2"
                max="24"
                min="0"
                :id="`hrs${comp.id}`"
                v-model="r.inputValue[`hrs${comp.id}`]"
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
                v-model="r.inputValue[`min${comp.id}`]"
                required
              />
              <label :for="`min${comp.id}`">mins</label>
            </div>
            <div class="form-dropdown-group">
              <label :for="`component${comp.id}`">Component:</label>
              <select
                class="form-dropdown"
                v-model="r.dropDownSelected[`component${comp.id}`]"
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
              <button class="form-button" :disabled="r.isManualOn[comp.id]">Set</button>
            </div>
          </form>
          <button
            class="form-button"
            :class="r.isManualOn[comp.id] ? 'green' : ''"
            @click="toggleManualControl(comp.id)"
          >
            Manual: {{ r.isManualOn[comp.id] ? 'on' : 'off' }}
          </button>
        </div>
        <div class="component-button-container">
          <div v-for="item in comp.componentButtonList" :key="item.id">
            <button
              type="button"
              class="btn"
              data-bs-toggle="button"
              @click="toggleApplianceButton(comp.id, item.model)"
              :class="comp.componentButtonState[item.model].state ? 'green' : ''"
              :disabled="!comp.componentButtonState[item.model].state && !r.isManualOn[comp.id]"
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

  <!-- <SplashItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Ecosystem</template>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem quo blanditiis nobis enim ex
    sint recusandae maxime beatae eum eaque. Necessitatibus vel assumenda architecto exercitationem
    aspernatur optio aliquam facilis ab!
  </SplashItem> -->

  <!-- <SplashItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor, labore illo culpa tempore
    reprehenderit laboriosam nemo corporis, debitis odit fuga, at quasi perspiciatis omnis!
    Molestiae sequi harum eveniet cupiditate voluptatibus!
  </SplashItem> -->

  <!-- <SplashItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Developers</template>

    Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, commodi minus! Quibusdam
    officia sunt quidem a quae. Quae nisi totam error, blanditiis dicta reprehenderit voluptate, nam
    suscipit distinctio eos debitis.
  </SplashItem> -->
</template>

<style scoped>
.sc-logout-button {
  position: fixed;
  top: 2rem;
  right: 2rem;

  background-color: #222222;
  color: white;
  
  padding: 0.2rem 0.7rem;

  outline: none;
  border: none;
  border-radius: 1rem;
  
  display: flex;
  gap: 1rem;
  align-items: center;
  z-index: 1;

  max-width: 3rem;
  overflow: hidden;

  transition: 0.3s cubic-bezier(0.445, 0.05, 0.55, 0.95);
}

.sc-logout-button:hover {
  box-shadow: 0px 0px 5px 2px #00bd7e;
  max-width: 10rem;
}

.bi.bi-box-arrow-right {
  font-size: 2rem;
  color: #00bd7e;
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
