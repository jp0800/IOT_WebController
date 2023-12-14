<template>
  <div class="rc-parent">
    <a class="rc-container" href="" @click.prevent="showController">
      <div class="rc-room-header">
        <h1>{{ props.title }}</h1>
      </div>
      <div class="rc-room-active">
        <div :class="checkActive('fanStatus') ? 'green' : ''">
          <i class="bi bi-fan"></i>
          <p v-if="events.input.selected !== 'manual'">
            {{ differenceToString(events.componentStatus.fanStatus.difference) }}
          </p>
          <p v-else>{{ events.componentStatus.fanStatus.indefiniteOn ? 'On' : 'Off' }}</p>
        </div>
        <div :class="checkActive('lightStatus') ? 'green' : ''">
          <i class="bi bi-lightbulb-fill"></i>
          <p v-if="events.input.selected !== 'manual'">
            {{ differenceToString(events.componentStatus.lightStatus.difference) }}
          </p>
          <p v-else>{{ events.componentStatus.lightStatus.indefiniteOn ? 'On' : 'Off' }}</p>
        </div>
        <div :class="checkActive('chargerStatus') ? 'green' : ''">
          <i class="bi bi-lightbulb-fill"></i>
          <p v-if="events.input.selected !== 'manual'">
            {{ differenceToString(events.componentStatus.chargerStatus.difference) }}
          </p>
          <p v-else>{{ events.componentStatus.chargerStatus.indefiniteOn ? 'On' : 'Off' }}</p>
        </div>
        <div :class="checkActive('outletStatus') ? 'green' : ''">
          <i class="bi bi-plug-fill"></i>
          <p v-if="events.input.selected !== 'manual'">
            {{ differenceToString(events.componentStatus.outletStatus.difference) }}
          </p>
          <p v-else>{{ events.componentStatus.outletStatus.indefiniteOn ? 'On' : 'Off' }}</p>
        </div>
      </div>
      <div class="rc-room-notification" v-if="!props.isAvailable">
        <p class="rc-room-disconnected">Room is unavailable</p>
      </div>
    </a>
    <div v-if="events.showController" class="rc-set-container">
      <form class="rc-set-form" @submit.prevent="setComponentStatus(events.input)">
        <div>
          <label for="rc-set-components" class="rc-set-component-label rc-set-label"
            >Component</label
          >
          <select
            v-model="events.input.selected"
            name="rc-set-components"
            id="rc-set-components"
            required
          >
            <option value="manual">Manual</option>
            <option value="fanStatus">Fan</option>
            <option value="lightStatus">Light 1</option>
            <option value="chargerStatus">Light 2</option>
            <option value="outletStatus">Outlet</option>
            <option value="all">All</option>
          </select>
        </div>
        <div v-if="events.input.selected !== 'manual'">
          <label for="rc-set-hrs" class="rc-set-label">Hour(s)</label>
          <input
            id="rc-set-hrs"
            v-model="events.input.hrs"
            class="rc-set-time"
            type="number"
            min="0"
            max="24"
            required
          />
          <label for="rc-set-min" class="rc-set-label">Minute(s)</label>
          <input
            id="rc-set-min"
            v-model="events.input.mins"
            class="rc-set-time"
            type="number"
            min="0"
            max="59"
            required
          />
          <label for="rc-set-sec" class="rc-set-label">Second(s)</label>
          <input
            id="rc-set-sec"
            v-model="events.input.secs"
            class="rc-set-time"
            type="number"
            min="0"
            max="59"
            required
          />
        </div>
        <div v-else class="rc-set-manual">
          <button @click.prevent="toggleComponentStatus('fanStatus')">
            <i class="bi bi-fan"></i><br />Fan
          </button>
          <button @click.prevent="toggleComponentStatus('lightStatus')">
            <i class="bi bi-lightbulb-fill"></i><br />Light 1
          </button>
          <button @click.prevent="toggleComponentStatus('chargerStatus')">
            <i class="bi bi-lightbulb-fill"></i><br />Light 2
          </button>
          <button @click.prevent="toggleComponentStatus('outletStatus')">
            <i class="bi bi-plug-fill"></i><br />Outlet
          </button>
        </div>

        <button v-if="events.input.selected !== 'manual'" class="rc-set-button">Set</button>
        <button @click.prevent="shutdownComponents()" class="rc-set-button rc-shutdown">
          Shutdown All
        </button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { getFutureTime, getTimeDifference, differenceToString } from '../res/utility'
import { app, apiPOST } from '../res/firebase'

import { getDatabase, onValue, ref as dbRef } from 'firebase/database'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    required: true
  }
})

