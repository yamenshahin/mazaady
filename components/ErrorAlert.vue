<template>
  <div>
    <CAlert v-if="props.pending" color="warning">Fetching...</CAlert>

    <!-- this error usually happened internally on server like 500 -->
    <CAlert v-else-if="props.error" color="danger">{{ props.error }}</CAlert>
    <!-- if data.code = 200 this mean it's successful request -->
    <div v-else-if="props.dataMSG">{{ props.dataMSG }}</div>
    <CAlert v-else color="info">Unknown error happened</CAlert>
  </div>
</template>

<script setup>
const props = defineProps(['pending', 'error', 'dataMSG']);
</script>