<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "委外工序",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "委外工序",
  // 该页面的描述
  description: "同日 MES 系统，委外工序",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，委外工序",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 页面缓存
definePageMeta({
  keepalive: false,
});
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
let editDialog = ref<boolean>(false);
let addDialog = ref<boolean>(false);
let delDialog = ref<boolean>(false);
let editHeaderDialog = ref<boolean>(false);
let addHeaderDialog = ref<boolean>(false);
let delHeaderDialog = ref<boolean>(false);

let addShowDialog = ref<boolean>(false);
let banDialog = ref<boolean>(false);
let stepDialog = ref<boolean>(false);

let searchOutsourced = ref<any>();
let searchSupplier = ref<any>("");
let headerList = ref<any[]>([
  {
    title: "委外单号",
    align: "center",
    key: "outsourced_head_code",
    sortable: false,
    filterable: true,
  },
  {
    title: "供应商",
    align: "center",
    key: "supplier_name",
    sortable: false,
    filterable: true,
  },
  {
    title: "重量",
    align: "center",
    key: "total_weight",
    sortable: false,
    filterable: true,
  },
  {
    title: "委外开始日期",
    align: "center",
    key: "outsourced_start_date",
    sortable: false,
    filterable: true,
  },
  {
    title: "状态",
    align: "center",
    key: "outsourced_status",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    align: "center",
    key: "action",
    sortable: false,
    filterable: true,
  },
]);
// 表头数据
let headerOrderList = ref<any[]>([]);

// 获取数据库数据
async function getOrderData() {
  const data: any = await useHttp(
    "/QaOrderHead/M111GetQaOrderHead",
    "get",
    undefined,
    {
      outsourced_head_code: searchOutsourced.value,
      supplier_name: searchSupplier.value,
    }
  );
  headerOrderList.value = data.data
    .map((item: any) => {
      item.outsourced_start_date = item.outsourced_start_date.substring(0, 10);
      return item;
    })
    .sort((a: any, b: any) => {
      return b.id - a.id;
    });
  code.value = headerOrderList.value[0].outsourced_head_code;
}
//搜索
function filter1() {
  getOrderData();
}
// 重置搜素
function resetFilter1() {
  searchOutsourced.value = "";
  searchSupplier.value = "";
  getOrderData();
}
let headerInfo = ref<any>(null);
// 新增表头
function showAddHeader() {
  headerInfo.value = {
    supplier_name: "",
    total_weight: "",
    outsourced_start_date: new Date(),
    outsourced_status: "发出",
  };
  addHeaderDialog.value = true;
}
async function addSuccess() {
  const data: any = await useHttp(
    "/QaOrderHead/M112AddQaOrderHead",
    "post",
    headerInfo.value
  );
  addHeaderDialog.value = false;
  getOrderData();
}
// 表头修改
function showEditHeader(item: any) {
  headerInfo.value = { ...item };
  editHeaderDialog.value = true;
}
async function editHeader() {
  const data: any = await useHttp(
    "/QaOrderHead/M113UpdateQaOrderHead",
    "put",
    headerInfo.value
  );
  editHeaderDialog.value = false;
  getOrderData();
}
// 表头删除
function showDelHeader(item: any) {
  headerInfo.value = { ...item };
  delHeaderDialog.value = true;
}
async function delHeader() {
  const data: any = await useHttp(
    "/QaOrderHead/M114DeleteQaOrderHead",
    "delete",
    undefined,
    {
      ids: headerInfo.value.id,
    }
  );
  delHeaderDialog.value = false;
  getOrderData();
}

