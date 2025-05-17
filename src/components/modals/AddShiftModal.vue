<script setup>
import { ref, watch, onMounted } from "vue";
import EditLabelModal from "@/components/modals/EditLabelModal.vue";
import { useStore } from "@/store/index.js";
import { useAlerts } from "@/composables/useAlerts.js";
import { useUnits } from "@/composables/useUnits.js";

const { simpleSwal } = useAlerts();
const { isEmpty } = useUnits();
const store = useStore();
const props = defineProps(["date", "rules", "masks", "currentMonth"]);
const labelSetting = ref([]);
const labelSelected = ref({});
const labelEditModalShow = ref(false);

const newDateSelected = ref({
  start: `${props.date}T00:00`,
  end: `${props.date}T00:00`,
});

// default setting
const breakHour = ref(0);
const hourlyWage = ref(0);

const emits = defineEmits(["closePicker", "refreshTotal", "editDataAdd"]);

const addShift = () => {
  const hourCount = getShiftHours(
    newDateSelected.value.start,
    newDateSelected.value.end
  );
  if (hourCount <= 0) {
    simpleSwal("時間區間錯誤", "error");
    return;
  }
  if (isEmpty(labelSelected.value)) {
    simpleSwal("請先設定工作標籤", "error");
    return;
  }
  const dateInfo = {
    key: Date.now(),
    dot: {
      style: {
        backgroundColor: labelSelected.value.color,
      },
    },
    customData: {
      id: Date.now(),
      timeStart: newDateSelected.value.start.split("T")[1],
      timeEnd: newDateSelected.value.end.split("T")[1],
      hours: hourCount,
      currentMonth: props.currentMonth,
      hourlyWage: hourlyWage.value,
      jobLabel: {
        text: labelSelected.value.text,
        color: labelSelected.value.color,
      },
    },
    dates: datesSelect(newDateSelected.value.start),
  };

  if (store.addMode === "N") {
    store.shiftList.push(dateInfo);
    localStorage.setItem("shiftList", JSON.stringify(store.shiftList));
    emits("refreshTotal");
    simpleSwal("新增成功", "success");
  } else {
    emits("editDataAdd", dateInfo);
  }
  close();
};

// only date
const datesSelect = (date) => {
  return date.split("T")[0];
};

// 計算時數
const getShiftHours = (start, end) => {
  return (
    (Date.parse(end) - Date.parse(start)) / (1000 * 3600) - breakHour.value
  );
};

const close = () => {
  emits("closePicker");
};

const getLabelSetting = () => {
  labelSetting.value = store.labelConfig;
  if (isEmpty(labelSetting.value)) {
    return;
  }
  labelSelected.value = labelSetting.value[0];
};

watch(
  () => labelSelected.value,
  () => {
    if (isEmpty(labelSetting.value)) {
      return;
    }
    breakHour.value = labelSelected.value.defaultBreakHour;
    hourlyWage.value = labelSelected.value.defaultHourlyWage;
  }
);

onMounted(() => {
  getLabelSetting();
});
</script>

<template>
  <div class="fixed top-0 left-0 z-100 w-full h-full bg-black/50">
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-3/4 bg-white border border-gray-300 rounded-md p-2 lg:w-2/3"
    >
      <div class="flex justify-end">
        <button class="p-0 m-1 me-3" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <!-- <div class="bg-pink-300">
    已排:
    <p v-for="(data, index) in store.shiftList" :key="index">
      {{ data.customData.timeEnd }}
    </p>
  </div> -->
      <div class="flex justify-center pb-3">
        <VDatePicker
          v-model.range.string="newDateSelected"
          mode="time"
          :rules="rules"
          :masks="masks"
          is24hr
        ></VDatePicker>
      </div>
      <div class="flex flex-wrap">
        <div class="text-start my-2 me-3">
          <label for="breakHour">🫖休息時數:</label>
          <input
            id="breakHour"
            type="number"
            step="0.5"
            v-model="breakHour"
            class="w-16 border border-gray-300 mx-1"
          />
          <span>hr.</span>
        </div>
        <div class="text-start my-2">
          <label for="hourlyWage">💰時薪:$</label>
          <input
            id="hourlyWage"
            type="number"
            v-model="hourlyWage"
            class="w-16 border border-gray-300 mx-1"
          />
        </div>
      </div>
      <div class="flex flex-wrap items-center">
        <div class="text-start my-2">
          <label for="label">🏷️標籤:</label>
          <select
            name="label"
            id="label"
            v-model="labelSelected"
            class="border border-gray-300"
          >
            <option v-for="opt in labelSetting" :value="opt">
              {{ opt.text }}
            </option>
          </select>
        </div>
        <button
          class="text-xs mx-2 px-1 h-max border-2 border-gray-300 rounded-full bg-theme-yellow text-theme-dark hover:border-theme-dark"
          @click="labelEditModalShow = true"
        >
          標籤設定<i class="fa-solid fa-gear"></i>
        </button>
      </div>
      <div class="my-3 mt-6">
        <button
          @click="close"
          class="border-2 border-gray-300 m-1 px-3 py-2 rounded-full hover:border-theme-dark"
        >
          取消
        </button>
        <button
          @click="addShift"
          class="border-2 border-gray-300 bg-theme text-white m-1 px-3 py-2 rounded-full hover:border-theme-dark"
        >
          確定
        </button>
      </div>
    </div>
  </div>
  <EditLabelModal
    v-if="labelEditModalShow"
    @closeEditLabel="labelEditModalShow = false"
    @saveEditLabel="getLabelSetting"
  ></EditLabelModal>
</template>

<style scoped></style>
