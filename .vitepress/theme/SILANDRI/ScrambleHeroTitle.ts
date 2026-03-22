import { inBrowser, useRoute } from "vitepress";
import { defineComponent, nextTick, onBeforeUnmount, onMounted, watch } from "vue";

const SCRAMBLE_CHARS = "{}?+{^*<>[]!~";
const TARGETS = [
  ".VPHomeHero .name",
  ".VPTeamPageTitle .title",
  ".SilandriHome .sil-scramble"
] as const;

export default defineComponent({
  name: "ScrambleHeroTitle",
  setup() {
    const route = useRoute();
    let observers: IntersectionObserver[] = [];
    const timerMap = new Map<HTMLElement, { startTimeout: number | null; intervalId: number | null }>();

    const scrambleText = (text: string) =>
      text
        .split("")
        .map((letter) => {
          if (letter === " ") return " ";
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");

    const clearTimers = (element?: HTMLElement) => {
      if (element) {
        const timers = timerMap.get(element);
        if (!timers) return;

        if (timers.startTimeout !== null) {
          window.clearTimeout(timers.startTimeout);
        }

        if (timers.intervalId !== null) {
          window.clearInterval(timers.intervalId);
        }

        timerMap.delete(element);
        return;
      }

      timerMap.forEach((_, key) => clearTimers(key));
    };

    const cleanup = () => {
      clearTimers();
      observers.forEach((observer) => observer.disconnect());
      observers = [];
    };

    const runScramble = (element: HTMLElement) => {
      const original = (element.getAttribute("data-scramble-original") ?? element.textContent ?? "").trim();
      if (!original) return;

      element.setAttribute("data-scramble-original", original);
      clearTimers(element);
      timerMap.set(element, { startTimeout: null, intervalId: null });

      let iteration = 0;
      const timers = timerMap.get(element);
      if (!timers) return;

      timers.startTimeout = window.setTimeout(() => {
        timers.intervalId = window.setInterval(() => {
          const nextText = original
            .split("")
            .map((letter, index) => {
              if (index < iteration) return original[index];
              if (letter === " ") return " ";
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            })
            .join("");

          element.textContent = nextText;

          if (iteration >= original.length) {
            clearTimers(element);
            element.textContent = original;
          }

          iteration += 1 / 3;
        }, 40);
      }, 80);
    };

    const setupObserver = () => {
      if (!inBrowser) return;

      cleanup();
      TARGETS.forEach((selector) => {
        const elements = document.querySelectorAll<HTMLElement>(selector);

        elements.forEach((titleEl) => {
          const original = (titleEl.getAttribute("data-scramble-original") ?? titleEl.textContent ?? "").trim();
          if (!original) return;

          titleEl.setAttribute("data-scramble-original", original);
          const playedOnPath = titleEl.getAttribute("data-scramble-played-path");
          if (playedOnPath === route.path) {
            titleEl.textContent = original;
            return;
          }

          titleEl.textContent = scrambleText(original);

          const observer = new IntersectionObserver(
            (entries) => {
              const [entry] = entries;
              if (!entry?.isIntersecting) return;
              titleEl.setAttribute("data-scramble-played-path", route.path);
              runScramble(titleEl);
              observer.disconnect();
            },
            { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
          );

          observer.observe(titleEl);
          observers.push(observer);
        });
      });
    };

    onMounted(() => {
      void nextTick(setupObserver);
    });

    watch(
      () => route.path,
      () => {
        void nextTick(setupObserver);
      }
    );

    onBeforeUnmount(() => {
      cleanup();
    });

    return () => null;
  }
});
