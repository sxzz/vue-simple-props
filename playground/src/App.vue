<!-- eslint-disable no-alert -->
<script setup lang="ts">
import { Comp } from './Comp'

function handleClick() {
  alert('click')
}
</script>

<template>
  <Comp style="color: red" foo="bar" @click="handleClick">
    <template #title="{ id }">title {{ id }}</template>
    <div>Hello</div>
  </Comp>
</template>
