import { createApp, App } from "vue";
import appVue from "../app/App.vue";
import { setPanelStatus } from "@/core/store";
import "@/assets/styles/app.scss";
import { addRuntimeMsgListener, initMessageBus } from "@/core/utils/messageBus";

let app: null | App = null;

export const toggle = (visible: boolean) => {
  if (!visible) {
    app && app.unmount();
    app = null;
    document.body.style.overflowY = "scroll";
  } else {
    const parent = document.querySelector("#__crx-app");
    if (!parent) {
      const juejinContent = document.querySelector("#__nuxt");
      juejinContent?.insertAdjacentHTML(
        "beforebegin",
        '<div id="__crx-app" class="__crx-app"></div>',
      );
    }
    app = createApp(appVue);
    app.mount("#__crx-app");
    document.body.style.overflowY = "hidden";
  }
  setPanelStatus(visible);
};

const toggleListener = (request: any) => {
  if (request.action === "toggle") {
    toggle(request.body);
  }
};

addRuntimeMsgListener("toggle", toggleListener);

initMessageBus();
