<script setup lang="ts">
useHead({ title: "Home | Broadway: Compare NFL's best QBs." });

const configStore = useConfigStore();
const { isLoaded } = storeToRefs(configStore);
</script>

<template>
  <div class="grid">
    <!-- <Transition
      name="fade"
      mode="out-in"
    > -->
    <div v-if="isLoaded">
      <VisualisationChart />
      <div class="grid grid-flow-col gap-10 justify-center">
        <VisualisationPickerPlayer />
        <UDivider orientation="vertical" />
        <VisualisationPickerStat />
      </div>
    </div>
    <!-- </Transition> -->
  </div>
</template>
