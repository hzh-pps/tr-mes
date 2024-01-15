<script setup lang="ts">
useSeoMeta({
  // 该页面的标题
  title: "收货单",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "收货单",
  // 该页面的描述
  description: "同日 MES 系统，收货单",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，收货单",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 页面缓存
definePageMeta({
  keepalive: true,
});
</script>

<template>
  <div>收货单</div>
</template>
