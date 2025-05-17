<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
const showInfo = ref(false);

const props = defineProps([
  "id",
  "timeStart",
  "timeEnd",
  "label",
  "hours",
  "hourlyWage",
]);
const emits = defineEmits(["deleteShiftItem"]);

const deleteItem = (id) => {
  emits("deleteShiftItem", id);
};
// popover
const handleClickOutside = (event) => {
  if (!event.target.closest(`#popover-${props.id}`)) {
    showInfo.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    class="flex flex-wrap justify-between border border-gray-300 m-2 p-1 hover:bg-gray-100"
  >
    <div class="flex flex-wrap items-center text-gray-800">
      <div
        class="w-[30px] h-[30px] me-2 rounded-full"
        :style="{ backgroundColor: label.color }"
      ></div>
      <div class="me-2 min-w-[100px]">{{ timeStart }}-{{ timeEnd }}</div>
      <div>{{ label.text }}</div>
    </div>
    <div class="text-white">
      <div class="relative inline-block" :id="`popover-${id}`">
        <button @click="showInfo = !showInfo">
          <i class="fa-solid fa-circle-info text-theme-dark m-1"></i>
        </button>
        <div
          v-if="showInfo"
          class="absolute left-[-20px] mt-0 w-22 p-1 px-2 bg-theme-dark text-start text-sm border rounded shadow z-10"
        >
          <div
            class="absolute top-[-5px] left-[23px] w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-theme-dark"
          ></div>

          <p>共{{ hours }}小時</p>
          <p>${{ hourlyWage }}/hr</p>
        </div>
      </div>
      <button @click="deleteItem(id)" class="text-red-700 m-1 p-1">
        <i class="fa-solid fa-trash"></i>
      </button>
      <!-- original -->
      <!-- <button @click="getShiftInfo">
        <i class="fa-solid fa-circle-info text-theme m-1"></i>
      </button>
      <button @click="deleteItem(id)" class="text-red-700 m-1 p-1">
        <i class="fa-solid fa-trash"></i>
      </button> -->
      <!--  -->
    </div>
  </div>
</template>

<style scoped></style>
