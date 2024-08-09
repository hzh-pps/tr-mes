<script setup lang="ts"></script>

<template>
  <v-row class="ma-2">
    <div class="bg">
      <ModuleTitle />
      <div class="main">
        <ModuleFirst />
        <ModuleSecond />
        <ModuleThird />
        <ModuleFourth />
      </div>
    </div>
  </v-row>
</template>
<style scoped>
.bg {
  width: 100%;
  height: 100%;
  background: #0c192c;
  color: azure;
  overflow-x: none;
}
.main {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: 1fr 4fr 3fr;
  gap: 10px;
}
.main div:nth-child(1) {
  grid-column: 1/3;
}
.main div:nth-child(2) {
  grid-row: 2/4;
}
</style>