let code = ref<any>(null);
//点击获取当前表头下的明细
function showDetail(item: any, obj: any) {
  code.value = obj.item.raw.outsourced_head_code;
}
watch(code, function () {
  getOutSourceData();
});
// 明细数据
let headers = ref<any[]>([
  {
    title: "派工单号",
    align: "center",
    key: "dispatch_order",
    sortable: false,
    filterable: true,
  },
  {
    title: "委外类型",
    align: "center",
    key: "procedure_description",
    sortable: false,
    filterable: true,
  },
  {
    title: "委外物料",
    align: "center",
    key: "material_name",
    sortable: false,
    filterable: true,
  },
  {
    title: "物料编码",
    align: "center",
    key: "material_id",
    sortable: false,
    filterable: true,
  },
  {
    title: "项目号",
    align: "center",
    key: "project_code",
    sortable: false,
    filterable: true,
  },

  {
    title: "委外数量",
    align: "center",
    key: "outsourced_quantity",
    sortable: false,
    filterable: true,
  },
  {
    title: "接受数量",
    align: "center",
    key: "reported_quantity",
    sortable: false,
    filterable: true,
  },
  {
    title: "单位",
    align: "center",
    key: "unit",
    sortable: false,
    filterable: true,
  },

  {
    title: "委外完成日期",
    align: "center",
    key: "outsourced_finish_date",
    sortable: false,
    filterable: true,
  },
  {
    title: "验收标准",
    align: "center",
    key: "acceptance_criteria",
    sortable: false,
    filterable: true,
  },
  {
    title: "委外状态",
    align: "center",
    key: "outsourced_status",
    sortable: false,
    filterable: true,
  },
  {
    title: "操作",
    align: "center",
    key: "action",
    sortable: false,
    filterable: true,
  },
]);
let outSourceList = ref<any[]>([]);
//搜索字段
let searchName = ref<any>("");
let searchDispatch = ref<any>("");
let searchStatus = ref<any>("");
let newDate = new Date();
newDate.setFullYear(newDate.getFullYear() - 1);
let endDate = new Date();
endDate.setMonth(endDate.getMonth() + 1);
let searchStartDate = newDate.toISOString().substring(0, 10);
let searchEndDate = endDate.toISOString().substring(0, 10);
//获取数据库数据
async function getOutSourceData() {
  const data: any = await useHttp("/QaOrder/M81GetQaOrder", "get", undefined, {
    outsourced_head_code: code.value,
    supplier_id: searchSupplier.value,
    material_name: searchName.value,
    dispatch_order: searchDispatch.value,
    outsourced_status: searchStatus.value,
    start_date: searchStartDate,
    end_date: searchEndDate,
    PageIndex: 1,
    PageSize: 100000,
    SortedBy: "id",
    SortType: "0",
  });
  outSourceList.value = data.data.pageList
    .map((item: any) => {
      if (item.outsourced_start_date) {
        item.outsourced_start_date = item.outsourced_start_date.substring(
          0,
          10
        );
      }
      if (item.outsourced_finish_date) {
        item.outsourced_finish_date = item.outsourced_finish_date.substring(
          0,
          10
        );
      }
      return item;
    })
    .sort((a: any, b: any) => {
      return b.id - a.id;
    });
}
onMounted(() => {
  getOrderData();
});
//查询
function filter() {
  getOutSourceData();
}
//重置查询
function resetFilter() {
  searchStatus.value = "";
  searchName.value = "";
  searchDispatch.value = "";
  searchStartDate = newDate.toISOString().substring(0, 10);
  searchEndDate = endDate.toISOString().substring(0, 10);
  getOutSourceData();
}
//委外工序对象
let outSourceInfo = ref<any>(null);
//修改委外信息
function showEdit(item: any) {
  outSourceInfo.value = { ...item };
  editDialog.value = true;
}
async function editInfo() {
  const data: any = await useHttp(
    "/QaOrder/M83UpdateQaOrder",
    "put",
    outSourceInfo.value
  );
  getOutSourceData();
  editDialog.value = false;
}
function showDel(item: any) {
  outSourceInfo.value = { ...item };
  delDialog.value = true;
}
async function delInfo() {
  const data: any = await useHttp(
    "/QaOrder/M84DeleteQaOrder",
    "delete",
    undefined,
    {
      ids: outSourceInfo.value.id,
    }
  );
  getOutSourceData();
  delDialog.value = false;
}
//新增委外工序
function showAdd() {
  selectedRows.value = [];
  getDispatch();
  addDialog.value = true;
}

