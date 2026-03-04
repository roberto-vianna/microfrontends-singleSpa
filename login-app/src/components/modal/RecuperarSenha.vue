<template>
    <div class="flex items-center justify-center min-h-screen">
        <div class="bg-background text-white p-8 rounded-xl shadow-inset-primary w-80 max-w-md">
            <h2 class="text-xl font-bold text-primary mb-4">Redefinir Senha</h2>
            <form @submit.prevent="handlePasswordReset">
                <div class="mb-4">
                    <label for="reset-code" class="text-sm text-primary mb-2 block">Código de Redefinição</label>
                    <input id="reset-code" v-model="resetCode" type="text" placeholder="Digite o código recebido"
                        class="w-full p-2 rounded-lg bg-zinc-700 text-white focus:ring-1 focus:ring-yellow-500 outline-none" />
                </div>
                <div class="mb-4">
                    <label for="new-password" class="text-sm text-primary mb-2 block">Nova Senha</label>
                    <input id="new-password" v-model="newPassword" type="password" placeholder="Digite sua nova senha"
                        class="w-full p-2 rounded-lg bg-zinc-700 text-white focus:ring-1 focus:ring-yellow-500 outline-none" />
                </div>
                <button type="submit"
                    class="w-full py-2 bg-primary text-black rounded-lg hover:bg-yellow-400 transition duration-300">
                    Redefinir Senha
                </button>
            </form>
        </div>
    </div>
</template>
