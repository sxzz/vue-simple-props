<!-- eslint-disable no-alert -->
<script setup lang="ts">
import { Comp } from './Comp'
import { Comp2 } from './Comp2'

function handleClick() {
  alert('click')
}
</script>

<template>
  <Comp foo="bar" @click="handleClick">
    <template #title="{ id }">title {{ id }}</template>
    <div>Hello</div>
  </Comp>
  <Comp2 foo="bar" @click="handleClick">
    <template #title="{ id }">title {{ id }}</template>
    <div>Hello222</div>
  </Comp2>
</template>
