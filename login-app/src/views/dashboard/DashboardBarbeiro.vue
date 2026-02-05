<template>
    <div class="flex items-center justify-center min-h-screen bg-background text-white">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">Dashboard do Barbeiro</h1>
            <p class="text-lg">Bem-vindo, você está na área do barbeiro!</p>
            <button @click="handleLogout"
                class="mt-6 py-2 px-4 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-400 transition duration-300">
                Logout
            </button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        handleLogout() {
            this.$router.push("/login");
        },
    },
};
</script>

<style scoped></style>