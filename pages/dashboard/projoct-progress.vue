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
      PageSize: "30",
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
                  工单数量：
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
    <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>
<style scoped>
/* 文本框 */
.box-input {
  position: relative;
}

.border {
  background-image: linear-gradient(
    to right bottom,
    #e300ff,
    #ff00aa,
    #ff5956,
    #ffb900,
    #fffe00
  );
  box-shadow: -25px -10px 30px -5px rgba(225, 0, 255, 0.5),
    25px -10px 30px -5px rgba(255, 0, 212, 0.5),
    25px 10px 30px -5px rgba(255, 174, 0, 0.5),
    -25px 10px 30px -5px rgba(255, 230, 0, 0.5);
  padding: 4px;
}

.input {
  background-color: #212121;
  max-width: 250px;
  height: 40px;
  padding: 0 19px 0 10px;
  font-size: 1.1em;
  position: relative;
  border: none;
  color: white;
  outline: 0;
  overflow: hidden;
}

.box-input::after,
.box-input::before {
  content: "";
  width: 130px;
  height: 30px;
  position: absolute;
  z-index: -1;
}

.box-input::after {
  bottom: 0;
  right: 0;
}

.box-input::before {
  top: 0;
  left: 0;
}

.input::placeholder {
  transition: all 0.5s ease-in, transform 0.2s ease-in 0.6s;
}

.input:focus::placeholder {
  padding-left: 165px;
  transform: translateY(-50px);
}

/* 按钮 */
.btn-class-name {
  --primary: 255, 90, 120;
  --secondary: 150, 50, 60;
  width: 60px;
  height: 50px;
  border: none;
  outline: none;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  outline: 10px solid rgb(var(--primary), 0.5);
  border-radius: 100%;
  position: relative;
  transition: 0.3s;
}

.btn-class-name .back {
  background: rgb(var(--secondary));
  border-radius: 100%;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.btn-class-name .front {
  background: linear-gradient(
    0deg,
    rgba(var(--primary), 0.6) 20%,
    rgba(var(--primary)) 50%
  );
  box-shadow: 0 0.5em 1em -0.2em rgba(var(--secondary), 0.5);
  border-radius: 100%;
  position: absolute;
  border: 1px solid rgb(var(--secondary));
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: inherit;
  transform: translateY(-15%);
  transition: 0.15s;
  color: rgb(var(--secondary));
}

.btn-class-name:active .front {
  transform: translateY(0%);
  box-shadow: 0 0;
}
</style>
