<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-background text-white p-8 rounded-xl shadow-inset-primary w-80 max-w-sm max-h-[80vh]">
      <div class="flex justify-center mb-4">
        <div
          class="bg-gray-920 border border-solid border-primary shadow-md shadow-yellow-500/50 p-3 rounded-full h-6 w-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="h-10 w-10 text-primary">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664" />
          </svg>
        </div>
      </div>
      <h1 class="text-3xl font-semibold text-center mb-0">Bem-vindo </h1>
      <p class="text-color_text text-center text-sm mb-6 mt-1">Acesse sua conta para continuar</p>
      <form @submit.prevent="handleLogin" class="w-full">
        <div class="mb-4">
          <label for="email" class=" text-primary block text-start text-md font-medium">Email</label>
          <input type="email" id="email" v-model="email" placeholder="exemplo@email.com" class="w-full pl-1 py-2.5 mt-2 text-white  rounded-lg bg-zinc-700 focus:ring-1 focus:ring-yellow-500 focus:outline-none box-border
          " />
        </div>
        <div class="mb-2">
          <label for="password" class="text-primary block text-start text-md font-medium">Senha</label>
          <div class="relative">
            <input :type="passwordVisible ? 'text' : 'password'" id="password" v-model="password" placeholder="••••••••"
              class="w-full pl-1 py-2.5 mt-2 mb-0 text-white rounded-lg bg-zinc-700 focus:ring-1 focus:ring-yellow-500 focus:outline-none box-border " />
            <button type="button" @click="togglePasswordVisibility"
              class="absolute right-3 top-4 text-color_text bg-transparent border-none focus:outline-none">
              <svg v-if="passwordVisible" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex justify-end items-center mb-7">
          <a href="#" class="text-sm  text-color_text hover:text-yellow-400">Esqueceu sua senha?</a>
        </div>
        <button type="submit"
          class="w-full py-2.5 px-4 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-400 transition duration-300 border-none shadow-md shadow-yellow-500/50">
          Entrar
        </button>
      </form>
      <div class="flex items-center my-3">
        <div class="flex-grow h-px bg-gray-700"></div>
        <span class="mx-2 text-color_text text-sm">ou</span>
        <div class="flex-grow h-px bg-gray-700"></div>
      </div>
      <button @click="googleLogin()"
        class="w-full py-2 px-4 border border-gray-700 rounded-lg flex items-center justify-center bg-gray-200 hover:bg-white transition duration-300 border-none shadow-md shadow-gray-500/50">
        Continuar com
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google"
          class="h-4 w-10 ml-2 pt-1">
      </button>
      <p class="text-center text-sm text-color_text mt-6">
        Não é membro? <router-link to="/login/sign-up" class="text-primary hover:text-yellow-400">Criar
          conta</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/utils/eventBus";
import { findUser, setLoggedUser } from "@/utils/localStorage";

export default {
  data() {
    return {
      email: '',
      password: '',
      passwordVisible: false,
      notification: {
        message: "",
        type: "",
        visible: false,
      },
    };
  },
  methods: {
    handleLogin() {
      if (!this.email || !this.password) {
        EventBus.$emit("show-notification", {
          message: "Por favor, preencha todos os campos!",
          type: "alert",
        });
        return;
      }

      const user = findUser(this.email, this.password);
      if (!user) {
        EventBus.$emit("show-notification", {
          message: "E-mail ou senha inválidos!",
          type: "error",
        });
        return;
      }
      setLoggedUser(user);
      if (user.type === "cliente") {
        window.location.href = "http://localhost:8081/cliente";
      } else if (user.type === "barbeiro") {
        window.location.href = "http://localhost:8081/barbeiro";
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    googleLogin() {
      this.email = 'jrviana@gmail.com', this.password = '123'
      EventBus.$emit("show-notification", {
        message: "Dados preenchidos com sua conta Google, clique em 'Entrar' para continuar!",
        type: "success",
      });
    }
  },
};
</script>

<style scoped></style>