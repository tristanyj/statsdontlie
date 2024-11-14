<script setup lang="ts">
import type { PlayerKey } from '~/types';

defineProps<{
  id: PlayerKey;
  value: string;
  statAbbreviation: string;
  name: string;
  color: string;
}>();

const getImageUrl = (playerId: PlayerKey) => {
  return new URL(`../../../assets/images/player/${playerId}.jpg`, import.meta.url).href;
};
</script>

<template>
  <div
    class="flex space-x-2 items-center p-2"
    :style="{ background: `${color}33` }"
  >
    <img
      :src="getImageUrl(id)"
      class="h-16 object-contain rounded-sm"
      alt=""
    />
    <div class="">
      <div class="text-2xl">
        <span class="font-semibold mr-1">{{ value }}</span>
        <span class="text-sm">{{ statAbbreviation }}</span>
      </div>
      <div class="flex space-x-1 items-center">
        <div
          class="w-2 h-2 rounded-full"
          :style="{
            background: color,
          }"
        />
        <div class="text-sm">{{ name }}</div>
      </div>
    </div>
  </div>
</template>
