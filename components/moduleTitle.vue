<script setup lang="ts"></script>
<template>
  <div class="module-title">
    <ClientOnly>
      <dv-decoration8 style="width: 420px; height: 50px" />
      <div>
        <h2>数字化工厂数据统计</h2>
        <dv-decoration5 :dur="2" style="width: 650px; height: 40px" />
      </div>
      <dv-decoration8 :reverse="true" style="width: 420px; height: 50px" />
    </ClientOnly>
  </div>
</template>
<style scoped>
.module-title {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 20px;
}
.module-title h2 {
  margin-top: 2px;
  letter-spacing: 5px;
}
</style>
