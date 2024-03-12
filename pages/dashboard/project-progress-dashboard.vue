<template>
  <v-row class="ma-2" style="display: flex; justify-content: center">
    <v-col cols="12" style="max-width: 20%">
      <v-text-field v-model="project" label="输入查询的项目号"></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-carousel
        height="400"
        show-arrows="hover"
        cycle
        hide-delimiter-background
      >
        <v-carousel-item
          v-for="(item, index) in projectProgress"
          :key="index"
          style="display: flex; align-items: center"
        >
          <v-col cols="3">
            <v-progress-circular
              :model-value="calculateProgress(item)"
              :rotate="360"
              :size="200"
              :width="20"
              color="teal"
            >
              <template v-slot:default> {{ item.material_name }} </template>
            </v-progress-circular>
          </v-col>
          <v-col cols="9">
            <Chart
              :type="chartData.type"
              v-if="loaded"
              :data="chartData"
              :options="chartOptions"
            />
          </v-col>
        </v-carousel-item>
      </v-carousel>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { Chart } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement, // 导入BarElement
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  BarController, // 注册Line控制器
} from "chart.js";

// 注册所需的组件
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement, // 注册BarElement
  CategoryScale,
  LinearScale,
  PointElement,
  ChartDataLabels, // 注册ChartDataLabels插件
  LineController, // 注册Line控制器
  BarController // 注册Line控制器
);
const loaded = ref(false); // 新增一个响应式变量来控制加载状态
// 获取今天前七天的日期数组
const getPastSevenDays = () => {
  const dates = [];
  for (let i = 7; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString());
  }
  return dates;
};
// 创建图表数据
const chartData = ref<any>({
  type: "bar",
  labels: getPastSevenDays(),
  datasets: [
    {
      label: "派工单开始",
      data: [], // 示例数据，应从API或其他数据源获取
      fill: false,
      borderColor: "red",
      backgroundColor: "red",
      tension: 0.1,
      pointRadius: 5, // 设置顶点的大小
      type: "line", // 设置图表类型为折线图
    },
    {
      label: "派工单完成数",
      data: [], // 示例数据，应从API或其他数据源获取
      fill: false,
      backgroundColor: "#8abcf9",
      type: "bar", // 设置图表类型为柱状图
    },
  ],
});

// 创建图表选项
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true, // 保持宽高比
  aspectRatio: 0.1,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});

// 获取数据
async function getData() {
  const data: any = await useHttp(
    "/PackingList/M94GetPackingList",
    "get",
    undefined
  );
  // 过滤出前两周的数据
  const filteredData = data.data.filter((item: any) => {
    const createTime = new Date(item.create_time);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 14);
    return createTime >= sevenDaysAgo && createTime < today;
  });
  // 使用groupDataByDate函数对数据进行分组
  const groupedDataArray = groupDataByDate(filteredData);

  // 更新图表数据
  chartData.value.datasets[0].data = groupedDataArray;
  // 更新图表数据
  chartData.value.datasets[1].data = groupedDataArray;
  // 数据加载完成后，设置loaded为true
  loaded.value = true;
}
// 使用groupDataByDate函数对数据进行分组
const groupDataByDate = (data: any[]) => {
  const groupedData = new Map();

  // 初始化前七天的日期为0
  getPastSevenDays().forEach((date) => {
    groupedData.set(date, 0);
  });

  // 遍历数据，按创建日期分组并计数
  data.forEach((item) => {
    const createDate = new Date(item.create_time).toLocaleDateString();
    if (groupedData.has(createDate)) {
      groupedData.set(createDate, groupedData.get(createDate) + 1);
    }
  });
  // 将Map对象转换为数组
  return Array.from(groupedData.values());
};
onMounted(() => {
  getData();
});

let projectProgress = ref<any[]>([]);
let project = ref<string>("ZM23247-0");
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