//派工单表头
let orderHeader = ref<any[]>([
  {
    title: "派工单",
    align: "center",
    key: "dispatch_order",
    sortable: false,
    filterable: true,
  },
  {
    title: "物料编号",
    align: "center",
    key: "material_id",
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
    title: "工序",
    align: "center",
    key: "procedure_description",
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
    title: "单位",
    align: "center",
    key: "unit",
    sortable: false,
    filterable: true,
  },
]);
//多选
let selectedRows = ref<any[]>([]);
//存储派工单数据
let tableData = ref<any[]>([]);
//搜索条件
let searchDo = ref<any>("");
let searchName2 = ref<any>("");
let searchCode = ref<any>("");
//获取数据库数据
async function getDispatch() {
  const data: any = await useHttp(
    "/ProductionRecode/M21ProductionRecodeList",
    "get",
    undefined,
    {
      PageIndex: 1,
      PageSize: 100000,
      SortedBy: "id",
      SortType: "1",
      status: "已排产待执行",
      dispatch_order: searchDo.value,
      material_name: searchName2.value,
      material_id: searchCode.value,
      defaul_outsource: "Y",
    }
  );
  tableData.value = data.data.pageList.sort((a: any, b: any) => {
    return b.id - a.id;
  });
}

function filter2() {
  getDispatch();
}
function resetFilter2() {
  searchDo.value = "";
  searchName2.value = "";
  searchCode.value = "";
  getDispatch();
}
let tabArr = ref<any[]>([]);
let tabArr1 = ref<any[]>([]);
const name = useCookie("name");
function addInfo() {
  tabArr.value = [];
  tabArr1.value = [];
  selectedRows.value.forEach((item: any) => {
    tabArr.value.push({
      outsourced_head_code: code.value,
      procedure_id: item.procedure_id,
      workorder_hid: item.workorder_hid,
      workorder_did: item.workorder_did,
      dispatch_order: item.dispatch_order,
      material_id: item.material_id,
      material_name: item.material_name,
      material_spec: "",
      acceptance_criteria: "",
      outsourced_quantity: item.planned_quantity,
      received_quantity: "0",
      unit: item.unit,
      outsourced_status: "发出",
      outsourced_start_date: new Date().toISOString().substring(0, 10),
      outsourced_finish_date: null,
      material_weight: 0,
      procedure_description: item.procedure_description,
    });
    tabArr1.value.push({
      dispatch_order: item.dispatch_order,
      employee_id: "18",
      employee_name: name,
      work_center_id: item.work_center_id,
      scan_time: new Date().toISOString().substring(0, 10),
      scan_action: "开始",
      procedure_id: item.procedure_id,
      unit: item.unit,
      workorder_hid: item.workorder_hid,
      workorder_did: item.workorder_did,
      material_name: item.material_name,
      material_id: item.material_id,
    });
  });
  addShowDialog.value = true;
}
async function addDetailSucces() {
  const data: any = await useHttp(
    "/QaOrder/M82AddQaOrder",
    "post",
    tabArr.value
  );

  await useHttp(
    "/MesProcessScanRecord/M86AddProcessScanRecordList",
    "post",
    tabArr1.value
  );

  getOutSourceData();
  addShowDialog.value = false;
  addDialog.value = false;
}

