<template>
  <div class="ha-parent">
    <div class="ha-container">
      <div class="ha-header">
        <i class="bi bi-diagram-3"></i>
        <h1>INTELLIGENT ANDROID-BASED CLASSROOM POWER CONSUMPTION USING IOT</h1>
        <p>Automation in one app</p>
      </div>
      <form class="ha-form" @submit.prevent="loginUser(userCredentials)">
        <label for="ha-username">Email Address</label>
        <input
          id="ha-username"
          v-model="userCredentials.emailAddress"
          type="email"
          autocomplete="false"
          required
        />
        <label for="ha-password">Password</label>
        <input
          id="ha-password"
          v-model="userCredentials.password"
          :type="userCredentials.showPassword ? 'text' : 'password'"
          autocomplete="false"
          required
        />
        <span class="ha-password-show">
          <input type="checkbox" id="ha-password-show" v-model="userCredentials.showPassword" />
          <label for="ha-password-show"> Show password </label>
        </span>
        <button>Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { isInputValueEmpty } from './res/utility'
import { reactive } from 'vue'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './res/firebase'
const router = useRouter()

const userCredentials = reactive({
  emailAddress: '',
  password: '',
  showPassword: false
})

/**
 *
 * @param {Object} userCredentials the object consists of {username, password}
 */
function loginUser(userCredentials) {
  localStorage.setItem('isLoggedIn', 'false')
  localStorage.setItem('emailAddress', '')
  const isUsernameNotEmpty = !isInputValueEmpty(userCredentials.emailAddress)
  const isPasswordNotEmpty = !isInputValueEmpty(userCredentials.password)

  if (isUsernameNotEmpty && isPasswordNotEmpty) {
    signInWithEmailAndPassword(auth, userCredentials.emailAddress, userCredentials.password)
      .then((data) => {
        const user = data.user

        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('emailAddress', user.email)

        router.push('/Home')
      })
      .catch(() => {
        alert(`Error: User is not Registered`)
      })
  }
}
</script>

<style scoped>
.ha-parent {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: row;

  justify-content: center;
  align-items: center;

  color: white;
  padding: 2rem;
}

.ha-container {
  max-width: 20rem;
  display: flex;
  flex-direction: column;

  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  padding: 2rem;
  border-radius: 0.8rem;
  background: #003185;
  box-shadow: 0 0 5px 1px black;
}
.ha-header {
  text-align: center;
}

.ha-header h1 {
  font-size: 1.2rem;
  margin: 0;
  word-wrap: break-word;
}
.ha-header p {
  font-size: 0.7rem;
  font-weight: 100;
}
.bi {
  font-size: 4rem;
}
.ha-form {
  width: 15rem;

  font-size: 1rem;
  display: flex;
  flex-direction: column;
}

.ha-form label {
  margin: 0;
  font-size: 0.8rem;

  font-weight: 700;
  text-transform: lowercase;
}
.ha-form input {
  margin-bottom: 1rem;
  border: none;
  border-radius: 0.4rem;

  padding: 0.2rem 0.5rem;
  font-weight: 700;
}

.ha-form button {
  margin-top: 1.5rem;
  border-radius: 0.4rem;

  font-size: 0.8rem;
  font-weight: 900;

  padding: 0.4rem;
  text-transform: uppercase;

  background: white;

  outline: none;
  border: none;

  transition: 0.2s ease;
}

.ha-form button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.ha-password-show {
  display: flex;
  gap: 0.5rem;

  align-items: center;
}
.ha-password-show input {
  margin: 0;
}

.ha-password-show label {
  text-transform: capitalize !important;
}
</style>
