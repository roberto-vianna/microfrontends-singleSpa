<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-background text-white p-8 rounded-xl shadow-inset-primary w-80 max-w-sm max-h-[82vh]">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-semibold mb-1 mt-0">Crie sua conta</h1>
        <p class="text-color_text text-sm mt-1">Junte-se ao clube exclusivo. Agende ou gerencie.</p>
      </div>

      <div class="flex justify-between mb-6 p-1 bg-zinc-950 rounded-lg">
        <button @click="selectButton('cliente')" :class="[
          'flex items-center justify-center w-[48%] py-2 px-4 font-semibold rounded-lg transition duration-300 border-none',
          selectedButton === 'cliente' ? 'bg-primary text-black' : 'bg-transparent text-white hover:bg-gray-700'
        ]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
            :class="['size-5 mr-2', selectedButton === 'cliente' ? 'text-black' : 'text-primary']">
            <path
              d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>

          Cliente
        </button>
        <button @click="selectButton('barbeiro')" :class="[
          'flex items-center justify-center w-[48%] py-2 px-4 font-semibold rounded-lg transition duration-300 border-none',
          selectedButton === 'barbeiro' ? 'bg-primary text-black' : 'bg-transparent text-white hover:bg-gray-700'
        ]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor"
            :class="['size-5 mr-2', selectedButton === 'barbeiro' ? 'text-black' : 'text-primary']">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664" />
          </svg>
          Barbeiro
        </button>
      </div>
      <form @submit.prevent="handleSignUp" class="w-full">
        <div class="mb-4">
          <label for="fullName" class="text-primary block text-md font-medium">Nome Completo</label>
          <input type="text" id="fullName" v-model="fullName" placeholder="Ex: João da Silva"
            class="w-full pl-1 py-2.5 mt-2 text-white border rounded-lg bg-zinc-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none box-border" />
        </div>
        <div class="mb-4">
          <label for="email" class="text-primary block text-md font-medium">E-mail</label>
          <input type="email" id="email" v-model="email" placeholder="seu@email.com"
            class="w-full pl-1 py-2.5 mt-2 text-white border rounded-lg bg-zinc-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none box-border" />
        </div>

        <div class="mb-8">
          <label for="password" class="text-primary block text-md font-medium">Senha</label>
          <div class="relative">
            <input :type="passwordVisible ? 'text' : 'password'" id="password" v-model="password" placeholder="••••••••"
              class="w-full pl-1 py-2.5 mt-2 text-white border rounded-lg bg-zinc-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none box-border" />
            <button type="button" @click="togglePasswordVisibility"
              class="absolute right-3 top-4 text-color_text bg-transparent border-none focus:outline-none">
              <svg v-if="passwordVisible" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
        </div>

        <button type="submit"
          class="w-full py-2.5 px-4 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-400 transition duration-300 border-none shadow-sm shadow-yellow-500/50">
          Finalizar Cadastro →
        </button>
      </form>

      <p class="text-center text-sm text-color_text mt-6">
        Já possui cadastro?
        <router-link to="/login" class="text-primary hover:text-yellow-400">Fazer Login</router-link>
      </p>

      <p class="text-center text-xs text-gray-500 mt-4">
        Ao clicar em cadastrar, você concorda com nossos
        <a href="#" class="text-white hover:text-yellow-400">Termos de Serviço</a> e
        <a href="#" class="text-white hover:text-yellow-400">Política de Privacidade</a>.
      </p>
    </div>
  </div>
</template>

<script>
import { addUser, isEmailTaken } from "@/utils/localStorage";
import { EventBus } from "@/utils/eventBus";

export default {
  data() {
    return {
      selectedButton: 'cliente',
      fullName: '',
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
    handleSignUp() {
      if (!this.fullName || !this.email || !this.password) {
        EventBus.$emit("show-notification", {
          message: "Por favor, preencha todos os campos!",
          type: "alert",
        });
        return;
      }
      if (isEmailTaken(this.email)) {
        EventBus.$emit("show-notification", {
          message: "Este e-mail já está cadastrado.",
          type: "error",
        });
        return;
      }
      const newUser = {
        fullName: this.fullName,
        email: this.email,
        password: this.password,
        type: this.selectedButton,
      };
      addUser(newUser);
      EventBus.$emit("show-notification", {
        message: "Cadastro realizado com sucesso!",
        type: "success",
      });

      this.$router.push("/login");
    },
    showNotification(message, type) {
      this.notification = { message, type, visible: true };
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    selectButton(button) {
      this.selectedButton = button;
    },
  },
};
</script>

<style scoped></style>