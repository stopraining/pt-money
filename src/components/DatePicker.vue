<script setup>
import { ref, onMounted, provide } from "vue";
import AddShiftModal from "@/components/modals/AddShiftModal.vue";
import EditShiftModal from "@/components/modals/EditShiftModal.vue";
import { useUnits } from "@/composables/useUnits.js";
import { useStore } from "@/store/index.js";

const { isEmpty } = useUnits();
const store = useStore();

const openAddShiftModal = ref(false);
const openEditShiftModal = ref(false);
provide("openAddShiftModal", openAddShiftModal);
const shiftDateInfo = ref([]);

const masks = ref({
  title: "西元 YYYY 年 MM 月",
  modelValue: "YYYY-MM-DDTHH:mm",
});
const currentMonth = ref(0);
const totalHours = ref(0);
const totalSalary = ref(0);

const rules = ref({
  hours: { min: 0, max: 24 },
  minutes: { interval: 30 },
});

const isoDate = ref(new Date());
isoDate.value.setHours(0, 0, 0, 0);

// ＠update:pages不只是換月份頁,點選日期也會觸發
const changeMonth = (pages) => {
  if (currentMonth.value !== pages[0].month) {
    currentMonth.value = pages[0].month;
    totalCount();
  }
};

const totalCount = () => {
  totalSalary.value = 0;
  totalHours.value = store.shiftList.reduce((acc, data) => {
    if (data.customData.currentMonth === currentMonth.value) {
      acc += data.customData.hours;
      totalSalary.value += data.customData.hours * data.customData.hourlyWage;
    }
    return acc;
  }, 0);
};

// VCalendar
const dateClick = (day) => {
  // isoDate.value = new Date(day.id);
  isoDate.value = day.id; // 時間先預設成00:00開始
  currentMonth.value = new Date(day.id).getMonth() + 1;
};

// VCalendar
const isDateActive = (day) => {
  return day.id === isoDate.value;
};

const formatDate = (date) => {
  const dateMonth = date.getMonth() + 1;
  return `${date.getFullYear().toString().padStart(2, "0")}-${dateMonth
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

//
const openAddShiftModalNew = () => {
  store.addMode = "N";
  openAddShiftModal.value = true;
};

const editAddShift = (dateInfo) => {
  shiftDateInfo.value = dateInfo;
};

// 編輯/刪除班表
// key (id?)

onMounted(() => {
  // shift list get
  if (isEmpty(localStorage.getItem("shiftList"))) {
    localStorage.setItem("shiftList", JSON.stringify(store.shiftList));
  }
  store.shiftList = JSON.parse(localStorage.getItem("shiftList"));
  // label config get
  if (isEmpty(localStorage.getItem("labelConfig"))) {
    localStorage.setItem("labelConfig", JSON.stringify(store.labelConfig));
  }
  store.labelConfig = JSON.parse(localStorage.getItem("labelConfig"));

  totalCount();
  isoDate.value = formatDate(isoDate.value);
});
</script>

<template>
  <div>
    <p class="font-bold text-lg text-theme-dark">我的班表 💼</p>
    <div class="text-start text-sm py-2">
      <p>本月統計：</p>
    </div>
    <div
      class="mb-3 pb-2 border-b border-gray-200 text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-2"
    >
      <div>
        🕒 工時：<span class="font-bold text-gray-800"
          >{{ totalHours }} 小時</span
        >
      </div>
      <div>
        💰 薪資：<span class="font-bold text-gray-800">${{ totalSalary }}</span>
      </div>
    </div>
    <div>
      <VCalendar
        expanded
        :attributes="store.shiftList"
        :masks="masks"
        @update:pages="changeMonth"
      >
        <template #day-content="{ day, attributes }">
          <div
            @click="dateClick(day)"
            class="flex md:block justify-center text-sm h-full md:text-xs md:min-h-[100px] p-1 pb-2 cursor-pointer md:hover:bg-gray-100"
            :class="{
              'md:!bg-theme-bgc ': isDateActive(day),
            }"
          >
            <div
              class="md:!border-none h-[30px] w-[30px] flex justify-center items-center"
              :class="{
                'border-2 border-theme-yellow rounded-full bg-theme-bgc md:!bg-none font-bold':
                  isDateActive(day),
              }"
            >
              {{ day.day }}
            </div>

            <div
              v-if="attributes"
              class="text-white font-medium hidden md:block mt-1 space-y-1"
            >
              <div
                v-for="attr in attributes"
                class="rounded-full px-1"
                :style="{ backgroundColor: attr.customData.jobLabel.color }"
              >
                <span class="me-1">{{ attr.customData.jobLabel.text }}</span>
                <span class="hidden lg:inline-block">
                  {{ attr.customData.timeStart }}-{{
                    attr.customData.timeEnd
                  }}</span
                >
              </div>
            </div>
          </div>
        </template>
      </VCalendar>
    </div>
    <!-- <VDatePicker
      v-model.range.string="isoDate"
      @update:pages="changeMonth"
      mode="date"
      :attributes="store.shiftList"
      :masks="masks"
      :rules="rules"
      is24hr
    ></VDatePicker> -->
    <!-- 先註解掉 -->
    <!-- <div class="lg:hidden">
      <VDatePicker
        v-model="isoDate"
        mode="date"
        :attributes="store.shiftList"
        :masks="masks"
        :rules="rules"
        is24hr
        expanded
      >
      </VDatePicker>
    </div> -->
    <div
      class="flex justify-center w-full md:fixed md:bottom-0 md:inset-x-0 z-1 mb-5"
    >
      <button
        @click="openEditShiftModal = true"
        class="bg-theme border-2 border-gray-300 text-white m-2 px-3 py-2 rounded-full hover:border-theme-dark"
      >
        編輯
      </button>
      <button
        @click="openAddShiftModalNew"
        class="bg-theme-yellow border-2 border-gray-300 text-theme-dark m-2 px-3 py-2 rounded-full hover:border-theme-dark"
      >
        新增<i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <AddShiftModal
      v-if="openAddShiftModal"
      :date="isoDate"
      :rules="rules"
      :masks="masks"
      :currentMonth="currentMonth"
      @closePicker="openAddShiftModal = false"
      @refreshTotal="totalCount"
      @editDataAdd="editAddShift"
    ></AddShiftModal>
    <EditShiftModal
      v-if="openEditShiftModal"
      :date="isoDate"
      :shiftDataAdd="shiftDateInfo"
      @closePicker="openEditShiftModal = false"
      @refreshTotal="totalCount"
    ></EditShiftModal>
    <!-- <div v-if="date" class="border border-red-300 bg-pink-300">show modal</div> -->
  </div>
</template>

<style scoped></style>
