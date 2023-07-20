<template>
  <h1>Welcome</h1>
  {{  message }}
    <p>Interactive <Counter /></p>
</template>

<script lang="ts" setup>

const message = 'I do some </> stuff'

import Counter from './Counter.vue'
</script>
