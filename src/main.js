import { createApp } from "vue";
import "./assets/main.css";
import App from "./App.vue";
import { routes } from "./routes.js";
import { createRouter, createWebHistory } from "vue-router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFolder, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faFolder, faFile);

let app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

let router = createRouter({
  history: createWebHistory(),
  routes: import.meta.hot ? [] : routes,
});

if (import.meta.hot) {
  let removeRoutes = [];
  for (let route of routes) {
    removeRoutes.push(router.addRoute(route));
  }

  import.meta.hot.accept("./routes.js", ({ routes }) => {
    for (let removeRoute of removeRoutes) removeRoute();
    removeRoutes = [];
    for (let route of routes) {
      removeRoutes.push(router.addRoute(route));
    }
    router.replace("");
  });
}

app.use(router);

app.mount("#app");
