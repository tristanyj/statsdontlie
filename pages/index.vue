<script setup lang="ts">
useHead({ title: "Home | Broadway: Compare NFL's best QBs." });
</script>

<template>
  <div class="grid">
    <VisualisationChart />
    <div class="grid grid-flow-col gap-10 justify-center">
      <VisualisationPickerPlayer />
      <UDivider orientation="vertical" />
      <VisualisationPickerStat />
    </div>
  </div>
</template>
