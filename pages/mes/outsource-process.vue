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

let addShowDialog = ref<boolean>(false);
let banDialog = ref<boolean>(false);
let stepDialog = ref<boolean>(false);
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
    title: "供应商",
    align: "center",
    key: "supplier_id",
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
    title: "重量",
    align: "center",
    key: "material_weight",
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
    key: "received_quantity",
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
    title: "委外开始日期",
    align: "center",
    key: "outsourced_start_date",
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
let searchSupplier = ref<any>("");
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
  getOutSourceData();
});
//查询
function filter() {
  getOutSourceData();
}
//重置查询
function resetFilter() {
  searchSupplier.value = "";
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
      supplier_id: "",
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
  let isInvalid = false; // 添加一个标志变量来跟踪是否有不合法的数据

  for (const item of tabArr.value) {
    if (
      item.procedure_description === "表面处理" &&
      item.material_weight === 0
    ) {
      isInvalid = true; // 设置标志为true表示找到了不合法的数据
      break; // 跳出循环
    }
  }
  if (isInvalid) {
    return setSnackbar("red", "表面处理的工单需要重量");
  } else {
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
}
let banInfo = ref<any>(null);
// 取消委外
function showBan(item: any) {
  outSourceInfo.value = { ...item };
  banInfo.value = {
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
    <v-col cols="2">
      <v-text-field
        label="供应商"
        v-model="searchSupplier"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="委外物料"
        v-model="searchName"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="派工单号"
        v-model="searchDispatch"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        label="状态"
        v-model="searchStatus"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-2"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
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
    <v-col cols="2">
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
      <v-btn color="red" class="mr-2 mt-2" size="default" @click="resetFilter"
        >重置查询</v-btn
      >
      <v-btn
        color="blue-darken-2"
        class="mr-2 mt-2"
        size="default"
        @click="showAdd"
      >
        新增委外
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
                label="供应商"
                v-model="outSourceInfo.supplier_id"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
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
                label="供应商"
                variant="outlined"
                density="compact"
                autofocus
                v-model="item.supplier_id"
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
                label="重量"
                autofocus
                variant="outlined"
                density="compact"
                v-model="item.material_weight"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="日期"
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
