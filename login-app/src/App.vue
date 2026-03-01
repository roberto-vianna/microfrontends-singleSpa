<template>
  <div id="app" class="bg-black">
    <NotificationLogin v-if="notification.visible" :message="notification.message" :type="notification.type"
      @close="notification.visible = false" />
    <main>
      <router-view />
    </main>
  </div>
</template>
<script>
import NotificationLogin from "@/components/NotificationLogin.vue";
import { EventBus } from "@/utils/eventBus";

export default {
  components: {
    NotificationLogin,
  },
  data() {
    return {
      notification: {
        message: "",
        type: "",
        visible: false,
      },
    };
  },
  created() {
    EventBus.$on("show-notification", this.showNotification);
  },
  methods: {
    showNotification(payload) {
      this.notification = { ...payload, visible: true };
      setTimeout(() => {
        this.notification.visible = false;
      }, payload.duration || 3000);
    },
  },
};
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>