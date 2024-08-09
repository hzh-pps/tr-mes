<script setup lang="ts">
// 工作中心的任务数据
const produceCenterList = ref<any[]>([]);
// const workList = ref<any[]>([]);
// 获取工作中心任务数据
async function getWorkProduceCenter() {
  const data: any = await useHttps(
    "/Board/M90GetWorkcenterInfo",
    "get",
    undefined
  );
  // const data2: any = await useHttps(
  //   "/Board/M93GetWorkcenterInfo",
  //   "get",
  //   undefined
  // );
  produceCenterList.value = data.data;
  // workList.value = data2.data;
  produceCenterList.value = produceCenterList.value.sort((a: any, b: any) => {
    if (a.type < b.type) {
      return 1;
    }
    if (a.type > b.type) {
      return -1;
    }
    return 0;
  });
}

onMounted(() => {
  getWorkProduceCenter();
});
</script>
<template>
  <div class="moduleFirst">
    <v-carousel
      height="auto"
      :show-arrows="false"
      hide-delimiters
      cycle
      interval="5000"
    >
      <v-carousel-item>
        <ul>
          <li
            v-for="(item, index) in produceCenterList.slice(0, 8)"
            :key="index"
          >
            <span class="moduleFirst-title">{{ item.work_center_name }}</span>
            <span class="moduleFirst-text">
              已排产工单：<span
                class="moduleFirst-num"
                :style="{
                  color:
                    item.type === '钣金'
                      ? '#40FAEE'
                      : item.type === '机加工'
                      ? '#458AE6'
                      : item.type === '装配'
                      ? '#F46827'
                      : '#bbcdc5',
                }"
                >{{ item.qutstanding }}</span
              >
            </span>
            <span class="moduleFirst-text">
              已生产工单：<span
                class="moduleFirst-num"
                :style="{
                  color:
                    item.type === '钣金'
                      ? '#40FAEE'
                      : item.type === '机加工'
                      ? '#458AE6'
                      : item.type === '装配'
                      ? '#F46827'
                      : '#bbcdc5',
                }"
                >{{ item.completed }}</span
              >
            </span>
          </li>
        </ul>
      </v-carousel-item>
      <v-carousel-item>
        <ul>
          <li
            v-for="(item, index) in produceCenterList.slice(8, 16)"
            :key="index"
          >
            <span class="moduleFirst-title">{{ item.work_center_name }}</span>
            <span
              class="moduleFirst-text"
              :style="{
                color:
                  item.type === '钣金'
                    ? '#40FAEE'
                    : item.type === '机加工'
                    ? '#458AE6'
                    : item.type === '装配'
                    ? '#F46827'
                    : '#bbcdc5',
              }"
            >
              已排产工单：<span class="moduleFirst-num">{{
                item.qutstanding
              }}</span>
            </span>
            <span
              class="moduleFirst-text"
              :style="{
                color:
                  item.type === '钣金'
                    ? '#40FAEE'
                    : item.type === '机加工'
                    ? '#458AE6'
                    : item.type === '装配'
                    ? '#F46827'
                    : '#bbcdc5',
              }"
            >
              已生产工单：<span class="moduleFirst-num">{{
                item.completed
              }}</span>
            </span>
          </li>
        </ul>
      </v-carousel-item>
    </v-carousel>
    <dv-decoration2 :dur="5" style="width: 100%; height: 5px" />
  </div>
</template>
<style scoped>
.moduleFirst ul {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(6, 30, 60, 0.5);
}
.moduleFirst ul li {
  height: 80%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: 2px solid #08396a;
  border-right: 2px solid #08396a;
}
.moduleFirst-title {
  font-size: 20px;
  margin-bottom: 10px;
}
.moduleFirst-num {
  font-size: 28px;
  font-weight: 600;
}
</style>
