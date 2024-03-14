<script setup lang="ts">
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
//单位
let units = ref<any[]>([
  { id: "1", name: "PCS" },
  { id: "2", name: "米" },
  { id: "3", name: "毫米" },
  { id: "4", name: "张" },
  { id: "5", name: "KG" },
  { id: "6", name: "瓶（桶）" },
  { id: "7", name: "盒（包）" },
  { id: "8", name: "双（对）" },
  { id: "9", name: "平方米" },
  { id: "10", name: "卷" },
  { id: "11", name: "台" },
  { id: "12", name: "套" },
  { id: "13", name: "件" },
  { id: "14", name: "根" },
  { id: "15", name: "个" },
  { id: "16", name: "袋" },
  { id: "17", name: "立方" },
  { id: "18", name: "升" },
  { id: "19", name: "支" },
  { id: "20", name: "箱" },
  { id: "21", name: "盒" },
  { id: "22", name: "节" },
  { id: "23", name: "把" },
  { id: "24", name: "片" },
  { id: "25", name: "公斤" },
  { id: "26", name: "千公斤" },
  { id: "27", name: "包" },
  { id: "28", name: "本" },
]);
let project = ref<string>("ZM23247-0");
watch(project, function () {
  getProjectProgress();
});
let addDialog = ref<boolean>(false);
let editDialog = ref<boolean>(false);
let deleteDialog = ref<boolean>(false);
let projectProgress = ref<any[]>([]);
// 获取数据的数据
async function getProjectProgress() {
  const data: any = await useHttp(
    "/MesProjectProgress/M117GetProjectProgressList",
    "get",
    undefined,
    {
      project_id: project.value,
      material_name: "",
      material_code: "",
      equipment_code: "",
      work_order_type: "",
      start_time: "",
      end_time: "",
      status: "",
      PageIndex: "1",
      PageSize: "3000",
      SortedBy: "id",
      SortType: "1",
    }
  );
  projectProgress.value = data.data.pageList.map((item: any) => {
    item.delivery_date = item.delivery_date.substring(0, 10);
    return item;
  });
}
onMounted(() => {
  getProjectProgress();
});
function showList() {
  getProjectProgress();
}
let machine_proportion = ref<number>(5);
let assemble_proportion = ref<number>(5);
watch(machine_proportion, function () {
  assemble_proportion.value = 10 - machine_proportion.value;
});
watch(assemble_proportion, function () {
  machine_proportion.value = 10 - assemble_proportion.value;
});
// 项目进度
let projectInfo = ref<any>(null);
function addProject() {
  projectInfo.value = {
    project_id: project.value,
    material_name: "",
    material_code: "",
    equipment_code: "",
    delivery_date: "",
    total_quantity: "",
    completed_quantity: "0",
    machine_proportion: machine_proportion.value,
    assemble_proportion: assemble_proportion.value,
    unit: "",
    status: "未开始",
  };
  addDialog.value = true;
}
// 新增
async function addSave() {
  if (machine_proportion.value > 10 || machine_proportion.value < 0) {
    return setSnackbar("black", "加工占比必须在0到10之间");
  }
  if (assemble_proportion.value > 10 || assemble_proportion.value < 0) {
    return setSnackbar("black", "装配占比必须在0到10之间");
  }
  projectInfo.value.machine_proportion = machine_proportion.value;
  projectInfo.value.assemble_proportion = assemble_proportion.value;
  const data = await useHttp(
    "/MesProjectProgress/M118AddProjectProgressList",
    "post",
    [projectInfo.value]
  );
  if (data.code === 200) {
    setSnackbar("green", "新增成功");
    addDialog.value = false;
    getProjectProgress();
  } else {
    setSnackbar("black", "新增失败");
  }
}
// 编辑
function showEdit(item: any) {
  projectInfo.value = { ...item };
  machine_proportion.value = item.machine_proportion;
  assemble_proportion.value = item.assemble_proportion;
  editDialog.value = true;
}
async function editSave() {
  if (machine_proportion.value > 10 || machine_proportion.value < 0) {
    return setSnackbar("black", "加工占比必须在0到10之间");
  }
  if (assemble_proportion.value > 10 || assemble_proportion.value < 0) {
    return setSnackbar("black", "装配占比必须在0到10之间");
  }
  projectInfo.value.machine_proportion = machine_proportion.value;
  projectInfo.value.assemble_proportion = assemble_proportion.value;
  const data = await useHttp(
    "/MesProjectProgress/M119UpdateProjectProgressList",
    "put",
    [projectInfo.value]
  );
  if (data.code === 200) {
    setSnackbar("green", "编辑成功");
    editDialog.value = false;
    getProjectProgress();
  } else {
    setSnackbar("black", "编辑失败");
  }
}
// 确定删除
async function deleteSave() {
  const data = await useHttp(
    "/MesProjectProgress/M120DeleteProjectProgressList",
    "delete",
    undefined,
    {
      ids: [projectInfo.value.id],
    }
  );
  if (data.code === 200) {
    setSnackbar("green", "删除成功");
    deleteDialog.value = false;
    getProjectProgress();
  } else {
    setSnackbar("black", "删除失败");
  }
}
let productInfo = ref<any[]>([]);
// 获取当前设备的工单类型和数量
async function getProductList(item: any) {
  const data: any = await useHttp(
    "/MesProjectProgress/M121GetProjectWorkOrder",
    "get",
    undefined,
    {
      project_id: item.project_id,
      material_code: item.equipment_code,
    }
  );
  productInfo.value = data.data;
}
function calculateProgress(item: any) {
  let machineProgress = 0;
  let assembleProgress = 0;

  // 避免除以0的情况
  if (item.machine_total_quantity > 0) {
    machineProgress =
      item.machine_quantity_completed / item.machine_total_quantity;
  }

  if (item.assemble_total_quantity > 0) {
    assembleProgress =
      item.assemble_quantity_completed / item.assemble_total_quantity;
  }

  // 如果加工总量和装配总量都为0，则直接返回进度为0%
  if (item.machine_total_quantity === 0 && item.assemble_total_quantity === 0) {
    return "0%";
  }

  // 计算总进度
  const totalProgress =
    (machineProgress * item.machine_proportion +
      assembleProgress * item.assemble_proportion) /
    (item.machine_proportion + item.assemble_proportion);

  return Math.round(totalProgress * 100) + "%";
}

