<template>
  <v-row class="ma-2">
    <v-col cols="4">
      <v-text-field v-model="project" label="输入查询的项目号"></v-text-field>
    </v-col>
    <v-col cols="12">
      <div
        style="
          height: 600px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <Chart
          :type="chartData.type"
          v-if="loaded"
          :data="chartData"
          :options="chartOptions"
        />
      </div>
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
  for (let i = 14; i > 0; i--) {
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
      label: "派工单完成",
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
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    // 添加背景颜色设置
    legend: {
      labels: {
        color: "blue", // 设置图例文字颜色为蓝色
        font: {
          size: 14, // 设置字体大小为14
          family: "Arial", // 设置字体为Arial
        },
        padding: 20,
      },
    },
    tooltip: {
      // 这里可以设置工具提示的样式，如果需要
    },
    // 使用下面的方式设置图表的背景颜色
  },
});

let date = new Date();
let startdate = new Date(date.setDate(date.getDate() - 14))
  .toISOString()
  .substring(0, 10);
let enddate = new Date(date.setDate(date.getDate() + 13))
  .toISOString()
  .substring(0, 10); // 注意这里需要调整日期的增减，因为date已经被修改
let groupedDataArray1 = ref<any[]>([]);
let groupedDataArray2 = ref<any[]>([]);
// 获取数据
async function getData() {
  groupedDataArray1.value = [];
  groupedDataArray2.value = [];
  chartData.value.datasets[0].data = [];
  chartData.value.datasets[1].data = [];
  loaded.value = false;
  const data: any = await useHttp(
    "/MesProjectProgress/M123GetProjectList",
    "get",
    undefined,
    {
      project_id: project.value,
      startdate: startdate,
      enddate: enddate,
    }
  );

  data.data.forEach((item: any) => {
    groupedDataArray1.value.push(item.start_quantity);
    groupedDataArray2.value.push(item.end_quantity);
  });
  // 更新图表数据
  chartData.value.datasets[0].data = [...groupedDataArray1.value];
  chartData.value.datasets[1].data = [...groupedDataArray2.value];
  // 数据加载完成后，设置loaded为true
  loaded.value = true;
}
const projectValues = ["ZM23247-0", "ZL24028-0", "ZL23256-0", "ZL23246-0"];
let project = ref<string>("ZM23247-0");
let projectIndex = 0;
// 设置定时器，每20秒更改project的值
setInterval(() => {
  projectIndex = (projectIndex + 1) % projectValues.length; // 循环遍历项目ID数组
  project.value = projectValues[projectIndex];
}, 20000);
watch(project, () => {
  getData();
});
onMounted(() => {
  getData();
});
</script>
