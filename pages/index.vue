<script setup lang="ts">
import dataset from '@/assets/data/players.json';

useHead({ title: "Home | Broadway: Compare NFL's best QBs." });

const preferencesStore = usePreferencesStore();
const { selectedQBs } = storeToRefs(preferencesStore);

const playersPickerFormatted = dataset.players.map((player) => ({
  id: player.id,
  name: player.name,
}));

const playersChartFormatted = dataset.players.filter((player) => selectedQBs.value.includes(player.id));

watch(selectedQBs, (newSelection) => {
  console.log({ dataset, newSelection });
});
</script>

<template>
  <div class="grid gap-5 pb-10">
    <h1 class="text-3xl font-bold text-center">NFL Quarterback Career Statistics</h1>
    <VisualisationPicker :players="playersPickerFormatted" />
    <VisualisationChart :players="playersChartFormatted" />
  </div>
</template>
