<script setup lang="ts">
import dataset from '@/assets/data/dataset.json';
import type { Category, Player } from './types';

const configStore = useConfigStore();
const { setCategories, setPlayers } = configStore;

onMounted(() => {
  setCategories(dataset.config.categories as unknown as Category[]);
  setPlayers(dataset.players as unknown as Player[]);
});
</script>

<template>
  <main class="font-host">
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <!-- <NavigationHeader /> -->
    <NuxtPage />
  </main>
</template>
