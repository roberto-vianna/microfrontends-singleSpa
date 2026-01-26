import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { registerApplication, start } from "single-spa";

Vue.config.productionTip = false;

 registerApplication({
  name: "header",
  app: () => System.import("header"),
  activeWhen: (location) => location.pathname == "/",
});

registerApplication({
  name: "menu",
  app: () => System.import("menu"),
  activeWhen: (location) => location.pathname == "/",
});

registerApplication({
  name: "footer",
  app: () => System.import("footer"),
  activeWhen: (location) => location.pathname == "/",
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

start();
