<template>
  <div class="d-flex mx-auto" style="width: 50%">
    <div style="width: 35%" class="mx-auto">
      <v-text-field
        label="选择日期"
        v-model="time"
        type="date"
        density="compact"
        variant="outlined"
        hide-details
        class="mb-2 mt-4"
        @update:modelValue="changedDate"
      >
      <!-- 123 -->
        <template v-slot:prepend>
          <div @click="minusDay">
            <v-icon size="26px">fa-regular fa-circle-left</v-icon>
          </div>
        </template>
        <template v-slot:append>
          <div @click="addDay">
            <v-icon size="26px">fa-regular fa-circle-right</v-icon>
          </div>
        </template>
      </v-text-field>
    </div>
    <v-btn
      @click="toExcel"
      color="blue-darken-2"
      class="align-self-end mb-1"
      style="position: absolute"
    >
      导出
    </v-btn>
  </div>
  <v-card flat style="width: 50%" variant="outlined" class="mb-3 mx-auto">
    <v-card-title class="card-title">
      {{ day }}
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="dailyData"
      :items-per-page="25"
      density="compact"
    >
      <template v-slot:item="{ item }">
        <tr
          v-if="
            item.raw.statisticItem === '已派工未完成' &&
            item.raw.type === '机加工'
          "
          class="text-center"
          style="font-weight: bold; font-size: 2rem"
        >
          <td colspan="4" class="mx-auto">截止至{{ timeNow }}数据</td>
        </tr>
        <tr :class="getClass(item)" class="text-center">
          <template> </template>
          <td>{{ item.raw.statisticItem }}</td>
          <td>{{ item.raw.type }}</td>
          <td :class="getCountClass(item)">{{ item.raw.count }}</td>
          <td :class="getQuantityClass(item)">
            {{ item.raw.planned_quantity }}
          </td>
        </tr>
      </template>
      <template v-slot:bottom></template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { type tableData } from "@/types/data-table";
import * as XLSX from "xlsx";
let timeNow = computed(() => {
  const date = new Date();
  let minutes = new Date().toLocaleTimeString().substring(0, 5);
  return (
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` +
    "日" +
    minutes
  );
});
let time = ref<string>(new Date().toISOString().split("T")[0]);
let day = computed(() => {
  const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  getData();
  return time.value + daysOfWeek[new Date(time.value).getDay()] + "MES生产数据";
});
const headers = ref<any[]>([
  {
    title: "统计项",
    align: "center",
    key: "statisticItem",
    sortable: false,
  },
  { title: "工作中心", align: "center", key: "type", sortable: false },
  { title: "单据", align: "center", key: "count", sortable: false },
  {
    title: "产出料数量",
    align: "center",
    key: "planned_quantity",
    sortable: false,
  },
]);
const groupBy = ref<any[]>([
  {
    key: "statisticItem",
    order: "asc",
  },
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
function getClass(item: any) {
  if (item.raw.statisticItem === "工单明细当日完成") {
    return "itemClass";
  }
  if (item.raw.statisticItem === "派工单当日完成") {
    return "text-warning";
  }
}
function addDay() {
  const date = ref<Date>(new Date(time.value));
  date.value.setDate(date.value.getDate() + 1);
  time.value = date.value.toISOString().split("T")[0];
}
function minusDay() {
  const date = ref<Date>(new Date(time.value));
  date.value.setDate(date.value.getDate() - 1);
  time.value = date.value.toISOString().split("T")[0];
}
function toExcel() {
  const emptyRows = Array(2).fill({});
  const dataWithEmptyRows = emptyRows.concat(dailyData.value);
  const ws = XLSX.utils.json_to_sheet(dataWithEmptyRows, {
    header: headers.value.map((h) => h.key),
    skipHeader: true, // 跳过自动生成的表头
  });
  ws["!cols"] = [{ width: 20 }];
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
  // 添加自定义表头
  XLSX.utils.sheet_add_aoa(ws, [[day.value]], {
    origin: "A1", // 表头开始的位置
  });
  XLSX.utils.sheet_add_aoa(ws, [headers.value.map((h) => h.title)], {
    origin: "A2", // 表头开始的位置
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, day.value);
  // 将工作簿导出为Excel文件
  XLSX.writeFile(wb, `工单明细每日记录(${time.value}).xlsx`);
}
function getCountClass(item: any) {
  if (item.raw.count > 0) {
    return "giveUnderline";
  }
}
function getQuantityClass(item: any) {
  if (item.raw.planned_quantity) {
    return "giveUnderline";
  }
}
</script>
<style scoped>
.itemClass {
  color: green;
  background-color: beige;
}
.card-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 2rem;
}
.giveUnderline {
  text-decoration: underline;
  font-weight: bold;
}
</style>
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
