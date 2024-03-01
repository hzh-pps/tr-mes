<script setup lang="ts">
let nowDate = new Date();
nowDate.setDate(nowDate.getDate() - 1);
let oldDate = new Date();
let startDate = ref<any>(null);
let endDate = ref<any>(null);
onMounted(() => {
  startDate.value = nowDate.toISOString().slice(0, 10);
  endDate.value = oldDate.toISOString().slice(0, 10);
});

// 搜索
function filter() {
  console.log(startDate.value, endDate.value);
}
// 重置搜索
function resetFilter() {
  startDate.value = nowDate.toISOString().slice(0, 10);
  endDate.value = oldDate.toISOString().slice(0, 10);
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="6">
      <v-text-field
        label="最晚日期搜索"
        variant="outlined"
        density="compact"
        hide-details
        type="date"
        class="mt-2"
        v-model="startDate"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        label="最早日期搜索"
        variant="outlined"
        density="compact"
        hide-details
        type="date"
        class="mt-2"
        v-model="endDate"
      ></v-text-field>
    </v-col>
    <v-col cols="4">
      <v-btn
        color="blue-darken-2"
        class="mr-2 mt-2"
        size="default"
        @click="filter"
        >搜索</v-btn
      >
      <v-btn color="red" class="mr-2 mt-2" size="default" @click="resetFilter"
        >重置搜索</v-btn
      >
    </v-col>
  </v-row>
</template>
