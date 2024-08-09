import DataV from "@kjgl77/datav-vue3"; // 这里的导入路径根据实际的兼容库来定
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(DataV);
});
