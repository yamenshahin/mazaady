<template>
  <div>
    {{ formDataStore.formData }}
    
    <div v-if="pending || error || data.code !== 200">
      <ErrorAlert :pending="pending" :error="error" />
    </div>
    <!-- if data.code = 200 this mean it's successful request -->
    <div v-else>
      <!-- if data.data.categories.length > 0 this mean no data -->
      <div v-if="data.data.categories.length > 0">
        <h2>Main categories</h2>

        <CFormSelect size="lg" class="mb-3" aria-label="Large select" @change="changeSelectHandler">
          <option value="">Select a category</option>
          <option v-for="category in formDataStore.categoriesMain" :key="category.id" :value="category.id"
            :name="category.name">
            {{ category.name }}
          </option>
        </CFormSelect>
      </div>

      <!-- Child component -->
      <div v-if="render">
        <CategoriesChildren  :key="componentKey"/>
      </div>
      
    </div>
  </div>
</template>

<script setup>
const { config } = useCustomUtils();
const formDataStore = useFormDataStore();
const render = ref(false);
const componentKey = ref(0);

// Get all categories right after loading the page/component
const { data, pending, error, refresh } = await useFetch(`${config.public.apiBase}/get_all_cats`, {
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
    formDataStore.$reset();
  },
  onResponse(context) {
    const finalData = context.response._data;
    if (context.response._data.code === 200) {
      formDataStore.$reset();
      formDataStore.setCategoriesMain(finalData.data.categories);
    }
  },
});


/**
 * Handle select option change
 * @param: event: any
 */
function changeSelectHandler(event) {
  setCurrentMainCategoryViaStore(event);
  toggleCategoriesChildrenComponent();
  setCategoriesChildrenViaStore(event);
  if(!event.target.value) {
    render.value = false;
  }
  formDataStore.removeCurrentChildCategory();
}


/**
 * Set current main category via store
 * @param: event: any
 */
function setCurrentMainCategoryViaStore(event) {
  if (event.target.value) {
    const index = event.target.selectedIndex;
    const currentMainCategoryName = event.target[index].text;
    formDataStore.setCurrentMainCategory(event.target.value, currentMainCategoryName);
  } 
}

/**
 * Toggle CategoriesChildren component based on if there is main category stored or not
 */
function toggleCategoriesChildrenComponent() {
  //if there is a main category stored
  if (formDataStore.formData[0]) {
    render.value = true;
  } else {
    render.value = false;
  }
}

/**
 * Set children categories via store
 * @param: event: any
 * @return: void
 */
function setCategoriesChildrenViaStore(event) {
  
  for (const category of formDataStore.categoriesMain) {
    if (category.id == event.target.value) {
      formDataStore.setCategoriesChildren(category.children);
      return;
    }
  }
  formDataStore.setCategoriesChildren([]);
}

/**
 * Force child component to re-render
 * @return: void
 */
 const forceRerender = () => {
  componentKey.value += 1;
};
</script>