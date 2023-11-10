<script setup>
import SplashComponent from '@/components/SplashComponent.vue'
import DetailsComponent from '@/components/DetailsComponent.vue'
import LoginComponent from './components/LoginComponent.vue'
import { reactive } from 'vue'

const pageData = reactive({
  userIsLoggedIn: false
})

function getEmmited(isLoggedIn) {
  pageData.userIsLoggedIn = isLoggedIn
  alert('SOME')
}
</script>

<template>
  <header>
    <i class="bi bi-bezier2 logo green"></i>
    <div class="wrapper">
      <DetailsComponent msg="IoT Web Controller" />
    </div>
  </header>

  <main>
    <SplashComponent v-if="pageData.userIsLoggedIn" />
    <LoginComponent v-else @lc-user-signed-in="getEmmited" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  text-align: center;
  font-size: 4rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 1.5rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
