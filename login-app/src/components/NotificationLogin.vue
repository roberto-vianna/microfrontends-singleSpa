<template>
    <div v-if="visible"
        :class="['fixed top-4 right-4 max-w-xs outline-2 px-4 rounded-lg transition-transform duration-300', notificationClass]"
        @click="closeNotification">
        <div class="flex items-center">
            <div :class="iconClass" class=" mr-3 flex items-center justify-center rounded-full bg-opacity-25">

                <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="currentColor" class="size-6">
                    <path fill-rule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clip-rule="evenodd" />
                </svg>

                <svg v-else-if="type === 'alert'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="currentColor" class="size-6">
                    <path fill-rule="evenodd"
                        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                        clip-rule="evenodd" />
                </svg>

                <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="currentColor" class="size-6">
                    <path fill-rule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                        clip-rule="evenodd" />
                </svg>

            </div>
            <p class="text-md font-medium">{{ message }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            default: 3000,
        },
    },
    data() {
        return {
            visible: true,
        };
    },
    computed: {
        notificationClass() {
            switch (this.type) {
                case 'success':
                    return 'bg-green-500 text-white';
                case 'alert':
                    return 'bg-yellow-500 text-white';
                case 'error':
                    return 'bg-red-500 text-white';
                default:
                    return 'bg-gray-500 text-white';
            }
        },
        iconClass() {
            switch (this.type) {
                case 'success':
                    return 'bg-transparent text-white';
                case 'alert':
                    return 'bg-transparent text-white';
                case 'error':
                    return 'bg-transparent text-white';
                default:
                    return 'bg-gray-700 text-white';
            }
        },
    },
    mounted() {
        setTimeout(() => {
            this.closeNotification();
        }, this.duration);
    },
    methods: {
        closeNotification() {
            this.visible = false;
            this.$emit('close');
        },
    },
};
</script>
