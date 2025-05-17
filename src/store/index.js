import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore("Main", () => {
  const shiftList = ref([]);
  const addMode = ref(""); // N:new, E:edit
  const labelConfig = ref([]);

  return {
    shiftList,
    addMode,
    labelConfig,
  };
});
