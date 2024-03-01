<script setup lang="ts">
let nowDate = new Date();
nowDate.setDate(nowDate.getDate() - 1);
let oldDate = new Date();
let startDate = ref<any>(null);
let endDate = ref<any>(null);
onMounted(() => {
  startDate.value = nowDate.toISOString().slice(0, 10);
  endDate.value = oldDate.toISOString().slice(0, 10);
  getDispatchData();
});
// 当前页
let tablePerPage = ref<number>(1);
watch(tablePerPage, function () {
  getDispatchData();
});
//一共有多少行质检表
let tableDataLength = ref<number>(0);
// 质检表有多少页
let tablePageCount = computed(() => {
  return Math.ceil(tableDataLength.value / 10);
});
let dispatchList = ref<any[]>([]);
async function getDispatchData() {
  const data: any = await useHttp(
    "/MesProcessScanRecord/M116GetUnfinishedOrderList",
    "get",
    undefined,
    {
      strattime: startDate.value,
      endtime: endDate.value,
      status: "已执行在生产",
      PageIndex: tablePerPage.value,
      PageSize: 10,
      SortedBy: "id",
      SortedType: "1",
    }
  );
  tableDataLength.value = data.data.totalCount;
  dispatchList.value = data.data.pageList;
}

// 搜索
function filter() {
  tablePerPage.value = 1;
  getDispatchData();
}
// 重置搜索
function resetFilter() {
  startDate.value = nowDate.toISOString().slice(0, 10);
  endDate.value = oldDate.toISOString().slice(0, 10);
  tablePerPage.value = 1;
  getDispatchData();
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
    <v-col cols="12">
      <v-card style="overflow: auto; white-space: nowrap" height="750px">
        <v-list
          density="compact"
          class="ma-2 elevation-2 rounded-lg"
          v-if="dispatchList.length"
          v-for="(item, index) in dispatchList"
          :key="index"
        >
          <div class="d-flex ma-2">
            <!-- 1 -->
            <div class="flex-grow-0">
              <div
                class="text-body-1 text-blue-darken-1"
                style="flex-basis: 12%"
              >
                派工单号：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.dispatch_order }}
                </span>
              </div>

              <div
                style="flex-basis: 12%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                工单状态：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.status }}
                </span>
              </div>
            </div>
            <!-- 2 -->
            <div class="flex-grow-0 ml-8 pl-8">
              <div
                style="flex-basis: 12%"
                class="text-body-1 text-blue-darken-1"
              >
                开始人员：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.start_name }}
                </span>
              </div>

              <div
                style="flex-basis: 12%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                计划数量：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.planned_quantity }}{{ item.unit }}
                </span>
              </div>
            </div>
            <!-- 3 -->
            <div class="flex-grow-0 ml-8 pl-8">
              <div
                style="flex-basis: 22%"
                class="text-body-1 text-blue-darken-1"
              >
                报工数量：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.noqa_quantity === null ? 0 : item.noqa_quantity }}
                </span>
              </div>

              <div
                style="flex-basis: 22%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                合格数量：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.reported_quantity }}
                </span>
              </div>
            </div>
            <!-- 4 -->
            <div class="flex-grow-0 ml-8 pl-8">
              <div
                style="flex-basis: 15%"
                class="text-body-1 text-blue-darken-1"
              >
                工序：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.procedure_description }}
                </span>
              </div>
              <div
                style="flex-basis: 10%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  @{{ item.work_center_name }}
                </span>
              </div>
            </div>
            <!--5 -->
            <div class="flex-grow-0 ml-8 pl-8">
              <div
                style="flex-basis: 20%"
                class="text-body-1 text-blue-darken-1"
              >
                项目号：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.project_code }}
                </span>
              </div>
              <div
                style="flex-basis: 20%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                扫码时间：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.scan_time }}
                </span>
              </div>
            </div>

            <!-- 6 -->
            <div class="flex-grow-1 ml-8 pl-8">
              <div
                style="flex-basis: 20%"
                class="text-body-1 text-blue-darken-1"
              >
                物料名称：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.material_name }}
                </span>
              </div>
              <div
                style="flex-basis: 22%"
                class="text-body-1 text-blue-darken-1 py-4"
              >
                物料编号：
                <span
                  class="text-blue-grey-lighten-2"
                  style="text-decoration: underline"
                >
                  {{ item.material_id }}
                </span>
              </div>
            </div>
          </div>
        </v-list>
        <v-list v-else>
          <div class="text-center text-h6 my-3 text-grey">当前类型数据为空</div>
        </v-list>
      </v-card>
      <div class="text-center pt-2">
        <v-pagination
          v-model="tablePerPage"
          :length="tablePageCount"
        ></v-pagination>
      </div>
    </v-col>
  </v-row>
</template>
