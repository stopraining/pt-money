import { createApp } from "vue";
import "./style.css";
import VCalendar from "v-calendar";
import "v-calendar/style.css";
import { createPinia } from "pinia";
import App from "./App.vue";

const pinia = createPinia();

createApp(App).use(pinia).use(VCalendar, {}).mount("#app");
