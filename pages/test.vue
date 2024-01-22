<template>
  <div class="drop-area" @dragover.prevent @drop="handleDrop">
    将Excel文件拖放到这里
  </div>
  <!-- 检查新建明细 -->
  <v-dialog v-model="addDetailDialog" min-width="1400px" width="560px">
    <v-card>
      <v-toolbar color="blue">
        <v-toolbar-title> 检查新建的明细信息 </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addDetailDialog = false">
          <v-icon>fa-solid fa-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-row v-for="(item, index) in workOrderData">
          <v-col cols="2">
            <v-text-field
              label="产品名称"
              variant="outlined"
              density="compact"
              readonly
              v-model="item.product_description"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="产品编码"
              readonly
              variant="outlined"
              density="compact"
              v-model="item.product_id"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="数量"
              variant="outlined"
              density="compact"
              v-model="item.planned_quantity"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="单位"
              variant="outlined"
              density="compact"
              v-model="item.project_code"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="交付日期"
              type="date"
              variant="outlined"
              density="compact"
              v-model="item.planned_completion_time"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              label="类型"
              variant="outlined"
              density="compact"
              :items="['机加', '钣金']"
              v-model="item.workorder_type"
              multiple
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <div class="d-flex justify-end mr-6 mb-4">
        <v-btn color="blue-darken-2" size="large" class="mr-2"> 确认 </v-btn>
        <v-btn color="grey" size="large" @click="addDetailDialog = false">
          取消
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx";
let addDetailDialog = ref<boolean>(false);
let jsonData = ref<any[]>([]);
// 工单数据
let workOrderData = ref<any[]>([]);
const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  const files = e.dataTransfer?.files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      // 假设你想根据Sheet的名称来获取数据
      const sheetName = "加工件清单"; // 这里替换成你的实际Sheet名称
      const worksheet = workbook.Sheets[sheetName];
      if (worksheet) {
        jsonData.value = XLSX.utils.sheet_to_json(worksheet).slice(3);
        jsonData.value.forEach((item: any) => {
          workOrderData.value.push({
            product_id: item.__EMPTY,
            product_description: item.__EMPTY_1,
            planned_quantity: item.__EMPTY_7,
            unit: item.__EMPTY_8,
            start_date: new Date().toISOString().slice(0, 10),
            finish_date: null,
            work_hour: 0,
            status: "",
            planned_completion_time: new Date().toISOString().slice(0, 10),
            scheduled_start_date: new Date().toISOString().slice(0, 10),
            approve_date: null,
            blueprint_id: null,
            procedure: "",
            reported_quantity: 0,
            workorder_type: "机加",
            project_code: item.__EMPTY.slice(-9),
          });
        });
        console.log(workOrderData.value); // 这里是你指定Sheet名称的数据
      } else {
        console.error(`Sheet名为"${sheetName}"的Sheet不存在。`);
      }
    };
    reader.readAsBinaryString(files[0]);
    addDetailDialog.value = true;
  }
};
</script>

<style>
.drop-area {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
}
</style>