// 工单明细详情和派工单详情
let detailDialog = ref<boolean>(false);
let detailList = ref<any[]>([]);
async function showDetail(item: any) {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M122Getprogress",
    "get",
    undefined,
    {
      workorder_dids: item.workorder_did,
    }
  );
  detailList.value = data.data;
  console.log(detailList.value);
  detailDialog.value = true;
}
</script>
<template>
  <v-row class="ma-2">
    <v-col cols="4">
      <v-text-field v-model="project" label="输入查询的项目号"></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-btn
        color="blue-darken-2"
        class="mr-2"
        size="large"
        @click="addProject()"
      >
        新增计划
      </v-btn>
    </v-col>
    <!-- 显示数据 -->
    <v-col cols="12">
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(element, index) in projectProgress"
          :key="index"
          @click="getProductList(element)"
          v-if="projectProgress.length"
        >
          <v-expansion-panel-title>
            <!-- 工单明细编号 -->
            <div style="flex-basis: 12%">
              设备名称：
              {{ element.material_name }}
            </div>
            <!-- 产出料 -->
            <div style="flex-basis: 10%">
              <div>设备编号：{{ element.equipment_code }}</div>
            </div>
            <div class="mt-2" style="flex-basis: 10%">
              总数量：{{ element.total_quantity }}
            </div>
            <!-- 计划产出料数量 -->
            <div style="flex-basis: 13%">
              计划日期：
              {{ element.delivery_date }}
            </div>
            <div style="flex-basis: 25%">
              加工与装配占比:{{ element.machine_proportion }} ：{{
                element.assemble_proportion
              }}
            </div>
            <!-- 进度 -->
            <div style="flex-basis: 15%">
              当前进度:
              <v-progress-circular
                :model-value="calculateProgress(element)"
                :size="38"
                color="deep-orange-lighten-2"
              >
                <span style="font-size: 12px">{{
                  calculateProgress(element)
                }}</span>
              </v-progress-circular>
            </div>
            <!-- 操作 -->
            <div style="flex-basis: 15%">
              <v-icon
                color="blue"
                size="default"
                class="mr-3"
                @click.stop="showEdit(element)"
              >
                fa-solid fa-pen
              </v-icon>

              <v-icon
                color="red"
                size="default"
                class="ml-2"
                @click.stop="
                  projectInfo = { ...element };
                  deleteDialog = true;
                "
              >
                fa-solid fa-trash
              </v-icon>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-list
              density="compact"
              class="ma-2 elevation-2 rounded-lg"
              v-if="productInfo.length"
              v-for="(item, index) in productInfo"
              :key="index"
            >
              <div class="d-flex pa-2">
                <div
                  class="text-body-1 text-blue-darken-1"
                  style="flex-basis: 12%"
                >
                  工单类型：
                  <span
                    class="text-blue-grey-lighten-2"
                    style="text-decoration: underline"
                  >
                    {{ item.workorder_type }}
                  </span>
                </div>
                <div
                  style="flex-basis: 12%"
                  class="text-body-1 text-blue-darken-1"
                >
                  工单明细数：
                  <span class="" style="text-decoration: underline">
                    {{ item.detail_count }}
                  </span>
                </div>
                <div
                  style="flex-basis: 12%"
                  class="text-body-1 text-blue-darken-1"
                >
                  计划产出料：
                  <span class="" style="text-decoration: underline">
                    {{ item.total_quantity }}
                  </span>
                </div>
                <div
                  style="flex-basis: 12%"
                  class="text-body-1 text-blue-darken-1"
                >
                  完成数量：
                  <span
                    class="text-blue-grey-lighten-2"
                    style="text-decoration: underline"
                  >
                    {{ item.quantity_completed }}
                  </span>
                </div>
                <!-- 进度 -->
                <div style="flex-basis: 15%">
                  当前进度:
                  <v-progress-circular
                    :model-value="
                      item.quantity_completed === 0
                        ? '0%'
                        : item.quantity_completed > item.total_quantity
                        ? '100%'
                        : Math.round(
                            (item.quantity_completed / item.total_quantity) *
                              100
                          ) + '%'
                    "
                    :size="38"
                    color="deep-orange-lighten-2"
                  >
                    <span style="font-size: 12px">
                      {{
                        item.quantity_completed === 0
                          ? 0 + "%"
                          : item.quantity_completed > item.total_quantity
                          ? "100%"
                          : Math.round(
                              (item.quantity_completed / item.total_quantity) *
                                100
                            ) + "%"
                      }}</span
                    >
                  </v-progress-circular>
                </div>

                <div
                  style="flex-basis: 12%"
                  class="text-body-1 text-blue-darken-1 d-flex justify-end"
                >
                  <v-btn
                    variant="text"
                    color="blue-darken-2"
                    @click="showDetail(item)"
                    ><v-icon class="mr-2 mb-1"
                      >fa-regular fa-hand-pointer</v-icon
                    >点击查看明细详情</v-btn
                  >
                </div>
              </div>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel v-else>
          <div class="text-center text-h6 ml-3 text-grey">当前项目没有计划</div>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <!-- 新增 -->
    <v-dialog v-model="addDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 新增计划 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="addDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-text-field
            v-model="projectInfo.project_id"
            label="项目号"
          ></v-text-field>
          <v-text-field
            label="产品名称"
            v-model="projectInfo.material_name"
          ></v-text-field>
          <v-text-field
            v-model="projectInfo.equipment_code"
            label="设备号"
          ></v-text-field>
          <v-text-field
            v-model="projectInfo.total_quantity"
            label="计划数量"
          ></v-text-field>
          <v-select
            label="单位"
            :items="units"
            v-model="projectInfo.unit"
            item-title="name"
          ></v-select>
          <v-text-field
            label="加工占比"
            v-model="machine_proportion"
            :rules="[(v) => (v >= 0 && v <= 10) || '加工占比必须在0到10之间']"
          />
          <v-text-field
            label="装配占比"
            v-model="assemble_proportion"
            :rules="[(v) => (v >= 0 && v <= 10) || '装配占比必须在0到10之间']"
          />
          <v-text-field
            label="计划交付日期"
            v-model="projectInfo.delivery_date"
            type="date"
          />
          <v-text-field
            label="状态"
            v-model="projectInfo.status"
          ></v-text-field>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="addSave()"
          >
            确认新增
          </v-btn>
          <v-btn color="grey" size="large" @click="addDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 修改 -->
    <v-dialog v-model="editDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 修改计划 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="editDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          <v-text-field
            v-model="projectInfo.project_id"
            label="项目号"
          ></v-text-field>
          <v-text-field
            label="产品名称"
            v-model="projectInfo.material_name"
          ></v-text-field>
          <v-text-field
            v-model="projectInfo.equipment_code"
            label="设备号"
          ></v-text-field>
          <v-text-field
            v-model="projectInfo.total_quantity"
            label="计划数量"
          ></v-text-field>
          <v-select
            label="单位"
            :items="units"
            v-model="projectInfo.unit"
            item-title="name"
          ></v-select>
          <v-text-field
            label="加工占比"
            v-model="machine_proportion"
            :rules="[(v) => (v >= 0 && v <= 10) || '加工占比必须在0到10之间']"
          />
          <v-text-field
            label="装配占比"
            v-model="assemble_proportion"
            :rules="[(v) => (v >= 0 && v <= 10) || '装配占比必须在0到10之间']"
          />
          <v-text-field
            label="计划交付日期"
            v-model="projectInfo.delivery_date"
            type="date"
          />
          <v-text-field
            label="状态"
            v-model="projectInfo.status"
          ></v-text-field>
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="editSave()"
          >
            确认新增
          </v-btn>
          <v-btn color="grey" size="large" @click="editDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 删除 -->
    <v-dialog v-model="deleteDialog" min-width="400px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 删除计划 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="mt-4">
          您确定要删除当前这一项的计划么？
        </v-card-text>

        <div class="d-flex justify-end mr-6 mb-4">
          <v-btn
            color="blue-darken-2"
            size="large"
            class="mr-2"
            @click="deleteSave()"
          >
            确认新增
          </v-btn>
          <v-btn color="grey" size="large" @click="deleteDialog = false">
            取消
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- 工单明细详情和派工单详情 -->
    <v-dialog v-model="detailDialog" min-width="1600px" width="560px">
      <v-card>
        <v-toolbar color="blue">
          <v-toolbar-title> 工单明细详情 </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="detailDialog = false">
            <v-icon>fa-solid fa-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="mt-4">
          <v-list v-for="(element, index) in detailList" :key="index">
            <v-list-item>
              <v-list-item-title>
                <div class="d-flex">
                  <!-- 工单明细编号 -->
                  <div style="flex-basis: 22%">
                    工单明细编号：
                    {{ element.mes_workorderdetaildata.workorder_did }}
                  </div>
                  <!-- 产出料 -->
                  <div style="flex-basis: 30%">
                    <div>
                      产出料：{{ element.mes_workorderdetaildata.mdescription }}
                    </div>
                    <div class="mt-2">
                      图纸号：{{ element.mes_workorderdetaildata.mcode }}
                    </div>
                  </div>

                  <!-- 计划产出料数量 -->
                  <div style="flex-basis: 13%">
                    计划数量：
                    {{ element.mes_workorderdetaildata.planned_quantity }}
                  </div>
                  <!-- 计划交付日期 -->
                  <div style="flex-basis: 20%">
                    计划交付：
                    <span
                      :style="{
                        backgroundColor:
                          element.reported_quantity <
                          element.planned_total_quantity
                            ? 'red'
                            : '',
                        color:
                          element.reported_quantity <
                          element.planned_total_quantity
                            ? 'white'
                            : '',
                      }"
                    >
                      {{
                        element.mes_workorderdetaildata.estimated_delivery_date
                      }}
                    </span>
                  </div>
                  <!-- 进度 -->
                  <div style="flex-basis: 15%">
                    当前进度:
                    <v-progress-circular
                      :model-value="
                        element.planned_total_quantity === 0
                          ? '0%'
                          : element.reported_quantity >
                            element.planned_total_quantity
                          ? '100%'
                          : Math.round(
                              (element.reported_quantity /
                                element.planned_total_quantity) *
                                100
                            ) + '%'
                      "
                      :size="38"
                      color="deep-orange-lighten-2"
                    >
                      <span style="font-size: 12px">
                        {{
                          element.planned_total_quantity === 0
                            ? 0 + "%"
                            : element.reported_quantity >
                              element.planned_total_quantity
                            ? "100%"
                            : Math.round(
                                (element.reported_quantity /
                                  element.planned_total_quantity) *
                                  100
                              ) + "%"
                        }}</span
                      >
                    </v-progress-circular>
                  </div>
                </div>
              </v-list-item-title>
              <v-list-item-subtitle
                v-for="(
                  item_, index_
                ) in element.productionrecode_Response_list"
                :key="index_"
              >
                <template v-slot:default>
                  <div class="d-flex align-center">
                    <div style="flex-basis: 10%">
                      进度：<v-progress-circular
                        :model-value="
                          item_.reported_quantity > item_.planned_quantity
                            ? '100%'
                            : Math.round(
                                (item_.reported_quantity /
                                  item_.planned_quantity) *
                                  100
                              ) + '%'
                        "
                        :size="38"
                        color="deep-orange-lighten-2"
                      >
                        <span style="font-size: 12px">
                          {{
                            item_.reported_quantity > item_.planned_quantity
                              ? "100%"
                              : Math.round(
                                  (item_.reported_quantity /
                                    item_.planned_quantity) *
                                    100
                                ) + "%"
                          }}</span
                        >
                      </v-progress-circular>
                    </div>

                    <div style="flex-basis: 15%" v-if="item_.dispatch_order">
                      派工单号：{{ item_.dispatch_order }}
                    </div>
                    <div style="flex-basis: 15%" v-else>
                      派工单号：任务未派工
                    </div>
                    <div style="flex-basis: 10%">
                      工序顺序：{{ item_.procedure_order_id }}
                    </div>
                    <div
                      v-if="item_.reported_quantity >= item_.planned_quantity"
                      style="flex-basis: 22%"
                    >
                      计划日期：
                      <span>
                        {{ item_.planned_completion_time }}
                      </span>
                    </div>
                    <div v-else style="flex-basis: 22%">
                      计划日期：
                      <span
                        :style="{
                          backgroundColor:
                            new Date(
                              element.mes_workorderdetaildata.estimated_delivery_date
                            ) < new Date()
                              ? 'red'
                              : '',
                          color:
                            new Date(
                              element.mes_workorderdetaildata.estimated_delivery_date
                            ) < new Date()
                              ? 'white'
                              : '',
                        }"
                      >
                        {{ item_.planned_completion_time }}
                      </span>
                    </div>
                    <div style="flex-basis: 18%">
                      工序：[{{ item_.procedure_description }}]
                    </div>
                    <div style="flex-basis: 10%">
                      委外：{{ item_.defaul_outsource === "N" ? "否" : "是" }}
                    </div>
                    <div style="flex-basis: 12%">
                      人员：{{
                        item_.reported_quantity !== 0
                          ? "已完成"
                          : item_.start_name === null
                          ? "未开始"
                          : item_.start_name
                      }}
                    </div>

                    <div style="flex-basis: 12%">
                      报工数量：{{
                        item_.noqa_quantity === null ? 0 : item_.noqa_quantity
                      }}
                    </div>
                    <div style="flex-basis: 12%">
                      合格数量：{{ item_.reported_quantity }}
                    </div>
                    <div style="flex-basis: 10%" v-if="item_.work_center_name">
                      @{{ item_.work_center_name }}
                    </div>
                    <div style="flex-basis: 10%" v-else>未分配工作中心</div>
                  </div>
                </template>
              </v-list-item-subtitle>
              <v-divider :thickness="4" color="black" class="mt-2"></v-divider>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>
<style scoped></style>
