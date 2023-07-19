<template>
  Medications
  <div class="medication-list">
    <div class="medication-list__item" v-for="medication in medications">
      <span>{{ medication.name }}</span>
      <span>{{ `${medication.dosesAmount} szt.` }}</span>
    </div>
  </div>
  <div class="medication-form">
    <div class="form-control">
      <label for="title">Name</label>
      <input type="text" name="title" id="title" v-model.trim="name">
    </div>
    <div class="form-control">
      <label for="price">Doses</label>
      <input type="text" name="doses" id="doses" v-model="dosesAmount">
    </div>
    <div class="form-control">
      <button @click="addMedication">ADD</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, computed, ref, onMounted } from 'vue';
import { usePageContext } from '../renderer/usePageContext';

interface MedicationListState {
  medicationList: Medication[]
};
interface Medication {
  name: string;
  dosesAmount: number;
};

const state = reactive<MedicationListState>({
  medicationList: [] as Medication[]
});

const name = ref<string>('');
const dosesAmount = ref<number>(0);
const medications = computed<Medication[] | null>(() => {
  return getMediactionList();
});

const setMediactionList = (medication: Medication): void => {
  state.medicationList.push(medication)
};
const getMediactionList = (): Medication[] => state.medicationList;

const addMedication = (): void => {
  setMediactionList( { name: name.value, dosesAmount: dosesAmount.value })
}
onMounted((): void => {
  console.log('medications.page.vue usePageContext:',usePageContext());
})
</script>

<style scoped>
.medication-list {
  margin-top: 8px;
  height: 300px;
  padding: 4px;
  border: 1px solid #000000;
  display: flex;
  flex-direction: column;
  gap: 4px;

}
.medication-list__item {
  background-color: #f1eeee;
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
}
.medication-form {
  margin-top: 8px;
  padding: 4px;
  border: 1px solid #000000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-control {
  display: flex;
  flex-direction: column;
}
</style>