let banInfo = ref<any>(null);
// 取消委外
function showBan(item: any) {
  outSourceInfo.value = { ...item };

  banInfo.value = {
    outsourced_head_code: item.outsourced_head_code,
    dispatch_order: item.dispatch_order,
    employee_id: "18",
    employee_name: name,
    work_center_id: item.work_center_id,
    scan_time: new Date().toISOString().substring(0, 10),
    scan_action: "异常暂停",
    procedure_id: item.procedure_id,
    unit: item.unit,
    workorder_hid: item.workorder_hid,
    workorder_did: item.workorder_did,
    material_name: item.material_name,
    material_id: item.material_id,
  };
  banDialog.value = true;
}
// 取消委外
async function banSuccess() {
  outSourceInfo.value.outsourced_status = "异常暂停";
  const data: any = await useHttp(
    "/QaOrder/M83UpdateQaOrder",
    "put",
    outSourceInfo.value
  );
  // 生成暂停的扫描记录
  await useHttp("/MesProcessScanRecord/M86AddProcessScanRecordList", "post", [
    banInfo.value,
  ]);
  getOutSourceData();
  banDialog.value = false;
}
let stepInfo = ref<any>(null);
// 工序回退
function showStep(item: any) {
  outSourceInfo.value = { ...item };
  stepInfo.value = {
    dispatch_order: item.dispatch_order,
    employee_id: "18",
    employee_name: name,
    work_center_id: item.work_center_id,
    scan_time: new Date().toISOString().substring(0, 10),
    scan_action: "开始",
    procedure_id: item.procedure_id,
    unit: item.unit,
    workorder_hid: item.workorder_hid,
    workorder_did: item.workorder_did,
    material_name: item.material_name,
    material_id: item.material_id,
  };
  stepDialog.value = true;
}
// 工序回退
async function stepSuccess() {
  outSourceInfo.value.outsourced_status = "发出";
  const data: any = await useHttp(
    "/QaOrder/M83UpdateQaOrder",
    "put",
    outSourceInfo.value
  );
  // 生成开始的扫描记录
  await useHttp("/MesProcessScanRecord/M86AddProcessScanRecordList", "post", [
    stepInfo.value,
  ]);
  getOutSourceData();
  stepDialog.value = false;
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="5">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6">委外登记</v-toolbar>
        <v-row class="ma-1">
          <v-col cols="6">
            <v-text-field
              label="供应商"
              v-model="searchSupplier"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="委外单号"
              v-model="searchSupplier"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn
              color="blue-darken-2"
              class="mr-2 mt-2"
              size="default"
              @click="filter1"
              >查询</v-btn
            >
            <v-btn
              color="red"
              class="mr-2 mt-2"
              size="default"
              @click="resetFilter1"
              >重置查询</v-btn
            >
            <v-btn
              color="blue-darken-2"
              class="mr-2 mt-2"
              size="default"
              @click="showAddHeader"
            >
              新增委外
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-data-table
              hover
              :items-per-page="10"
              :headers="headerList"
              :items="headerOrderList"
              style="overflow-x: auto; white-space: nowrap"
              fixed-footer
              fixed-header
              height="610"
              no-data-text="没有找到符合的数据"
              @click:row="showDetail"
            >
              <template v-slot:item.action="{ item }">
                <!-- 修改 -->
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-3"
                  @click="showEditHeader(item.raw)"
                >
                  fa-solid fa-pen
                </v-icon>
                <!-- 删除 -->
                <v-icon
                  color="red"
                  size="small"
                  @click="showDelHeader(item.raw)"
                >
                  fa-solid fa-trash
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="7">
      <v-card class="h-100">
        <v-toolbar class="text-h6 pl-6" v-if="code"
          >【{{ code }}】登记明细</v-toolbar
        >
        <v-toolbar class="text-h6 pl-6" v-else>登记明细</v-toolbar>
        <v-row class="ma-1">
          <v-col cols="3">
            <v-text-field
              label="委外物料"
              v-model="searchName"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="派工单号"
              v-model="searchDispatch"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field
              label="最早开始日期"
              v-model="searchStartDate"
              type="date"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="最晚开始日期"
              type="date"
              v-model="searchEndDate"
              variant="outlined"
              density="compact"
              hide-details
              class="mt-2"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
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
            <v-btn
              color="blue-darken-2"
              class="mr-2 mt-2"
              size="default"
              @click="showAdd"
              v-if="code"
            >
              新增明细
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-data-table
              hover
              :items-per-page="10"
              :headers="headers"
              :items="outSourceList"
              style="overflow-x: auto; white-space: nowrap"
              fixed-footer
              fixed-header
              height="610"
              no-data-text="没有找到符合的数据"
            >
              <template v-slot:item.action="{ item }">
                <!-- 修改 -->
                <v-icon
                  color="blue"
                  size="small"
                  class="mr-3"
                  v-if="item.raw.outsourced_status === '发出'"
                  @click="showEdit(item.raw)"
                >
                  fa-solid fa-pen
                </v-icon>
                <!-- 禁用 -->
                <v-icon
                  color="red"
                  size="small"
                  @click="showBan(item.raw)"
                  v-if="item.raw.outsourced_status === '发出'"
                >
                  fa-solid fa-ban
                </v-icon>
                <v-icon
                  color="blue"
                  size="small"
                  @click="showStep(item.raw)"
                  v-if="item.raw.outsourced_status === '异常暂停'"
                >
                  fa-solid fa-backward-step
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- 新增委外头 -->
    <v-dialog v-model="addHeaderDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增委外工序 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addHeaderDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="供应商"
                v-model="headerInfo.supplier_name"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="重量"
                v-model="headerInfo.total_weight"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="开始时间"
                v-model="headerInfo.outsourced_start_date"
                clearable
                hide-details
                type="date"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addSuccess"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="addHeaderDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 修改委外头 -->
    <v-dialog v-model="editHeaderDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改委外表头 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editHeaderDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="供应商"
                v-model="headerInfo.supplier_name"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="重量"
                v-model="headerInfo.total_weight"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="开始时间"
                v-model="headerInfo.outsourced_start_date"
                clearable
                hide-details
                type="date"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="editHeader"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="editHeaderDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- 删除委外工序 -->
    <v-dialog v-model="delHeaderDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除委外登记 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="delHeaderDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center">
          您确定要删除这条委外工序吗?
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="delHeader()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="delHeaderDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- 新增委外工序 -->
    <v-dialog v-model="addDialog" min-width="1400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增委外工序 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="派工单号"
                variant="outlined"
                density="compact"
                hide-details
                v-model="searchDo"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="物料名称"
                v-model="searchName2"
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="物料编码"
                v-model="searchCode"
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn
                color="blue-darken-2"
                class="mr-2"
                size="large"
                @click="filter2()"
                >查询</v-btn
              >
              <v-btn
                color="red"
                class="mr-2"
                size="large"
                @click="resetFilter2()"
              >
                重置查询
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
              <v-data-table
                hover
                :items-per-page="10"
                v-model="selectedRows"
                return-object
                show-select
                :headers="orderHeader"
                :items="tableData"
                style="overflow-x: auto; white-space: nowrap"
                fixed-footer
                fixed-header
                height="400"
                no-data-text="没有找到符合的数据"
              >
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addInfo"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="addDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 修改委外工序 -->
    <v-dialog v-model="editDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改委外工序 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="说明验收标准"
                v-model="outSourceInfo.acceptance_criteria"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="委外数量"
                v-model="outSourceInfo.outsourced_quantity"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="单位"
                v-model="outSourceInfo.unit"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="开始日期"
                type="date"
                autofocus
                variant="outlined"
                density="compact"
                v-model="outSourceInfo.outsourced_start_date"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mt-4 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="editInfo"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="editDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除委外工序 -->
    <v-dialog v-model="delDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除工序 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="delDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center">
          您确定要删除这条委外工序吗?
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="delInfo()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="delDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 检查新增委外工序信息 -->
    <v-dialog v-model="addShowDialog" min-width="1400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 检查新增委外工序信息 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addShowDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-row v-for="(item, index) in tabArr">
            <v-col cols="2">
              <v-text-field
                label="物料名称"
                readonly
                variant="outlined"
                density="compact"
                autofocus
                v-model="item.material_name"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="物料编码"
                variant="outlined"
                density="compact"
                autofocus
                v-model="item.material_id"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="验收标准"
                autofocus
                variant="outlined"
                density="compact"
                v-model="item.acceptance_criteria"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="数量"
                autofocus
                variant="outlined"
                density="compact"
                v-model="item.outsourced_quantity"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="工序"
                autofocus
                variant="outlined"
                density="compact"
                v-model="item.procedure_description"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="委外日期"
                type="date"
                autofocus
                variant="outlined"
                density="compact"
                v-model="item.outsourced_start_date"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addDetailSucces()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="addShowDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- 工序禁用 -->
    <v-dialog v-model="banDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 工序禁用 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="banDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center">
          您确定要禁用这条委外记录吗?
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="banSuccess()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="banDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- 工序回退 -->
    <v-dialog v-model="stepDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 工序回退 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="stepDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center">
          您确定要回退这条委外记录吗?
        </v-card-text>
        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="stepSuccess()"
          >
            确认
          </v-btn>
          <v-btn color="grey" size="large" @click="stepDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
  <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
    </template>
  </v-snackbar>
</template>
<style scoped>
.custom-header-class {
  background-color: #f9f9f9;
  color: #666;
  /* 更多自定义样式 */
}
</style>
