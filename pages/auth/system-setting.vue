<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "系统设置",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "系统设置",
  // 该页面的描述
  description: "同日 MES 系统，系统设置",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，系统设置",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 不采用布局
definePageMeta({
  layout: false,
});
onMounted(() => {
  // 页面初始动画
  useGsap.from(".initial-animation", {
    y: 100,
    opacity: 0,
    duration: 1,
  });
});
</script>

<template>
  <div
    style="
      background: linear-gradient(to bottom, #065279, #8d4bbb);
      height: 100vh;
      width: 100%;
    "
  >
    <div
      class="initial-animation text-h5"
      style="
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-shadow: 5px 5px 5px #ff0000;
      "
    >
      <div>当前版本:202409-10</div>
      <div>
        当前版本修改内容:
        修改了工时的计算的俩种情况，第一种开始和结束时间不是同一天，计算出相差几天，每多一天工时多减去11.5小时。第二种是同一天报工，判断开始和结束时间里面是否包含休息时间如果有的话，就减去对应的休息时间
      </div>
    </div>
  </div>
</template>
