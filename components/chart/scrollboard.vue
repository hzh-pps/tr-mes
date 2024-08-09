<script setup lang="ts">
let dispatchList = ref<any[]>([]);

let nowDate = new Date();
nowDate.setDate(nowDate.getDate() - 1);
let oldDate = new Date();
let startDate = ref<any>(null);
let endDate = ref<any>(null);
onMounted(() => {
  startDate.value = nowDate.toISOString().slice(0, 10);
  endDate.value = oldDate.toISOString().slice(0, 10);
  getDispatchData();
});
async function getDispatchData() {
  const data: any = await useHttp(
    "/MesProcessScanRecord/M116GetUnfinishedOrderList",
    "get",
    undefined,
    {
      strattime: startDate.value,
      endtime: endDate.value,
      status: "已执行在生产",
      PageIndex: 1,
      PageSize: 1000,
      SortedBy: "id",
      SortedType: "1",
    }
  );
  data.data.pageList.forEach((item: any) => {
    dispatchList.value.push({
      dispatch_order: item.dispatch_order,
      start_name: item.start_name,
      project_code: item.project_code,
      procedure_description: item.procedure_description,
    });
  });
  dispatchList.value = dispatchList.value.map((obj) => Object.values(obj));
}
const config = reactive({
  header: ["派工单号", "开始人员", "项目号", "工序"],
  data: dispatchList,
  index: true,
  columnWidth: [50],
  align: ["center"],
});
</script>
<template>
  <div>
    <dv-scroll-board :config="config" style="width: 100%; height: 350px" />
  </div>
</template>
<style scoped></style>
