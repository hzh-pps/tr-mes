<template>
  <div
    style="
      height: 99%;
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
</template>

<script setup lang="ts">
import { Chart } from "vue-chartjs";
import { Line } from "vue-chartjs";
import { Bar } from "vue-chartjs";
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
import { ref } from "vue";

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
const loaded = ref(false); // 新增一个响应式变量来控制加载状态
// 创建图表数据
const chartData = ref<any>({
  type: "bar",
  labels: getPastSevenDays(),
  datasets: [
    {
      label: "每日装箱单",
      data: [], // 示例数据，应从API或其他数据源获取
      fill: false,
      borderColor: "red",
      backgroundColor: "red",
      tension: 0.1,
      pointRadius: 5, // 设置顶点的大小
      type: "line", // 设置图表类型为折线图
    },
    {
      label: "每日装箱单",
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
</script>
