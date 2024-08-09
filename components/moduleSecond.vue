<script setup lang="ts">
import BarChart from "./chart/barchart.vue";
import ScrollBoard from "./chart/scrollboard.vue";
</script>
<template>
  <div class="bgStyle">
    <BarChart />
    <ScrollBoard />
  </div>
</template>
<style scoped>
.bgStyle {
  height: 100%;
  background-color: #0d2049;
  border-top: 2px solid #0b3e6b;
}
</style>
