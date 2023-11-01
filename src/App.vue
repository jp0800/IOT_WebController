<script setup>
import Splash from '@/components/Splash.vue'
import Details from './components/Details.vue'
</script>

<template>
  <header>
    <i class="bi bi-bezier2 logo green"></i>

    <div class="wrapper">
      <Details msg="IoT Web Controller"/>
    </div>
  </header>

  <main>
    <Splash/>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  text-align: center;
  margin: 0 auto 2rem;
  font-size: 8rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
