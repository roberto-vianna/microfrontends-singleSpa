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
            <h1 class="text-3xl font-semibold text-center mb-0">Recuperar Senha</h1>
            <p class="text-color_text text-center text-sm mb-6 mt-1">
                Digite seu email cadastrado para redefinir sua senha.
            </p>
            <form @submit.prevent="handleForgotPassword" class="w-full">
                <div class="mb-4">
                    <label for="forgot-email" class="text-primary block text-start text-md font-medium">Email</label>
                    <input type="email" id="forgot-email" v-model="forgotEmail" placeholder="exemplo@email.com"
                        class="w-full pl-1 py-2.5 mt-2 text-white rounded-lg bg-zinc-700 focus:ring-1 focus:ring-yellow-500 focus:outline-none box-border" />
                </div>
                <button type="submit"
                    class="w-full py-2.5 px-4 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-400 transition duration-300 border-none shadow-md shadow-yellow-500/50">
                    Enviar
                </button>
            </form>
            <p class="text-center text-sm text-color_text mt-6">
                <router-link to="/login" class="text-primary hover:text-yellow-400">
                    Voltar para o login
                </router-link>
            </p>
        </div>
    </div>
</template>

<script>
import { EventBus } from "@/utils/eventBus";

export default {
    data() {
        return {
            forgotEmail: "",
        };
    },
    methods: {
        handleForgotPassword() {
            if (!this.forgotEmail) {
                EventBus.$emit("show-notification", {
                    message: "Por favor, insira o email!",
                    type: "alert",
                });
                return;
            }

            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const user = users.find((u) => u.email === this.forgotEmail);

            if (!user) {
                EventBus.$emit("show-notification", {
                    message: "O email informado não foi encontrado!",
                    type: "error",
                });
                return;
            }

            const resetCode = Math.floor(100000 + Math.random() * 900000);
            localStorage.setItem("passwordReset", JSON.stringify({ email: user.email, resetCode }));

            // eslint-disable-next-line no-console
            console.log(`Código de redefinição enviado para ${user.email}: ${resetCode}`);

            EventBus.$emit("show-notification", {
                message: "Um email foi enviado com instruções para redefinir sua senha.",
                type: "success",
            });

            this.$router.push("/login/reset-password");
        },
    },
};
</script>

<style scoped></style>