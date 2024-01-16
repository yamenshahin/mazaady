
<template>
  <div>
    {{ props.counter }}
    {{ props.parentID }}
    {{ parentList }}
    {{ data.data.length}}
    <div v-if="pending || error || data.code !== 200">
      <ErrorAlert :pending="pending" :error="error" />
    </div>
    <!-- if data.code = 200 this mean it's successful request -->
    <div v-else>
      <!-- if data.data.length > 0 this mean no data -->
      <div v-if="data.data.length > 0">
        <h2>{{ data.data.name }}</h2>
        <CFormSelect size="lg" class="mb-3" aria-label="Large select" @change="changeSelectHandler"
          :parentID="props.parentID">
          <option value="">Select {{ data.data[0].name }}</option>
          <option v-for="option in data.data[0].options" :key="option.id" :value="option.id">{{
            option.name }}
          </option>
        </CFormSelect>

        <!-- Child component. Call the same component recursively -->
        <div v-if="render">
          <h1>Something funny here</h1>
          <NestedCom parentID="1"/>
          <OptionsSub  parentID="51456"  />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['parentID']);
const formDataStore = useFormDataStore();
const { config } = useCustomUtils();
const parentList = [];
let render = ref(false);
const componentKey = ref(0);
const delay = ms => new Promise(res => setTimeout(res, ms));


// Get all sub options right after loading the page/component
const { data, pending, error, refresh } = await useFetch(`${config.public.apiBase}/get-options-child/${props.parentID}`, {
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
  if (id.length) {
    parentList.push.apply(parentList, id);
  } else {
    parentList.push(id);
  }

}
/**
 * Handle select option change
 * @param: event: any
 */
async function  changeSelectHandler(event) {
  if(event.target.value) {
    //setOptionSubViaStore(event);
    //await delay(10000);
    render.value = true;
    
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
 * Force child component to re-render
 * @return: void
 */
const forceRerender = () => {
  componentKey.value += 1;
};
</script>