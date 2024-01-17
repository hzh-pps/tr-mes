<script setup lang="ts">
useSeoMeta({
  // 该页面的标题
  title: "退料单",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "退料单",
  // 该页面的描述
  description: "同日 MES 系统，退料单",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，退料单",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 页面缓存
definePageMeta({
  keepalive: true,
});
let orderHeaders = ref<any[]>([]);
let orderList = ref<any[]>([]);
let selected = ref<any[]>([]);

let detailHeaders = ref<any[]>([]);
let detailList = ref<any[]>([]);
// 搜索
function filter() {
  console.log("搜索");
}
// 重置搜索
function resetFilter() {
  console.log("重置搜索");
}
</script>

<template>
  <v-row class="ma-2">
    <!-- 发货单头 -->
    <v-col cols="6">
      <v-card>
        <v-toolbar density="compact">
          <v-toolbar-title class="ml-2">退料单</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="最晚日期搜索"
                variant="outlined"
                density="compact"
                hide-details
                class="mt-2"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="最晚日期搜索"
                variant="outlined"
                density="compact"
                hide-details
                class="mt-2"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="最晚日期搜索"
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
                >搜索</v-btn
              >
              <v-btn
                color="red"
                class="mr-2 mt-2"
                size="default"
                @click="resetFilter"
                >重置搜索</v-btn
              >
              <v-btn
                color="blue-darken-2"
                class="mr-2 mt-2"
                size="default"
                @click="filter"
                >打印</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-data-table
                :headers="orderHeaders"
                :items="orderList"
                show-select
                v-model="selected"
                return-object
                :items-per-page="10"
                class="elevation-1"
              ></v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <!-- 明细 -->
    <v-col cols="6">
      <v-card>
        <v-toolbar density="compact">
          <v-toolbar-title class="ml-2">退料单明细</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="最晚日期搜索"
                variant="outlined"
                density="compact"
                hide-details
                class="mt-2"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="最晚日期搜索"
                variant="outlined"
                density="compact"
                hide-details
                class="mt-2"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="最晚日期搜索"
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
                >搜索</v-btn
              >
              <v-btn
                color="red"
                class="mr-2 mt-2"
                size="default"
                @click="resetFilter"
                >重置搜索</v-btn
              >
            </v-col>
            <v-col cols="12">
              <v-data-table
                :headers="detailHeaders"
                :items="detailList"
                :items-per-page="10"
                class="elevation-1"
              ></v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
