<script setup>
import { ref, inject, onMounted, watch } from "vue";
import { useStore } from "@/store/index.js";
import ShiftItem from "@/components/ShiftItem.vue";
import { useAlerts } from "@/composables/useAlerts.js";
import { useUnits } from "@/composables/useUnits.js";
import { cloneDeep } from "lodash/fp";

const { simpleSwal } = useAlerts();
const { isEmpty } = useUnits();
const store = useStore();
const props = defineProps(["date", "shiftDataAdd"]);
const shiftListData = ref([]); // render在畫面的list資料
const shiftData = ref([]); // 該日期list資料
const shiftDataEmpty = ref(true); // 是否一開始為空

const openAddShiftModal = inject("openAddShiftModal");

const emits = defineEmits(["closePicker", "refreshTotal"]);

// 取得當天的班表
const getDateShift = () => {
  // 編輯ｍodal要顯示的
  shiftData.value = [];
  shiftListData.value.forEach((shift) => {
    if (shift.dates === props.date) {
      shiftData.value.push(shift.customData);
    }
  });
  // 判斷是不是一開始就是空的 => 顯示提示
  checkEmpty();
};

const checkEmpty = () => {
  shiftDataEmpty.value = true;
  if (isEmpty(store.shiftList) && shiftData.value.length > 0) {
    shiftDataEmpty.value = false;
    return;
  }
  store.shiftList.forEach((shift) => {
    if (
      (shift.dates === props.date && shiftDataEmpty.value) ||
      shiftData.value.length > 0
    ) {
      shiftDataEmpty.value = false;
    }
  });
};

// 新增btn click
const addShift = () => {
  store.addMode = "E";
  openAddShiftModal.value = true;
};

//
const addShiftDateInfo = (dateInfo) => {
  shiftListData.value.push(dateInfo);
  getDateShift();
};

// 刪除 id
const deleteShift = (id) => {
  const targetShiftIndex = shiftListData.value.findIndex(
    (shift) => shift.customData.id === id
  );
  shiftListData.value.splice(targetShiftIndex, 1);
  getDateShift();
};

const cancelEdit = () => {
  store.shiftList = JSON.parse(localStorage.getItem("shiftList"));
  close();
};

const saveEdit = () => {
  store.shiftList = shiftListData.value;
  localStorage.setItem("shiftList", JSON.stringify(store.shiftList));
  getDateShift();
  emits("refreshTotal");
  simpleSwal("儲存成功", "success");
  close();
};

const close = () => {
  emits("closePicker");
};

watch(
  () => props.shiftDataAdd,
  () => {
    addShiftDateInfo(props.shiftDataAdd);
  },
  { deep: true }
);

onMounted(() => {
  shiftListData.value = cloneDeep(store.shiftList);
  getDateShift();
});
</script>

<template>
  <div class="fixed top-0 left-0 z-1 w-full h-full bg-black/50">
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-3/4 bg-white border border-gray-300 rounded-md p-2 lg:w-2/3"
    >
      <div class="flex justify-end">
        <button class="p-0 m-1 me-3" @click="cancelEdit">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <ShiftItem
        v-for="shift in shiftData"
        :id="shift.id"
        :timeStart="shift.timeStart"
        :timeEnd="shift.timeEnd"
        :label="shift.jobLabel"
        :hours="shift.hours"
        :hourlyWage="shift.hourlyWage"
        @deleteShiftItem="deleteShift"
      ></ShiftItem>
      <div class="pb-3" v-if="shiftDataEmpty">
        <p>這天還沒有安排工作喔！</p>
        <button
          @click="addShift"
          class="bg-theme-yellow border-3 border-gray-300 text-theme-dark my-3 mt-6 px-3 py-2 rounded-full hover:border-orange-300"
        >
          新增<i class="fa-solid fa-plus"></i>
        </button>
      </div>
      <div v-if="!shiftDataEmpty" class="my-3 mt-6">
        <button
          @click="cancelEdit"
          class="border-2 border-gray-300 m-1 px-3 py-2 rounded-full hover:border-theme-dark"
        >
          取消
        </button>
        <button
          @click="addShift"
          class="bg-theme-yellow text-theme-dark border-2 border-gray-300 m-1 px-3 py-2 rounded-full hover:border-theme-dark"
        >
          新增<i class="fa-solid fa-plus"></i>
        </button>
        <button
          @click="saveEdit"
          class="bg-theme text-white border-2 border-gray-300 m-1 px-3 py-2 rounded-full hover:border-theme-dark"
        >
          儲存
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
