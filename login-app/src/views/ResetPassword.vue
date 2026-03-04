<template>
    <div class="flex items-center justify-center min-h-screen">
        <div class="bg-background text-white p-8 rounded-xl shadow-inset-primary w-80 max-w-sm">
            <h1 class="text-3xl font-semibold text-center mb-4">Redefinir Senha</h1>
            <form @submit.prevent="resetPassword">
                <div class="mb-4">
                    <label for="reset-code" class="text-primary block text-start text-md font-medium">Código</label>
                    <input type="text" id="reset-code" v-model="resetCode" placeholder="Digite o código enviado"
                        class="w-full pl-1 py-2.5 mt-2 text-white rounded-lg bg-zinc-700 focus:ring-1 focus:ring-yellow-500 focus:outline-none box-border" />
                </div>
                <div class="mb-4">
                    <label for="new-password" class="text-primary block text-start text-md font-medium">Nova
                        Senha</label>
                    <input type="password" id="new-password" v-model="newPassword" placeholder="Digite sua nova senha"
                        class="w-full pl-1 py-2.5 mt-2 text-white rounded-lg bg-zinc-700 focus:ring-1 focus:ring-yellow-500 focus:outline-none box-border" />
                </div>
                <button type="submit"
                    class="w-full py-2.5 px-4 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-400 transition duration-300 border-none shadow-md shadow-yellow-500/50">
                    Redefinir Senha
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
            resetCode: "",
            newPassword: "",
        };
    },
    methods: {
        resetPassword() {
            const resetData = JSON.parse(localStorage.getItem("passwordReset") || "{}");
            if (resetData.resetCode !== Number(this.resetCode)) {
                EventBus.$emit("show-notification", {
                    message: "Código inválido!",
                    type: "error",
                });
                return;
            }

            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const userIndex = users.findIndex((u) => u.email === resetData.email);

            if (userIndex === -1) {
                EventBus.$emit("show-notification", {
                    message: "Usuário não encontrado.",
                    type: "error",
                });
                return;
            }

            users[userIndex].password = this.newPassword;
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.removeItem("passwordReset");

            EventBus.$emit("show-notification", {
                message: "Senha redefinida com sucesso!",
                type: "success",
            });

            this.$router.push("/login");
        },
    },
};
</script>