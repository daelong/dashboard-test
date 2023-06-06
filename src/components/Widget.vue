<template>
  <div class="widget" :style="widgetStyle" @mousedown="startChangePosition">
    <!-- 위젯 내용 -->
    <div class="title">{{ props.title }}</div>
    <div class="description" v-if="isDescrption">
      <div class="type">{{ props.type }}</div>
      <div class="label">{{ props.label }}</div>
    </div>
    <slot></slot>
    <div class="handle" @mousedown="startResize"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, watch, computed } from "vue";

const props = defineProps({
  title: String,
  top: String,
  left: String,
  width: String,
  height: String,
  isDescrption: Boolean,
  type: String,
  label: String,
  id: String,
});

const isResizing = ref(false);
const startX = ref(0);
const startY = ref(0);
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);
const currentWidth = computed(() => windowWidth.value);
const currentHeight = computed(() => windowHeight.value);
const widgetStyle = ref({
  position: "absolute",
  top: props.top,
  left: props.left,
  width: props.width ?? "200px",
  height: props.height ?? "200px",
});

function startChangePosition(event) {
  isResizing.value = true;
  startX.value = event.clientX;
  startY.value = event.clientY;

  document.addEventListener("mousemove", changePosition);
  document.addEventListener("mouseup", stopChangePosition);
}

function startResize(event) {
  isResizing.value = true;
  startX.value = event.clientX;
  startY.value = event.clientY;

  document.addEventListener("mousemove", resizeWidget);
  document.addEventListener("mouseup", stopResize);
}

function changePosition(event) {
  const left = parseInt(widgetStyle.value.left) || 0;
  const top = parseInt(widgetStyle.value.top) || 0;

  const deltaX = event.clientX - startX.value;
  const deltaY = event.clientY - startY.value;

  const newLeft = left + deltaX;
  const newTop = top + deltaY;

  const minLeft = (currentWidth.value / 100) * 10; // 최소 left 값
  const minTop = (currentHeight.value / 100) * 4; // 최소 Top 값

  const maxLeft =
    (currentWidth.value / 100) * 88 -
    parseInt(widgetStyle.value.width.replace("px", ""));
  const maxTop =
    (currentHeight.value / 100) * 102 -
    parseInt(widgetStyle.value.height.replace("px", ""));

  widgetStyle.value.left = clamp(newLeft, minLeft, maxLeft) + "px";
  widgetStyle.value.top = clamp(newTop, minTop, maxTop) + "px";
  window.localStorage.setItem(
    props.id,
    JSON.stringify({
      top: widgetStyle.value.top,
      left: widgetStyle.value.left,
      width: widgetStyle.value.width,
      height: widgetStyle.value.height,
    }) as any
  );
  startX.value = event.clientX;
  startY.value = event.clientY;
}

function resizeWidget(event) {
  if (!isResizing.value) return;

  const width = parseInt(widgetStyle.value.width) || 0;
  const height = parseInt(widgetStyle.value.height) || 0;

  const deltaX = event.clientX - startX.value;
  const deltaY = event.clientY - startY.value;
  if (Number(widgetStyle.value.left.replace("px", "")) + width + deltaY <= 1200)
    widgetStyle.value.width = width + deltaX + "px";
  if (Number(widgetStyle.value.top.replace("px", "")) + height + deltaY <= 828)
    widgetStyle.value.height = height + deltaY + "px";
  window.localStorage.setItem(
    props.id,
    JSON.stringify({
      top: widgetStyle.value.top,
      left: widgetStyle.value.left,
      width: widgetStyle.value.width,
      height: widgetStyle.value.height,
    }) as any
  );
  startX.value = event.clientX;
  startY.value = event.clientY;
}

function stopResize() {
  isResizing.value = false;

  document.removeEventListener("mousemove", resizeWidget);
  document.removeEventListener("mouseup", stopResize);
}

function stopChangePosition() {
  isResizing.value = false;

  document.removeEventListener("mousemove", changePosition);
  document.removeEventListener("mouseup", stopChangePosition);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

const handleScreenSize = () => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
};

onMounted(() => {
  window.addEventListener("resize", handleScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleScreenSize);
});
</script>

<style lang="scss" scoped>
.widget {
  /* 위젯 스타일 */
  min-width: 100px;
  min-height: 100px;
  background-color: #ffffff;
  color: black;
  text-align: start;
  padding: 10px;
  .title {
    color: #3498db;
  }
  .description {
    display: flex;
    align-items: center;
    .type {
      background-color: #ecf0f1;
      color: #535c68;
      padding: 2px;
      font-size: 8px;
    }
    .label {
      font-size: 8px;
      margin-left: 4px;
      color: #535c68;
    }
  }
}

.handle {
  width: 20px;
  height: 20px;
  background-color: #ccc;
  position: absolute;
  right: 0;
  bottom: 0;
  /* 핸들 스타일 */
}
</style>
