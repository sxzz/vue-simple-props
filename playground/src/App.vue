<!-- eslint-disable no-alert -->
<script setup lang="ts">
import { Comp } from './Comp'

function handleClick() {
  alert('click')
}
</script>

<template>
  <Comp foo="bar" @click="handleClick">
    <template #title>title</template>
    <div>Hello</div>
  </Comp>
</template>
