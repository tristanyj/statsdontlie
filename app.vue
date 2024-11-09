<script setup lang="ts">
import dataset from '@/assets/data/dataset.json';
import type { Group, Player } from './types';

const configStore = useConfigStore();
const { setStatGroups, setPlayers } = configStore;

onMounted(() => {
  setStatGroups(dataset.config.categories as unknown as Group[]);
  setPlayers(dataset.players as unknown as Player[]);
});
</script>

<template>
  <main>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NavigationHeader />
    <NuxtPage />
  </main>
</template>
