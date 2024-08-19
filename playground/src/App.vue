<!-- eslint-disable no-alert -->
<script setup lang="ts">
import { ref } from 'vue'
import { Comp } from './Comp'

const foo = ref('foo')

function handleClick() {
  alert('click')
}

function updateFoo() {
  foo.value = 'bar'
}

const clickHandler = ref(handleClick)
</script>

<template>
  <button @click="clickHandler = updateFoo">update handler</button>

  <Comp style="color: red" :foo="foo" @click="clickHandler">
    <template #title="{ count: id }">count: {{ id }}</template>
    <div>Hello</div>
  </Comp>
</template>
