<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useStore } from "@/store/index.js";
import { cloneDeep } from "lodash/fp";
import { useUnits } from "@/composables/useUnits.js";
import { useAlerts } from "@/composables/useAlerts.js";

const store = useStore();
const { isEmpty } = useUnits();
const { simpleSwal } = useAlerts();
const labelSetting = ref([]);
const inputRef = ref(null);
const labelText = ref("");
const labelColor = ref("");
const showColorSelector = ref(false);
const defaultBreakHour = ref(0);
const defaultHourlyWage = ref(0);

const emits = defineEmits(["closeEditLabel", "saveEditLabel"]);

const colorConfig = [
  "#124076",
  "#F5C45E",
  "#E78B48",
  "#BE3D2A",
  "#497D74",
  "#7E5CAD",
  "#E69DB8",
  "#9A7E6F",
];

const close = () => {
  emits("closeEditLabel");
};

const selectColor = (color) => {
  labelColor.value = color;
  showColorSelector.value = false;
};

const addLabel = () => {
  if (isEmpty(labelText.value)) {
    simpleSwal("標籤名稱不能為空白", "error");
    return;
  }
  const labelInfo = {
    id: Date.now(),
    text: labelText.value,
    color: labelColor.value,
    defaultBreakHour: defaultBreakHour.value,
    defaultHourlyWage: defaultHourlyWage.value,
  };
  labelSetting.value.push(labelInfo);
  labelText.value = "";
  focusInput();
};

const saveEdit = () => {
  store.labelConfig = labelSetting.value;
  localStorage.setItem("labelConfig", JSON.stringify(store.labelConfig));
  simpleSwal("儲存成功", "success");
  emits("saveEditLabel");
  close();
};

const deleteLabel = (id) => {
  const targetLabelIndex = labelSetting.value.findIndex(
    (label) => label.id === id
  );
  labelSetting.value.splice(targetLabelIndex, 1);
};

const cancelEdit = () => {
  close();
};
const handleClickOutside = (event) => {
  if (!event.target.closest(`#colorSelector`)) {
    showColorSelector.value = false;
  }
};

const focusInput = async () => {
  await nextTick();
  inputRef.value?.focus();
};

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});

onMounted(() => {
  labelColor.value = colorConfig[0];
  labelSetting.value = cloneDeep(store.labelConfig);
  window.addEventListener("click", handleClickOutside);
  focusInput();
});
</script>

<template>
  <div class="fixed top-0 left-0 z-100 w-full h-full bg-black/50">
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-3/4 bg-white border border-gray-300 rounded-md p-2 lg:w-2/3"
    >
      <div class="flex justify-end">
        <button class="p-0 m-1 me-3" @click="cancelEdit">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="pb-3">
        <p>🏷️工作標籤設定</p>
      </div>
      <div class="flex flex-wrap items-center my-3">
        <div>所有標籤:</div>
        <div
          class="flex items-center text-white rounded-full px-2 m-1"
          v-for="label in labelSetting"
          :style="{ backgroundColor: label.color }"
        >
          <div class="me-2 font-medium">{{ label.text }}</div>
          <button @click="deleteLabel(label.id)">x</button>
        </div>
      </div>
      <div class="flex flex-wrap items-center">
        <div class="text-start me-2 my-2">
          <label for="labelText">標籤名稱:</label>
          <input
            id="labelText"
            ref="inputRef"
            class="h-[30px] w-[120px] border-1 border-gray-300"
            type="text"
            v-model.trim="labelText"
          />
        </div>
        <div id="colorSelector" class="relative inline-block me-3">
          <div
            class="flex items-center h-[30px] border-1 border-gray-300 box-border cursor-pointer"
            @click="showColorSelector = !showColorSelector"
          >
            <div
              class="w-[30px] h-[30px]"
              :style="{ backgroundColor: labelColor }"
            ></div>
            <span v-if="showColorSelector">∧</span>
            <span v-else>∨</span>
          </div>
          <div
            v-if="showColorSelector"
            class="absolute left-0 top-full flex flex-wrap border border-gray-300 bg-white p-3 w-[180px] shadow"
          >
            <div
              v-for="color in colorConfig"
              class="w-[30px] h-[30px] m-1 cursor-pointer"
              :style="{ backgroundColor: color }"
              @click="selectColor(color)"
            ></div>
          </div>
        </div>
        <div>
          <label for="defaultBreakHour">🫖預設休息時數：</label>
          <input
            id="defaultBreakHour"
            type="number"
            step="0.5"
            v-model="defaultBreakHour"
            class="w-16 border border-gray-300 h-[30px] border-1 me-3 my-2"
          />
        </div>
        <div>
          <label for="defaultHourlyWage">💰預設時薪：</label>
          <input
            id="defaultHourlyWage"
            type="number"
            v-model="defaultHourlyWage"
            class="w-16 border border-gray-300 h-[30px] border-1 me-3 my-2"
          />
        </div>
        <button
          @click="addLabel"
          class="bg-theme-yellow border-2 border-gray-300 text-theme-dark px-2 py-0 my-2 rounded-full hover:border-theme-dark"
        >
          新增標籤
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
      <div class="my-3 mt-6">
        <button
          @click="cancelEdit"
          class="border-2 border-gray-300 m-1 px-3 py-2 rounded-full hover:border-theme-dark"
        >
          取消
        </button>
        <button
          @click="saveEdit"
          class="border-2 border-gray-300 bg-theme text-white m-1 px-3 py-2 rounded-full hover:border-theme-dark"
        >
          儲存
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
