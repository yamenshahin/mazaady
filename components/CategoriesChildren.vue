<template>
  <div>
    <h2>Sub Categories</h2>


    <CFormSelect size="lg" class="mb-3" aria-label="Large select" @change="changeSelectHandler">
      <option value="">Select a sub category</option>
      <option v-for="category in formDataStore.categoriesChildren" :key="category.id" :value="category.id">{{
        category.name }}
      </option>
    </CFormSelect>

    <!-- Child component -->
    <div v-if="render">
      <Properties :key="componentKey"/>
    </div>
  </div>
</template>

<script setup>
const formDataStore = useFormDataStore();
const render = ref(false);
const componentKey = ref(0);

/**
 * Handle select option change
 * @param: event: any
 */
function changeSelectHandler(event) {
  setCurrentChildCategoryViaStore(event);
  forceRerender();
  if(!event.target.value) {
    render.value = false;
  } else {
    render.value = true;
  }
}

/**
 * Set current child category via store
 * @param: event: any
 */
function setCurrentChildCategoryViaStore(event) {
  if (event.target.value) {
    const index = event.target.selectedIndex;
    const currentMainCategoryName = event.target[index].text;
    formDataStore.setCurrentChildCategory(event.target.value, currentMainCategoryName);
  } else{
    formDataStore.removeCurrentChildCategory();
  }
}

/**
 * Force child component to re-render
 * @return: void
 */
 const forceRerender = () => {
  componentKey.value += 1;
};
</script>