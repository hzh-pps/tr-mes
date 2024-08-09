<script setup lang="ts">
import * as echarts from "echarts";
const chart = ref();
//获取项目号
let projectCodeList = ref<any[]>([]);
async function getProjectCode() {
  const data: any = await useHttp(
    "/MesWorkOrderDetail/M75GetProjectCode",
    "get",
    undefined,
    {
      code: "",
      start_time: "",
      end_time: "",
    }
  );
  projectCodeList.value = data.data.filter((item: any) => {
    return item.isfinish === 0;
  });
  project.value = projectCodeList.value[0].code;
  getData();
}

let project = ref<string>("");
let projectIndex = 0;
// 设置定时器，每20秒更改project的值
setInterval(() => {
  projectIndex = (projectIndex + 1) % projectCodeList.value.length; // 循环遍历项目ID数组
  project.value = projectCodeList.value[projectIndex].code;
  chartInit();
}, 10000);
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
let date = new Date();
let startdate = new Date(date.setDate(date.getDate() - 7))
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
  chartInit();
}

function chartInit() {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(chart.value);
  // 指定图表的配置项和数据
  var option = {
    title: {
      text: "项目号：" + project.value,
      textStyle: {
        color: "white",
        fontSize: 15,
      },
    },
    tooltip: {},
    // legend: {
    //   data: ["派工单完成"],
    // },
    xAxis: {
      type: "value",
      axisLine: {
        color: "#fff",
      },
    },
    yAxis: {
      type: "category",
      data: getPastSevenDays(),
      axisLine: {
        color: "#fff",
      },
    },
    series: [
      {
        name: "派工单完成",
        type: "bar",
        data: groupedDataArray2.value,
        barWidth: 40,
        itemStyle: {
          color: function (params: any) {
            var colorList = [
              "#2e4e7e",
              "#c93756",
              "#ff7500",
              "#8c4356",
              "#057748",
              "#3de1ad",
              "#e4c6d0",
            ];
            return colorList[params.dataIndex];
          },
        },
      },
    ],
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
        dataView: {},
        restore: {},
        magicType: {
          type: ["line", "bar"],
        },
      },
    },
    grid: {
      left: "12%",
      right: "2%",
      top: "10%",
      bottom: "1%",
      containLabel: true,
    },
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}
watch(project, () => {
  getData();
});
onMounted(() => {
  getProjectCode();
});
</script>
<template>
  <div ref="chart" style="width: 100%; height: 400px"></div>
</template>
<style scoped></style>