const events = reactive({
  showController: false,
  input: {
    selected: '',
    hrs: 0,
    mins: 0,
    secs: 0
  },
  componentStatus: {
    fanStatus: {
      name: 'fanStatus',
      reference: { date: '', time: '', active: true },
      difference: { hours: 0, minutes: 0, seconds: 0 },
      indefiniteOn: false
    },
    lightStatus: {
      name: 'lightStatus',
      reference: { date: '', time: '', active: true },
      difference: { hours: 0, minutes: 0, seconds: 0 },
      indefiniteOn: false
    },
    outletStatus: {
      name: 'outletStatus',
      reference: { date: '', time: '', active: true },
      difference: { hours: 0, minutes: 0, seconds: 0 },
      indefiniteOn: false
    },
    chargerStatus: {
      name: 'chargerStatus',
      reference: { date: '', time: '', active: true },
      difference: { hours: 0, minutes: 0, seconds: 0 },
      indefiniteOn: false
    }
  }
})

onValue(dbRef(getDatabase(app), `/Controllers/${props.id}/componentButtonList/`), (snapshot) => {
  const componentStatus = snapshot.val()

  try {
    events.databaseResult = componentStatus

    events.componentStatus.chargerStatus.reference = componentStatus.chargerStatus.reference
    events.componentStatus.fanStatus.reference = componentStatus.fanStatus.reference
    events.componentStatus.lightStatus.reference = componentStatus.lightStatus.reference
    events.componentStatus.outletStatus.reference = componentStatus.outletStatus.reference

    events.componentStatus.chargerStatus.indefiniteOn = componentStatus.chargerStatus.indefiniteOn
    events.componentStatus.fanStatus.indefiniteOn = componentStatus.fanStatus.indefiniteOn
    events.componentStatus.lightStatus.indefiniteOn = componentStatus.lightStatus.indefiniteOn
    events.componentStatus.outletStatus.indefiniteOn = componentStatus.outletStatus.indefiniteOn
  } catch (err) {
    /* empty */
  }
})

function showController() {
  if (props.isAvailable) events.showController = !events.showController
}

function checkActive(component) {
  let hrs = 0
  let min = 0
  let sec = 0
  let man = false
  try {
    hrs = events.componentStatus[component].difference.hours > 0
    min = events.componentStatus[component].difference.minutes > 0
    sec = events.componentStatus[component].difference.seconds > 0
    man = events.componentStatus[component].indefiniteOn
  } catch (err) {
    /* empty */
  }

  return hrs || min || sec || man
}

function setComponentStatus(input) {
  // prettier-ignore
  if (input.selected === 'all') {
    const date = getFutureTime(input.hrs, input.mins, input.secs);

    events.componentStatus.lightStatus.reference   = date
    events.componentStatus.fanStatus.reference     = date
    events.componentStatus.chargerStatus.reference = date
    events.componentStatus.outletStatus.reference  = date

    events.componentStatus.lightStatus.indefiniteOn   = false
    events.componentStatus.fanStatus.indefiniteOn     = false
    events.componentStatus.chargerStatus.indefiniteOn = false
    events.componentStatus.outletStatus.indefiniteOn  = false

    const temp = {
      fanStatus: {
        name: "fanStatus",
        reference: date,
        indefiniteOn: false
      },
      lightStatus: {
        name: "lightStatus",
        reference: date,
        indefiniteOn: false
      },
      outletStatus: {
        name: "outletStatus",
        reference: date,
        indefiniteOn: false
      },
      chargerStatus: {
        name: "chargerStatus",
        reference: date,
        indefiniteOn: false
      }
    }

    apiPOST(temp,`/Controllers/${props.id}/componentButtonList`)
  } else {
    const date = getFutureTime(input.hrs, input.mins, input.secs)

    events.componentStatus[input.selected].name = input.selected
    events.componentStatus[input.selected].reference = date
    events.componentStatus[input.selected].indefiniteOn = false

    const temp = {}
    temp["name"] = input.selected
    temp["reference"] = date
    temp["indefiniteOn"] = false

    apiPOST(temp,`/Controllers/${props.id}/componentButtonList/${input.selected}`)

  }
  // prettier-ignore-end

  events.input = { hrs: 0, mins: 0, secs: 0 }
}

function toggleComponentStatus(component) {
  const date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)

  events.componentStatus[component].reference = { date: '', time: '' }
  events.componentStatus[component].difference = { hours: 0, minutes: 0, seconds: 0 }
  events.componentStatus[component].indefiniteOn = !events.componentStatus[component].indefiniteOn
  events.componentStatus[component].active = !events.componentStatus[component].active

  const temp = {}
  temp['name'] = component
  temp['reference'] = {
    date: date.toISOString().split('T')[0],
    time: `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`,
    active: events.componentStatus[component].active
  }
  temp['indefiniteOn'] = events.componentStatus[component].indefiniteOn

  apiPOST(temp, `/Controllers/${props.id}/componentButtonList/${component}`)
}

