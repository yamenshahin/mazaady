
<template>
  <div>
    <div v-if="pending || error || data.code !== 200">
      <ErrorAlert :pending="pending" :error="error" />
    </div>
    <!-- if data.code = 200 this mean it's successful request -->
    <div v-else>
      <!-- if data.data.length > 0 this mean no data -->
      <div v-if="data.data.length > 0">
        

        <div v-for="property in formDataStore.properties" :key="property.id">
          <h5>{{property.name}}</h5>
          
          <!-- Loop through options -->
          <OptionsMain :property="property"/>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const { config } = useCustomUtils();
const formDataStore = useFormDataStore();
const render = ref(false);

// Get all properties right after loading the page/component
const { data, pending, error, refresh } = await useFetch(`${config.public.apiBase}/properties?cat=${formDataStore.formData[1]['child category id']}`, {
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
  onResponse(context) {
    const finalData = context.response._data;
    if (context.response._data.code === 200) {
      formDataStore.setProperties(finalData.data);
    }
  },
});
</script>