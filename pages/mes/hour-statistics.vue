<script setup lang="ts">
import * as XLSX from "xlsx";

useSeoMeta({
  // 该页面的标题
  title: "工时统计",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "工时统计",
  // 该页面的描述
  description: "同日 MES 系统，工时统计",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，工时统计",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 页面缓存
definePageMeta({
  keepalive: true,
});
let headers = ref<any[]>([
  {
    title: "项目号",
    align: "true",
    key: "project_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "工单编号",
    align: "center",
    key: "workorder_hid",
    sortable: true,
    filterable: true,
  },
  {
    title: "明细编号",
    align: "center",
    key: "workorder_did",
    sortable: true,
    filterable: true,
  },
  {
    title: "派工单号",
    align: "center",
    key: "dispatch_order",
    sortable: true,
    filterable: true,
  },
  {
    title: "工作中心",
    align: "center",
    key: "work_center_name",
    sortable: false,
    filterable: true,
  },
  {
    title: "物料名称",
    align: "center",
    key: "material_name",
    sortable: false,
    filterable: true,
  },
  {
    title: "图纸号",
    align: "center",
    key: "material_id",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作人员",
    align: "center",
    key: "employee_name",
    sortable: false,
    filterable: true,
  },
  {
    title: "工作时间",
    align: "center",
    key: "temporal_interval",
    sortable: true,
    filterable: true,
  },
  {
    title: "工时",
    align: "center",
    key: "work_time",
    sortable: true,
    filterable: true,
  },
]);
let showDialog = ref<boolean>(false);
let showDetailDialog = ref<boolean>(false);
//获取数据库数据
let hourList = ref<any[]>([]);
//搜索
let searchProject = ref<any>("");
let searchWorkHid = ref<any>("");
let searchWorkDid = ref<any>("");
let searchOrder = ref<any>("");
let searchCenterName = ref<any>("");
let searchEmployeeName = ref<any>("");

let nowDate = new Date();
nowDate.setDate(nowDate.getDate() - 7);
let searchStartTime = ref("");
let searchEndTime = ref("");

//调用接口
async function getHourDate() {
  const data: any = await useHttp(
    "/MesProcessScanRecord/M87CountManHour",
    "get",
    undefined,
    {
      project_code: searchProject.value,
      workorder_hid: searchWorkHid.value,
      workorder_did: searchWorkDid.value,
      dispatch_order: searchOrder.value,
      work_center_name: searchCenterName.value,
      employee_name: searchEmployeeName.value,
      start_time: searchStartTime.value,
      end_time: searchEndTime.value,
    }
  );
  hourList.value = sliceDate(data.data);
  hourList.value = hourList.value
    .sort((a: any, b: any) => {
      const aId = parseInt(a.record_id.substring(3));
      const bId = parseInt(b.record_id.substring(3));
      return bId - aId;
    })
    .filter((item: any) => {
      return (
        item.work_center_name !== "委外表面处理1" &&
        item.work_center_name !== "纯图纸委外" // 过滤掉外协的工时
      );
    });
}
// 该方法是为了校验工作时间段是否包含休息时间，将其减去对应的休息时间
function sliceDate(arr: any[]) {
  return arr.map((item: any) => {
    const [startTimeStr, endTimeStr] = item.temporal_interval
      .split("—")
      .map((str: any) => str.trim());
    const date1: any = parseTime(startTimeStr);
    const date2: any = parseTime(endTimeStr);

    // 检查日期部分是否相同
    if (date1.toDateString() !== date2.toDateString()) {
      // 计算相差的天数
      const timeDiff = Math.abs(date2 - date1);
      const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      // 计算需要减去的总小时数
      const totalHoursToSubtract = diffDays * 11.5;

      // 减去总小时数
      item.work_time -= totalHoursToSubtract;
      // 对工时进行四舍五入或者限制小数位数
      item.work_time = Math.round(item.work_time * 100) / 100; // 四舍五入保留两位小数
      return { ...item, work_time: item.work_time }; // 返回更新后的对象
    }
    // 检查时间范围
    const startRange1 = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      12,
      0,
      0
    );
    const endRange1 = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      13,
      0,
      0
    );
    const startRange2 = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      17,
      30,
      0
    );
    const endRange2 = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      18,
      0,
      0
    );
    let workTime = item.work_time;
    // 当这段工时里面包含12点-13点时减去1个小时
    if (date1 <= startRange1 && date2 >= endRange1) {
      workTime -= 1;
    }
    // 当工时包含17:30-18::00时减去0.5小时
    if (date1 <= startRange2 && date2 >= endRange2) {
      workTime -= 0.5;
    }
    // 对工时进行四舍五入或者限制小数位数
    workTime = Math.round(workTime * 100) / 100; // 四舍五入保留两位小数
    return { ...item, work_time: workTime }; // 返回更新后的对象
  });
}

