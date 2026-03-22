<script setup lang="ts">
import { useData } from "vitepress";
import { VPButton, VPFeatures, VPImage } from "vitepress/theme";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

type HeroImage =
  | string
  | {
    src?: string;
    alt?: string;
    [key: string]: unknown;
  };

type HeroAction = {
  text?: string;
  link?: string;
  theme?: string;
};

type HomeFeature = {
  title?: string;
  [key: string]: unknown;
};

type HomeHero = {
  name?: string;
  text?: string;
  tagline?: string;
  image?: HeroImage;
  actions?: HeroAction[];
};

type HomeFrontmatter = {
  layout?: string;
  hero?: HomeHero;
  features?: HomeFeature[];
};

const rootRef = ref<HTMLElement | null>(null);
const { frontmatter } = useData();
const homeFrontmatter = computed(() => frontmatter.value as unknown as HomeFrontmatter);

const isHome = computed(() => homeFrontmatter.value.layout === "home");
const hero = computed<HomeHero>(() => homeFrontmatter.value.hero ?? {});
const features = computed<HomeFeature[]>(() => homeFrontmatter.value.features ?? []);
const actions = computed<HeroAction[]>(() => hero.value.actions ?? []);
const heroTagline = computed(() => String(hero.value.tagline ?? ""));
const heroTaglineLead = computed(() => heroTagline.value.slice(0, 4));
const heroTaglineTail = computed(() => heroTagline.value.slice(4));

const heroImage = computed(() => {
  const image = hero.value.image;
  if (image && typeof image === "object" && "src" in image) return image;
  if (typeof image === "string") return { src: image, alt: hero.value.name ?? "SILANDRI" };
  return { src: "/image/SILANDRI/SILANDRI.png", alt: hero.value.name ?? "SILANDRI" };
});

const valueWords = computed(() => {
  const titles = features.value
    .map((feature) => (typeof feature?.title === "string" ? feature.title : ""))
    .filter(Boolean)
    .slice(0, 3);

  return titles.length ? titles : ["团结", "平等", "秩序"];
});

let revealObserver: IntersectionObserver | null = null;

const setupRevealObserver = async () => {
  await nextTick();
  revealObserver?.disconnect();
  if (!rootRef.value) return;

  const elements = rootRef.value.querySelectorAll<HTMLElement>(".sil-reveal");
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver?.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((element) => revealObserver?.observe(element));
};

watch(isHome, (value) => {
  if (value) {
    void setupRevealObserver();
  } else {
    revealObserver?.disconnect();
  }
});

onMounted(() => {
  if (isHome.value) {
    void setupRevealObserver();
  }
});

onBeforeUnmount(() => {
  revealObserver?.disconnect();
});
</script>

<template>
  <div v-if="isHome" ref="rootRef" class="SilandriHome">
    <section class="SilandriHome-hero">
      <div class="SilandriHome-scanline" />
      <div class="SilandriHome-wordmark sil-reveal">
        <div class="SilandriHome-hero-body">
          <div class="SilandriHome-emblem">
            <div class="SilandriHome-emblem-glow" />
            <VPImage
              class="SilandriHome-emblem-image"
              :image="heroImage"
            />
          </div>
          <div class="SilandriHome-hero-copy">
            <h1 class="SilandriHome-title">{{ hero.name ? String(hero.name) : "SILANDRI" }}</h1>
            <p v-if="hero.text" class="SilandriHome-subtitle">{{ String(hero.text) }}</p>
          </div>
        </div>
      </div>
      <div class="SilandriHome-scroll">
        <span>SCROLL TO BEGIN</span>
        <i />
      </div>
    </section>

    <section class="SilandriHome-values sil-reveal">
      <div class="SilandriHome-noise" />
      <div class="SilandriHome-values-inner">
        <div class="SilandriHome-kicker">// Core Values //</div>
        <div class="SilandriHome-values-title">
          <span class="SilandriHome-values-line SilandriHome-values-line-break">
            <span class="SilandriHome-values-lead sil-scramble">{{ heroTaglineLead || valueWords[0] }}</span>
            <span class="SilandriHome-values-tail sil-scramble">{{ heroTaglineTail || valueWords.slice(1).join("") }}</span>
          </span>
        </div>
        <div class="SilandriHome-divider" />
        <div class="SilandriHome-values-actions">
          <VPButton
            v-for="action in actions.slice(0, 2)"
            :key="String(action.text ?? action.link)"
            :text="String(action.text ?? '')"
            :href="action.link"
            size="big"
            :theme="action.theme ?? 'brand'"
          />
          <template v-if="!actions.length">
            <VPButton text="阅读 Wiki" href="/guide/intro" size="big" theme="brand" />
            <VPButton text="成员页" href="/members" size="big" theme="alt" />
          </template>
        </div>
      </div>
    </section>

    <section class="SilandriHome-protocols sil-reveal">
      <div class="SilandriHome-protocols-head">
        <div>
          <h2 class="SilandriHome-section-title sil-scramble">优势</h2>
          <p class="SilandriHome-section-subtitle">Features</p>
        </div>
        <div class="SilandriHome-section-meta">
          VOL. 1.0
          <br />
          PUBLIC RECORD
        </div>
      </div>

      <VPFeatures v-if="features.length" class="SilandriHome-features" :features="features" />
    </section>

    <section class="SilandriHome-cta sil-reveal">
      <div class="SilandriHome-cta-target" />
      <div class="SilandriHome-cta-inner">
        <h3 class="SilandriHome-cta-title SilandriHome-cta-title-break">
          <span class="SilandriHome-cta-lead sil-scramble">ACCESS</span>
          <span class="SilandriHome-cta-tail sil-scramble">SILANDRI</span>
        </h3>
        <p class="SilandriHome-cta-text">查看组织章程、成员结构与后续建设记录。</p>
      </div>
    </section>
  </div>
</template>
