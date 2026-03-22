import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import HomePage from "./HomePage.vue";
import ScrambleHeroTitle from "./ScrambleHeroTitle";
import CustomCursor from "./CustomCursor.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout() {
    return h("div", [
      h(
        DefaultTheme.Layout,
        null,
        {
          "home-hero-before": () => h(HomePage)
        }
      ),
      h(ScrambleHeroTitle),
      h(CustomCursor)
    ]);
  }
};
