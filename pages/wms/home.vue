<script setup lang="ts">
//存储数据库数据
let inventoryList = ref<any[]>([]);
const ZZPList = ref<any[]>([]);
const BCPList = ref<any[]>([]);
const CPList = ref<any[]>([]);
async function getInventoryData() {
  const data: any = await useHttp("/wmsInventory/G115condition_query", "post", {
    area_code: "00",
    flag_void: "N",
  });
  inventoryList.value = data.data
    .sort((a: any, b: any) => {
      if (a.reserved01 < b.reserved01 && a.time_in < b.time_in) {
        return 1;
      }
      if (a.reserved01 > b.reserved01 && a.time_in > b.time_in) {
        return -1;
      }
      return 0;
    })
    .map((item: any) => {
      item.time_in = item.time_in.substring(0, 10);
      item.time_out = item.time_out.substring(0, 10);
      item.time_first_in = item.time_first_in.substring(0, 10);
      return item;
    })
    .filter((item: any) => {
      if (
        item.reserved01 &&
        item.reserved02 !== "模组组装" &&
        item.reserved02 !== "单机总装" &&
        item.reserved02 !== "电气装配"
      ) {
        return item;
      }
    });
  // console.log(inventoryList.value);
  ZZPList.value = inventoryList.value.filter((item: any) => {
    if (item.warehouse_code === "Z") {
      return item;
    }
  });
  BCPList.value = inventoryList.value.filter((item: any) => {
    if (item.warehouse_code === "P") {
      return item;
    }
  });
  CPList.value = inventoryList.value.filter((item: any) => {
    if (item.warehouse_code === "S") {
      return item;
    }
  });
  console.log(ZZPList.value.length, BCPList.value.length, CPList.value.length);
}
onMounted(() => {
  getInventoryData();
});
</script>

<template>
  <v-row class="ma-2 h-100">
    <div
      style="
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      "
    >
      <v-card class="mx-auto" max-width="344" link>
        <v-img
          class="align-end text-white"
          height="200"
          width="300"
          src="/zzp.png"
        >
          <v-card-title style="color: black">在制品库存</v-card-title>
        </v-img>
        <v-card-text>
          库存数量：<span class="font-num">{{ ZZPList.length }}</span>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto" max-width="344" link>
        <v-img
          class="align-end text-white"
          height="200"
          width="300"
          src="/bcp.png"
        >
          <v-card-title style="color: black">半成品库存</v-card-title>
        </v-img>
        <v-card-text>
          库存数量：<span class="font-num">{{ BCPList.length }}</span>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto" max-width="344" link>
        <v-img
          class="align-end text-white"
          height="200"
          width="300"
          src="/cp.png"
        >
          <v-card-title style="color: black">成品库存</v-card-title>
        </v-img>
        <v-card-text>
          库存数量：<span class="font-num">{{
            CPList.length
          }}</span></v-card-text
        >
      </v-card>
    </div>
  </v-row>
</template>
<style scoped>
.font-num {
  font-size: 24px;
  font-weight: 600;
  color: blueviolet;
}
</style>
