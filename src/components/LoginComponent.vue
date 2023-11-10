<template>
  <div class="lc-parent">
    <form
      class="lc-form"
      @submit.prevent="
        accountLogin(pageData.loginCredentials.email, pageData.loginCredentials.password)
      "
    >
      <label class="lc-label" for="lc-username">Email Address</label>
      <input
        class="lc-input"
        v-model="pageData.loginCredentials.email"
        id="lc-username"
        type="email"
        autocomplete="off"
        required
      />
      <label class="lc-label" for="lc-password">Password</label>
      <input
        class="lc-input"
        v-model="pageData.loginCredentials.password"
        id="lc-password"
        type="password"
        autocomplete="off"
        required
      />

      <button
        class="lc-button"
        :class="!pageData.inputStates.invalidCredentials ? 'lc-green' : 'lc-red'"
      >
        LOGIN
      </button>
    </form>
  </div>
</template>

<script setup>
import { auth, signInWithEmailAndPassword } from '../assets/firebase'
import { reactive } from 'vue'

const emitter = defineEmits(['lcUserSignedIn', 'update'])

const pageData = reactive({
  loginCredentials: {
    email: '',
    password: '',
    isUserSignedIn: false
  },
  inputStates: {
    invalidCredentials: false
  }
})

function accountLogin(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user

      pageData.loginCredentials.isUserSignedIn = user ? true : false
      pageData.loginCredentials.email = ''
      pageData.loginCredentials.password = ''

      emitter('lcUserSignedIn', true);
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message

      pageData.inputStates.invalidCredentials = true
      alert(`${errorCode} : \n${errorMessage}`)
    })
}
</script>

<style scoped>
.lc-parent {
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
}
.lc-form {
  max-width: 18rem;
  width: 18rem;

  box-shadow: 0px 0px 5px 2px #00bd7e;
  border-radius: 0.8rem;

  display: flex;
  flex-direction: column;

  padding: 2rem;
  margin: 2rem 0;
}
.lc-label {
  font-size: 0.8rem;
  font-weight: bold;

  text-transform: lowercase;
}
.lc-input {
  font-size: 0.8rem;

  margin-bottom: 1rem;
  padding: 0.3rem;

  border-radius: 0.4rem;
}

.lc-green {
  border: 3px solid #00bd7e;
  color: #00bd7e;
}
.lc-red {
  border: 3px solid #ff5858;
  color: #ff5858;
}

.lc-button {
  border-radius: 0.4rem;

  padding: 0.2rem;
  margin-top: 1.5rem;

  font-weight: bold;
  font-size: 0.8rem;
  text-transform: uppercase;

  background: transparent;
  transition: 0.4s ease;
}

.lc-green:hover {
  box-shadow: 0px 0px 5px 1px #00bd7e;
}
.lc-red:hover {
  box-shadow: 0px 0px 5px 1px #ff5858;
}
</style>
