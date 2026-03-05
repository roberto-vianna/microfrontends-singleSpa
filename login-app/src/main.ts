import Vue, { CreateElement } from "vue";
import singleSpaVue from "single-spa-vue";
import './assets/tailwind.css';
import App from "./App.vue";
import router from "./router";
import store from "./store";


Vue.config.productionTip = false;

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    render: (h: CreateElement) => h(App),
    el: "#login",
    router,
    store,
  }
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
