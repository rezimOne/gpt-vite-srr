<template>
  <div class="layout">
    <div class="navigation">
     <NavigationBar />
    </div>
    <div class="content"><slot /></div>
  </div>
</template>

<script lang="ts" setup>
import { watch, computed } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'
import { usePageContext } from './usePageContext';

const pageContext = computed(() => usePageContext());

watch(
  () => pageContext.value,
  (pageContext) => {
    console.log('pageContext: ', pageContext.urlPathname);
  },
  { deep: true }
)

</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
  background: #628069;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
</style>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: auto;
}
.content {
  padding: 20px;
  /* border-left: 2px solid #eee; */
  padding-bottom: 50px;
  min-height: 90vh;
}
.navigation {
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.8em;
}
</style>
