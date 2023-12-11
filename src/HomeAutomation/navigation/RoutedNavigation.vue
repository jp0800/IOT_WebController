<template>
  <div class="rn-parent">
    <div class="rn-logo-container">
      <div class="rn-logo">
        <h1>INTELLIGENT ANDROID-BASED CLASSROOM POWER CONSUMPTION USING IOT</h1>
        <p>automation in one app</p>
      </div>
      <div class="rn-user-container">
        <a href="" class="rn-user">
          <img src="../../assets/logo.svg" />
          <p>{{ events.emailAddress }}</p>
        </a>
        <a href="" class="rn-user-logout" @click.prevent="logout"
          ><i class="bi bi-box-arrow-right"></i
        ></a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const events = reactive({
  emailAddress: localStorage.getItem('emailAddress').split('@')[0]
})

const router = useRouter()

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.setItem('isLoggedIn', 'false')
    router.push('/')
  }
}
</script>

<style scoped>
.rn-parent {
  padding: 1rem;

  background: #003185;
  color: white;

  margin-bottom: 2rem;
}
.rn-logo-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
}

.rn-logo h1 {
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0;
}
.rn-logo p {
  font-size: 0.8rem;
  font-weight: 100;

  margin: 0;
}
.rn-user-container {
  min-width: 17rem;

  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}
.rn-user {
  width: 100%;
  height: 100%;
  min-height: 3rem;
  display: flex;
  flex-direction: row;

  text-decoration: none;

  align-items: center;
  gap: 1rem;

  transition: 0.2s ease;
  padding: 0.5rem;
}

.rn-user:hover {
  border-radius: 0.8rem;
  background: #003da7;
}
.rn-user img {
  height: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid white;
}
.rn-user p {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 900;
  color: white;
}

.rn-user-logout {
  text-decoration: none;
  background: #003da7;

  font-size: 1.2rem;
  border-radius: 0.4rem;
  color: white;

  transition: 0.2s ease;
}

.rn-user-logout:hover {
  background: white;
  color: black;
}

.rn-user-logout .bi-box-arrow-right {
  display: block;
  padding: 0.5rem;
}
</style>
