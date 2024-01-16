<template>
  <div>
    <MainNav />
    <div class="container">
      <CForm>
        <CategoriesMain />
        <CButton color="primary" size="lg" @click="submitForm">Submit</CButton>
      </CForm>

      <table v-if="render">
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>

      </table>
    </div>

  </div>
</template>
  
<script setup>
const formDataStore = useFormDataStore();
const render = ref(false);

/**
 * Handel submitting form
 */
function submitForm(event) {
  event.preventDefault();
  render.value = true;
  console.log(flatten(toRaw(formDataStore.formData[2])))
}

/**
 * Flatten obj
 */
 function flatten(obj) {
  if(!Array.isArray(obj)) {
    if(obj['sub options']) {
      return obj['sub options']
    } else {
      return obj['sub options']
    }
  } 
}
</script>