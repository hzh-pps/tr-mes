<template>
  <v-card flat style="width: 50%" variant="outlined" class="ma-3">
    <v-card-title class="d-flex align-center pe-2">
      {{ time + day }} MES数据
      <v-spacer></v-spacer>
      <v-text-field
        label="当前日期"
        v-model="time"
        type="date"
        density="compact"
        style="width: 100px"
        hide-details
        @update:modelValue="changedDate"
        show-footer="false"
      />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="dailyData"
      :items-per-page="25"
      density="compact"
    >
      <!-- <template v-slot:item="{ item }">
        <tr class="text-center">
          <td :class="getRawstatisticItemClass(item)">
            {{ item.raw.statisticItem }}
          </td>
          <td>{{ item.raw.type }}</td>
          <td>{{ item.raw.count }}</td>
          <td>{{ item.raw.planned_quantity }}</td>
        </tr>
      </template> -->
      <template v-slot:bottom></template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { type tableData } from "@/types/data-table";
let time = ref<string>(new Date().toISOString().split("T")[0]);
let day = computed(() => {
  const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return daysOfWeek[new Date(time.value).getDay()];
});
const headers = ref<any[]>([
  {
    title: "统计项",
    align: "center",
    key: "statisticItem",
  },
  { title: "工作中心", align: "center", key: "type" },
  { title: "单据", align: "center", key: "count" },
  { title: "产出料数量", align: "center", key: "planned_quantity" },
]);
let dailyData = ref<tableData>([]);
async function getData() {
  const data = await useHttp(
    "/Board/M108GetWorkorderdetail",
    "get",
    undefined,
    {
      date: time.value,
    }
  );
  dailyData.value = data.data;
}
onMounted(() => {
  getData();
});
function changedDate() {
  getData();
}
function getRawstatisticItemClass(item: any) {
  if (item.raw.statisticItem === "工单明细当日新增") {
    return "itemClass";
  } else if (item === "单据") {
    return "text-warning";
  } else {
    return "text-primary";
  }
}
</script>
<style scoped>
.itemClass {
  color: red;
  background-color: aqua;
}
</style>
