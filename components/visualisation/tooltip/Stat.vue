<script setup lang="ts">
defineProps<{
  value: string;
  statName: string;
  name: string;
  color: string;
}>();
</script>

<template>
  <div
    class="p-2"
    :style="{ background: `${color}33` }"
  >
    <div class="text-2xl font-semibold">
      {{ value }} <span class="text-base">{{ statName }}</span>
    </div>
    <div class="flex space-x-1 items-center">
      <div
        class="w-3 h-3 rounded-sm"
        :style="{
          background: color,
        }"
      />
      <div class="text-sm">{{ name }}</div>
    </div>
  </div>
</template>
