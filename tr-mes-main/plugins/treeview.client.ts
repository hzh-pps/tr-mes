import vue3TreeOrg from "vue3-tree-org";
import "vue3-tree-org/lib/vue3-tree-org.css";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3TreeOrg);
});
