import Vue from "vue";
import singleSpaVue from "single-spa-vue";
import './assets/tailwind.css';
import App from "./App.vue";
import router from "./router";
import store from "./store";


Vue.config.productionTip = false;

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    render: (h: any) => h(App),
    el: "#login",
    router,
    store,
  } as any,
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
