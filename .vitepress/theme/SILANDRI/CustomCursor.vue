<script setup lang="ts">
import { inBrowser } from "vitepress";
import { onBeforeUnmount, onMounted, ref } from "vue";

const cursorRef = ref<HTMLElement | null>(null);
const isCoarsePointer = ref(true);
const hovered = ref(false);

const mousePos = { x: -100, y: -100 };
const currentPos = { x: -100, y: -100 };
const scaleState = { current: 1, target: 1 };

let rafId = 0;

const isInteractiveTarget = (target: EventTarget | null) => {
  const element = target instanceof HTMLElement ? target : null;
  if (!element) return false;

  return Boolean(
    element.closest(
      [
        "a",
        "button",
        "summary",
        "label",
        "input",
        "textarea",
        "select",
        "[role='button']",
        "[data-cursor='hover']",
        ".clickable",
        ".VPButton",
        ".VPLink"
      ].join(",")
    )
  );
};

const animate = () => {
  const ease = 0.2;
  const scaleEase = 0.22;
  currentPos.x += (mousePos.x - currentPos.x) * ease;
  currentPos.y += (mousePos.y - currentPos.y) * ease;
  scaleState.current += (scaleState.target - scaleState.current) * scaleEase;

  if (cursorRef.value) {
    cursorRef.value.style.transform = `translate3d(${currentPos.x}px, ${currentPos.y}px, 0) translate(-50%, -50%) scale(${scaleState.current})`;
  }

  rafId = window.requestAnimationFrame(animate);
};

const onPointerMove = (event: PointerEvent) => {
  mousePos.x = event.clientX;
  mousePos.y = event.clientY;
  hovered.value = isInteractiveTarget(event.target);
};

const onPointerDown = () => {
  scaleState.target = 0.8;
};

const onPointerUp = () => {
  scaleState.target = 1;
};

onMounted(() => {
  if (!inBrowser) return;

  isCoarsePointer.value = window.matchMedia("(pointer: coarse)").matches;
  if (isCoarsePointer.value) return;

  document.documentElement.classList.add("sil-cursor-active");

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerUp, { passive: true });
  window.addEventListener("blur", onPointerUp);

  animate();
});

onBeforeUnmount(() => {
  if (!inBrowser || isCoarsePointer.value) return;

  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerdown", onPointerDown);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("pointercancel", onPointerUp);
  window.removeEventListener("blur", onPointerUp);

  if (rafId) {
    window.cancelAnimationFrame(rafId);
  }

  document.documentElement.classList.remove("sil-cursor-active");
});
</script>

<template>
  <div
    v-if="!isCoarsePointer"
    ref="cursorRef"
    class="SilCursor"
    :class="{ 'is-hovered': hovered }"
    aria-hidden="true"
  >
    <div class="SilCursor-box">
      <span class="SilCursor-edge is-top" />
      <span class="SilCursor-edge is-right" />
      <span class="SilCursor-edge is-bottom" />
      <span class="SilCursor-edge is-left" />
      <span class="SilCursor-cross is-h" />
      <span class="SilCursor-cross is-v" />
    </div>
  </div>
</template>

<style scoped>
.SilCursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  mix-blend-mode: difference;
  color: #ff5f00;
  transform: translate3d(-100px, -100px, 0);
  will-change: transform;
}

.SilCursor-box {
  position: relative;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(0deg);
  transition:
    width 0.3s ease,
    height 0.3s ease,
    transform 0.3s ease,
    opacity 0.3s ease;
}

.SilCursor.is-hovered .SilCursor-box {
  width: 48px;
  height: 48px;
  transform: rotate(45deg);
}

.SilCursor-edge {
  position: absolute;
  background: #fff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.SilCursor-edge.is-top,
.SilCursor-edge.is-bottom {
  left: 0;
  width: 100%;
  height: 1px;
}

.SilCursor-edge.is-top {
  top: 0;
}

.SilCursor-edge.is-bottom {
  bottom: 0;
}

.SilCursor-edge.is-left,
.SilCursor-edge.is-right {
  top: 0;
  width: 1px;
  height: 100%;
}

.SilCursor-edge.is-left {
  left: 0;
}

.SilCursor-edge.is-right {
  right: 0;
}

.SilCursor.is-hovered .SilCursor-edge {
  opacity: 1;
}

.SilCursor-cross {
  position: absolute;
  background: #fff;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.SilCursor-cross.is-h {
  width: 100%;
  height: 2px;
}

.SilCursor-cross.is-v {
  width: 2px;
  height: 100%;
}

.SilCursor.is-hovered .SilCursor-cross {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .SilCursor-box,
  .SilCursor-edge,
  .SilCursor-cross {
    transition: none !important;
  }
}
</style>