function shutdownComponents() {
  const components = ['fanStatus', 'lightStatus', 'chargerStatus', 'outletStatus']

  const date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  const temp = {}
  temp['reference'] = {
    date: date.toISOString().split('T')[0],
    time: `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`,
    active: false
  }
  temp['indefiniteOn'] = false

  for (let i = 0; i < components.length; i++) {
    events.componentStatus[components[i]].reference = { date: '', time: '' }
    events.componentStatus[components[i]].difference = { hours: 0, minutes: 0, seconds: 0 }
    events.componentStatus[components[i]].indefiniteOn = false
    events.componentStatus[components[i]].active = false



    temp['name'] = components[i]

    apiPOST(temp, `/Controllers/${props.id}/componentButtonList/${components[i]}`)
  }
}

setInterval(() => {
  events.componentStatus.fanStatus.difference = getTimeDifference(
    events.componentStatus.fanStatus.reference.date,
    events.componentStatus.fanStatus.reference.time,
    { name: 'fanStatus', id: props.id }
  )
  events.componentStatus.lightStatus.difference = getTimeDifference(
    events.componentStatus.lightStatus.reference.date,
    events.componentStatus.lightStatus.reference.time,
    { name: 'lightStatus', id: props.id }
  )
  events.componentStatus.outletStatus.difference = getTimeDifference(
    events.componentStatus.outletStatus.reference.date,
    events.componentStatus.outletStatus.reference.time,
    { name: 'outletStatus', id: props.id }
  )
  events.componentStatus.chargerStatus.difference = getTimeDifference(
    events.componentStatus.chargerStatus.reference.date,
    events.componentStatus.chargerStatus.reference.time,
    { name: 'chargerStatus', id: props.id }
  )
}, 1000)
</script>
<style scoped>
.green {
  color: rgb(0, 189, 126);
}
p {
  margin: 0;
}
.rc-parent {
  min-width: 15rem;
  /* max-width: 38rem; */

  min-height: 23rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
  border-radius: 0.8rem;
  overflow: hidden;

  justify-content: center;
  align-items: center;

  transition: 0.2s all ease;
}
.rc-container {
  width: 15rem;
  height: 23rem;

  display: flex;
  flex-direction: column;

  justify-content: space-around;
  align-items: center;
  text-align: center;

  color: black;
  text-decoration: none;

  padding: 1rem;
  transition: 0.2s ease;
}

.rc-container:hover {
  background-color: #003185;
  color: white;
}
.rc-container:hover .rc-room-notification p {
  color: white;
}
.rc-room-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.rc-room-active {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: space-around;
  gap: 1rem;
  font-size: 2rem;
  padding: 1rem;
}

.rc-room-active p {
  font-size: 0.7rem;
  font-weight: 900;
}
.rc-set-container {
  min-width: 16rem;
  /* width: 20rem; */
  padding: 2rem;
}
.rc-set-form {
  height: 100%;
  display: flex;
  flex-direction: column;

  justify-content: space-between;
  gap: 1rem;
}
.rc-set-form,
.rc-set-form div {
  display: flex;
  flex-direction: column;

  font-size: 0.8rem;
}

.rc-set-label {
  font-size: 0.6rem;
  font-weight: 700;
}

#rc-set-components {
  padding: 0.2rem;
  font-size: 0.8rem;
}
.rc-set-label {
  margin: 0;
}

.rc-set-button {
  font-weight: 900;
  font-size: 0.7rem;
  text-transform: uppercase;
  border: 1px solid black;
  border-radius: 0.4rem;

  background: white;
  color: black;
  padding: 0.2rem;

  transition: 0.2s ease;
}

.rc-set-button:hover {
  border: 1px solid transparent;
  background-color: #003185;
  color: white;
}

.rc-shutdown {
  text-decoration: none;
  text-align: center;
}
.rc-shutdown:hover {
  border: 1px solid transparent;
  background-color: red;
  color: white;
}
.rc-set-manual {
  width: 12rem;
  display: flex;
  flex-direction: row !important;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
}

.rc-set-manual button {
  padding: 1rem;

  border-radius: 0.4rem;
  width: 5rem;
}

.rc-set-manual button i {
  font-size: 1.5rem;
}

.rc-room-notification {
  font-weight: 900;
}

.rc-room-connected {
  color: green;
}
.rc-room-disconnected {
  color: red;
}
</style>
