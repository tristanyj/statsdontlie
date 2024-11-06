<script setup lang="ts">
import dataset from '@/assets/data/players.json';
import type { Player } from '@/types';

useHead({ title: "Home | Broadway: Compare NFL's best QBs." });

const DATASET = dataset as unknown as { players: Player[] };

const playersPickerFormatted = DATASET.players.map((player) => ({
  id: player.id,
  name: player.name,
}));
</script>

<template>
  <div class="grid">
    <!-- <h1 class="text-2xl font-bold text-center">NFL Quarterback Career Statistics</h1> -->
    <VisualisationChart :players="DATASET.players" />
    <div class="grid grid-flow-col gap-10 justify-center">
      <VisualisationPickerPlayer :players="playersPickerFormatted" />
      <UDivider orientation="vertical" />
      <VisualisationPickerStat />
    </div>
  </div>
</template>