function parseTime(timeStr?: any) {
  const [dateStr, time] = timeStr.split(" ");
  const [year, month, day] = dateStr.split("/").map(Number);
  const [hour, minute, second] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, second);
}
// 导出数据
function exportToExcel() {
  // 创建中文表头映射
  const headerMap = [
    { key: "project_code", title: "项目号" },
    { key: "workorder_hid", title: "工单编号" },
    { key: "workorder_did", title: "明细编号" },
    { key: "dispatch_order", title: "派工单号" },
    { key: "work_center_name", title: "工作中心" },
    { key: "material_name", title: "物料名称" },
    { key: "material_id", title: "图纸号" },
    { key: "employee_name", title: "工作人员" },
    { key: "temporal_interval", title: "工作时间" },
    { key: "work_time", title: "工时" },
  ];

  // 将数据转换为带有中文表头的数组
  const formattedData: any = hourList.value.map((item) => {
    const formattedItem: { [key: string]: any } = {}; // 明确索引签名
    headerMap.forEach((header: any) => {
      formattedItem[header.title] = item[header.key];
    });
    return formattedItem;
  });

  // 使用xlsx库创建和下载Excel文件
  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "工时统计");
  XLSX.writeFile(wb, "工时统计.xlsx");
}
onMounted(() => {
  searchStartTime.value = nowDate.toISOString().substring(0, 10);
  searchEndTime.value = new Date().toISOString().substring(0, 10);
  getHourDate();
});
async function filter() {
  await getHourDate();
  addHour();
}
function resetFilter() {
  (searchProject.value = ""),
    (searchWorkHid.value = ""),
    (searchWorkDid.value = ""),
    (searchOrder.value = ""),
    (searchCenterName.value = ""),
    (searchStartTime.value = nowDate.toISOString().substring(0, 10)),
    (searchEndTime.value = new Date().toISOString().substring(0, 10)),
    (searchEmployeeName.value = "");
  hour.value = 0;
  getHourDate();
}
function showSum() {
  showDialog.value = true;
}
let hour = ref<number>(0);
function addHour() {
  hour.value = 0;
  hourList.value.forEach((item: any) => {
    hour.value += Math.round(item.work_time * 100);
  });
  hour.value /= 100;
}
let expanded = ref<any>(null);
const startTimeStr = ref();
const endTimeStr = ref();
function showDetail(item: any, obj: any) {
  expanded.value = obj.item.raw;
  showDetailDialog.value = true;
  [startTimeStr.value, endTimeStr.value] = expanded.value.temporal_interval
    .split("—")
    .map((str: any) => str.trim());
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="3">
      <v-text-field
        label="项目号"
        v-model="searchProject"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="工单表头"
        v-model="searchWorkHid"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="工单明细"
        v-model="searchWorkDid"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="派工单号"
        v-model="searchOrder"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="工作中心"
        v-model="searchCenterName"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="开始时间"
        v-model="searchStartTime"
        type="date"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="截止时间"
        v-model="searchEndTime"
        type="date"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="员工姓名"
        v-model="searchEmployeeName"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        @keydown.enter="filter()"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col cols="9">
          <v-btn
            color="blue-darken-2"
            class="mr-2 mt-2"
            size="default"
            @click="filter"
            >查询</v-btn
          >
          <v-btn
            color="red"
            class="mr-2 mt-2"
            size="default"
            @click="resetFilter"
            >重置查询</v-btn
          >
          <!-- <v-btn
            color="blue-darken-2"
            class="mr-2 mt-2"
            size="default"
            @click="showSum"
          >
            工时统计
          </v-btn> -->
          <v-btn
            color="blue-darken-2"
            class="mr-2 mt-2"
            size="default"
            @click="exportToExcel"
          >
            导出Excel
          </v-btn>
        </v-col>
        <v-col cols="3">
          <div
            class="text-blue-darken-2 font-weight-bold text-h6 text-center"
            v-show="hour"
          >
            工时：<span
              style="border: 3px rgb(170, 65, 65) solid; padding: 8px 10px"
              >{{ hour }}</span
            >
          </div>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-data-table
        hover
        :items-per-page="10"
        :headers="headers"
        :items="hourList"
        style="overflow-x: auto; white-space: nowrap"
        fixed-footer
        fixed-header
        height="610"
        no-data-text="没有找到符合的数据"
        @click:row="showDetail"
      >
      </v-data-table>
    </v-col>
    <v-dialog v-model="showDialog" min-width="400px" width="560px">
      <v-card>
        <v-card-text class="mt-4">
          <div v-if="searchProject">项目号:{{ searchProject }}</div>
          <div v-if="searchWorkHid">工单表头:{{ searchWorkHid }}</div>
          <div v-if="searchWorkDid">明细编号:{{ searchWorkDid }}</div>
          <div v-if="searchOrder">派工单号:{{ searchOrder }}</div>
          <div v-if="searchCenterName">工作中心:{{ searchCenterName }}</div>
          工时为:{{ hour }}
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn color="grey" size="large" @click="showDialog = false">
            关闭
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDetailDialog" min-width="1000px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 工时详情 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showDetailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-stepper>
            <v-stepper-header>
              <v-stepper-item complete value="1">
                <div class="d-flex flex-column">
                  <div>状态：{{ expanded.scan_action }}</div>
                  <div>员工姓名: {{ expanded.employee_name }}</div>
                  <div>时间: {{ expanded.scan_time }}</div>
                </div>
              </v-stepper-item>

              <div class="d-flex flex-column w-100">
                <div class="text-center">
                  产出料：{{ expanded.material_name }}
                </div>
                <v-divider :thickness="3"></v-divider>
              </div>
              <v-stepper-item complete value="2">
                <div class="d-flex flex-column">
                  <div>状态：结束</div>
                  <div>员工姓名: {{ expanded.employee_name }}</div>
                  <div>时间: {{ endTimeStr }}</div>
                </div>
              </v-stepper-item>
            </v-stepper-header>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
