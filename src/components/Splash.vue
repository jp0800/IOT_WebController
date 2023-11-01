<script setup>
import SplashItem from '@/components/SplashItem.vue'

import CommunityIcon from './icons/IconCommunity.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import SupportIcon from './icons/IconSupport.vue'

import { componentButtonList, componentButtonState, isESP32Connected } from '@/assets/templates.js'
import { reactive } from 'vue'

const r = reactive({
  componentStates: { ...componentButtonState },
  isESPConnected: isESP32Connected
})

function toggleButton(modelName) {
  r.componentStates[modelName] = !r.componentStates[modelName]
  console.log(r.componentStates)
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
    <p v-for="item in componentButtonList" :key="item.id" class="d-inline-flex gap-1">
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
    </p>
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
</style>
