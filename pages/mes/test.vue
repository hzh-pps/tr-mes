<script setup lang="ts">
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();

//表头
let headers = ref<any[]>([
  {
    title: "项目号",
    align: "center",
    key: "project_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "物料编码",
    align: "center",
    key: "mcode",
    sortable: false,
    filterable: true,
  },
  {
    title: "物料描述",
    align: "center",
    key: "mdescription",
    sortable: false,
    filterable: true,
  },
  {
    title: "预计交付日期",
    align: "center",
    key: "estimated_delivery_date",
    sortable: false,
    filterable: true,
  },
  {
    title: "计划数量",
    align: "center",
    key: "planned_quantity",
    sortable: false,
    filterable: true,
  },
  {
    title: "实际数量",
    align: "center",
    key: "reported_quantity",
    sortable: false,
    filterable: true,
  },
  {
    title: "状态",
    align: "center",
    key: "status",
    sortable: false,
    filterable: true,
  },
]);

// 工单明细表格初始页
let tableDetailPage = ref<number>(1);
// 工单明细表格每页条数
let tableDetailPerPage = ref<number>(10);
//一共有多少工单明细行数据
let tableDataDetailLength = ref<number>(0);

// 物料编码
let searchOutputs = ref<string>("");
// 项目号
let searchProjectNumber = ref<string>("");

let nowDate = new Date();
nowDate.setFullYear(nowDate.getFullYear() - 1);
let oldDate = new Date();
oldDate.setMonth(oldDate.getMonth() + 1);
let startDateDetail = ref<any>(null);
let endDateDetail = ref<any>(null);
//工单明细表格展示的数据
let tableDataDetail = ref<any[]>([]);
// 工单明细表格有多少页
let tableDetailPageCount = computed(() => {
  return Math.ceil(tableDataDetailLength.value / tableDetailPerPage.value);
});
//将工单明细数据的日期进行截取，保留年月份
function formatDateDetail(data: any) {
  try {
    data.forEach((item: any) => {
      if (item.estimated_delivery_date !== null) {
        item.estimated_delivery_date = item.estimated_delivery_date.substring(
          0,
          10
        );
      }
      if (item.actual_delivery_date !== null)
        item.actual_delivery_date = item.actual_delivery_date.substring(0, 10);
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}
//获取工单明细数据
async function getWorkOrderDetail() {
  try {
    const data: any = await useHttp(
      "/MesWorkOrderDetail/M05WorkOrderDetails",
      "get",
      undefined,
      {
        PageIndex: tableDetailPage.value,
        PageSize: tableDetailPerPage.value,
        SortType: 1,
        SortedBy: "id",
        mcode: searchOutputs.value,
        project_code: searchProjectNumber.value,
        estimated_delivery_date: startDateDetail.value,
        end_date: endDateDetail.value,
      }
    );
    tableDataDetail.value = formatDateDetail(data.data.pageList).sort(
      (a: any, b: any) => {
        return b.mcode.localeCompare(a.mcode);
      }
    );
    tableDataDetailLength.value = data.data.totalCount;
  } catch (error) {
    setSnackbar("black", "获取数据失败");
    console.log(error);
  }
}

//工单明细下一页
watch(tableDetailPage, () => {
  getWorkOrderDetail();
});
//更改工单明细页面显示的最大数量
watch(tableDetailPerPage, () => {
  getWorkOrderDetail();
});

onMounted(() => {
  startDateDetail.value = nowDate.toISOString().substring(0, 10);
  endDateDetail.value = oldDate.toISOString().substring(0, 10);
  getWorkOrderDetail();
});

//工单明细搜素
async function filterTableDataDetail() {
  try {
    tableDetailPage.value = 1;
    getWorkOrderDetail();
  } catch (error) {
    console.log(error);
  }
}
//重置工单明细的搜素
function resetFilterDetail() {
  searchOutputs.value = "";
  searchProjectNumber.value = "";
  startDateDetail.value = nowDate.toISOString().substring(0, 10);
  endDateDetail.value = oldDate.toISOString().substring(0, 10);
  tableDetailPage.value = 1;
  getWorkOrderDetail();
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="3">
      <v-text-field
        label="项目号"
        v-model="searchProjectNumber"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="物料编码"
        v-model="searchOutputs"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>

    <v-col cols="3">
      <v-text-field
        label="最早交付时间"
        v-model="startDateDetail"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        type="date"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field
        label="最晚交付时间"
        v-model="endDateDetail"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
        type="date"
      ></v-text-field>
    </v-col>
    <v-col cols="10">
      <v-btn
        color="blue-darken-2"
        class="mr-2 mt-2"
        size="default"
        @click="filterTableDataDetail"
        >搜索</v-btn
      >
      <v-btn
        color="red"
        class="mr-2 mt-2"
        size="default"
        @click="resetFilterDetail"
        >重置搜索</v-btn
      >
    </v-col>
    <v-col cols="2">
      <v-select
        class="mr-1"
        density="compact"
        hide-details
        variant="outlined"
        label="每页最大数"
        :items="[10, 20, 30, 50, 100, 200]"
        v-model="tableDetailPerPage"
      ></v-select>
    </v-col>
    <v-col cols="12">
      <v-data-table
        hover
        :items-per-page="tableDetailPerPage"
        :headers="headers"
        :items="tableDataDetail"
        style="overflow-x: auto; white-space: nowrap"
        :fixed-footer="false"
        fixed-header
        height="610"
        no-data-text="没有找到符合的数据"
      >
        <template v-slot:bottom>
          <div class="text-center pt-2">
            <v-pagination
              next-icon="mdi-menu-right"
              prev-icon="mdi-menu-left"
              v-model="tableDetailPage"
              :length="tableDetailPageCount"
            ></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
    </template>
  </v-snackbar>
</template>
