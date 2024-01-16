<template>
  <div>
    <CFormSelect size="lg" class="mb-3" aria-label="Large select" @change="changeSelectHandler"
      :propertyID="props.property.id">
      <option value="">Select {{ props.property.name }}</option>
      <option v-for="option in props.property.options" :key="option.id" :value="option.id" :propertyID="props.property.id"
        :propertyName="option.name">{{
          option.name }}
      </option>
    </CFormSelect>

    <!-- Child component -->
    <div v-if="render">
      <TempSubs :key="componentKey" :parentID="parentID" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['property']);
const formDataStore = useFormDataStore();
const render = ref(false);
const componentKey = ref(0);
const parentID = ref([]);
const parentName = ref([]);

/**
 * Handle select option change
 * @param: event: any
 */

function changeSelectHandler(event) {
  if (event.target.value) {
    addPropertyViaStore(event);
    parentID.value.push(parseInt(event.target.value));
    render.value = true;
    forceRerender();
  } else {
    formDataStore.removeProperty(event.target.getAttribute('propertyID'));
    render.value = false;
    parentID.value = [];
  }


}

/**
 * add property via store
 * @param: event: any
 * @return: void
 */
function addPropertyViaStore(event) {
  const index = event.target.selectedIndex;
  const propertyName = event.target[index].text;
  const propertyID = event.target.selectedOptions[0].getAttribute('propertyID');
  formDataStore.addProperty(propertyID, event.target.value, propertyName);
}

/**
 * Remove property via store
 * @param: event: any
 * @return: void
 */
function removePropertyViaStore(event) {
  const index = event.target.selectedIndex;
  const propertyName = event.target[index].text;
  formDataStore.addProperty(event.target.value, propertyName);
}


/**
 * Force child component to re-render
 * @return: void
 */
const forceRerender = () => {
  componentKey.value += 1;
};
</script>