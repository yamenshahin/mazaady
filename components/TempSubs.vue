<template>
  <div>
    {{ parentList }}
    <div v-if="data.data[0]">
      <h5>{{ data.data[0].name }}</h5>
      <CFormSelect size="lg" class="mb-3" aria-label="Large select" @change="changeSelectHandler"
        :parentID="props.parentID">
        <option value="">Select {{ data.data[0].name }}</option>
        <option v-for="option in data.data[0].options" :key="option.id" :value="option.id">{{
          option.name }}
        </option>
      </CFormSelect>
    </div>
    <div v-if="afterClick && data.data">
      <TempSubs :parentID="parentList" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['parentID']);
const { config } = useCustomUtils();
const formDataStore = useFormDataStore();
const afterClick = ref(false);
const parentList = [];
// Get all sub options right after loading the page/component
const { data, pending, error, refresh } = await useFetch(`${config.public.apiBase}/get-options-child/${props.parentID[props.parentID.length - 1]}`, {
  onRequest({ request, options }) {
    // Set the request headers
    options.headers = {
      "private-key": config.public.mazaadyPrivateKey
    };
  },
  onRequestError({ request, options, error }) {
    // Handle the request errors
    // I'm aware that on production console.log should not be used. This is just a generic way to handel error
    console.log(error);
  },
});

// Update parent list on load
updateParentList(props.parentID);
/**
 * Update parent list
 * 
 * @param: id: any
 */
function updateParentList(id) {
  parentList.value = [];
  if (Array.isArray(id)) {
    parentList.push.apply(parentList, id);
  } else {
    parentList.push(id);
  }

}

/**
 * Handle select option change
 * @param: event: any
 */
function changeSelectHandler(event) {

  if (event.target.value !== '') {
    updateParentList(parseInt(event.target.value));
    setOptionSubViaStore(event);
    afterClick.value = true;
  } else {
    removeOptionSubViaStore();
  }
}


/**
 * Set sub option via store
 * @param: event: any
 */
function setOptionSubViaStore(event) {
  const index = event.target.selectedIndex;
  const propertyName = event.target[index].text;
  formDataStore.setOptionSub(parentList, event.target.value, propertyName);
}
/**
 * Set sub option via store
 * @param: event: any
 */
function removeOptionSubViaStore() {
  formDataStore.removeOptionSub(parentList);
  afterClick.value = false;
  parentList.length = parentList.length - 1;
  
  
}
</script>