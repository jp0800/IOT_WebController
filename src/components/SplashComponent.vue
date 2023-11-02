<script setup>
import { cursor, updateESPComponentState, writeDefaultControllerState } from '../assets/firebase'
import { getDatabase, onValue, set, update } from 'firebase/database'

import SplashItem from '@/components/SplashItem.vue'

import CommunityIcon from './icons/IconCommunity.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import SupportIcon from './icons/IconSupport.vue'

import { componentButtonList, componentButtonState, isESP32Connected } from '@/assets/templates.js'
import { reactive, ref } from 'vue'

// const espID = 1
const ESPData = ref({})
onValue(cursor, (snapshot) => {
  // const data = snapshot

  /* FOR DEBUGGING */
  // console.log('SC: Snapshot Data:')
  // console.log(data.val())

  // console.log('SC: Child Snapshot Data:')
  /* END */

  snapshot.forEach((childSnapshot) => {
    if (!childSnapshot.exists()) {
      alert('SC: ChildSnapshot <- No Data Retrieved')
      return
    }

    //Iterator
    const data = childSnapshot.val()

    ESPData.value[childSnapshot.key] = {
      id: childSnapshot.key,
      ...data
    }
    // console.log("ESP DATA:")
    // console.log(ESPData.value)
    // console.log(Object.keys(ESPData.value).length)

    /* FOR DEBUGGING */
    // console.log(childSnapshot.key, ':', data)
    // console.log()
    /* END */
  })
  // console.log("SOME",Object.keys(ESPData.value).length)
})

writeDefaultControllerState(Object.keys(ESPData.value).length)

const r = reactive({
  isESPConnected: isESP32Connected,
  data: ESPData.value
})

function toggleButton(id, modelName) {
  updateESPComponentState(id, modelName, !ESPData.value[id].componentButtonState[modelName])
  // console.log(ESPData.value[id].componentButtonState[modelName])
}
</script>

<template>
  <SplashItem>
    <template #icon>
      <i class="bi bi-book"></i>
    </template>
    <template #heading> Abstract </template>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam quasi tenetur esse optio amet
    eveniet nostrum molestiae animi asperiores et mollitia sed doloremque, incidunt aliquam
    consectetur? Quia alias iusto impedit!
  </SplashItem>

  <SplashItem>
    <template #icon>
      <i class="bi bi-sliders"></i>
    </template>
    <template #heading>
      Tooling • ESP8266:
      <span class="con-status" :class="r.isESPConnected ? 'green' : ''">
        <b>
          {{ r.isESPConnected ? 'Connected' : 'Disconnected' }}
        </b>
      </span>
    </template>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, debitis praesentium ullam
      aspernatur ducimus fugiat qui? Natus eius fugiat aliquid consequatur iste. Voluptatibus
      nostrum magni illo incidunt maxime minus exercitationem!
    </p>
    <span class="button-parent" v-for="comp in r.data" :key="comp.id">
      <h3>{{ comp.id }}</h3>
      <p v-for="item in comp.componentButtonList" :key="item.id" class="d-inline-flex gap-1">
        <button
          type="button"
          class="btn"
          data-bs-toggle="button"
          :class="comp.componentButtonState[item.model] ? 'green' : ''"
          @click="toggleButton(comp.id, item.model)"
        >
          <i class="bi" :class="item.icon"></i>
          <b>{{ item.name }}</b>
        </button>
      </p>
    </span>
    <!-- <p v-for="item in componentButtonList" :key="item.id" class="d-inline-flex gap-1">
      <button
        type="button"
        class="btn"
        data-bs-toggle="button"
        :class="r.componentStates[item.model] ? 'green' : ''"
        @click="toggleButton(item.model)"
      >
        <i class="bi" :class="item.icon"></i>
        <b>{{ item.name }}</b>
      </button>
    </p> -->
  </SplashItem>

  <SplashItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Ecosystem</template>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem quo blanditiis nobis enim ex
    sint recusandae maxime beatae eum eaque. Necessitatibus vel assumenda architecto exercitationem
    aspernatur optio aliquam facilis ab!
  </SplashItem>

  <SplashItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor, labore illo culpa tempore
    reprehenderit laboriosam nemo corporis, debitis odit fuga, at quasi perspiciatis omnis!
    Molestiae sequi harum eveniet cupiditate voluptatibus!
  </SplashItem>

  <SplashItem>
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
button > .bi {
  font-size: 5rem;
}
.btn {
  display: flex;
  flex-direction: column;

  place-items: center;
  margin: 0.5rem;
}
.con-status {
  float: right;
}
.button-parent {
  width: 100%;
}
</style>
