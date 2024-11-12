<script setup lang="ts">
useHead({ title: "Home | Broadway: Compare NFL's best QBs." });

const configStore = useConfigStore();
const { isLoaded } = storeToRefs(configStore);
</script>

<template>
  <div class="grid content">
    <div class="relative">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl">
        <div
          class="absolute -bottom-4 -left-8 transform -rotate-90 origin-top-left font-inter font-normal text-white opacity-25"
        >
          LeBron James - Michael Jordan - Kobe Bryant
        </div>
      </div>
      <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl">
        <div class="absolute top-0 left-0 w-1 h-[1000vh] bg-white" />
        <div class="absolute top-0 right-0 w-1 h-[1000vh] bg-white" />
      </div>
      <UContainer>
        <div class="relative py-12 px-2">
          <h1 class="uppercase text-white text-8xl">
            Compare the greatest basketball players of all time
          </h1>
        </div>
      </UContainer>
      <div v-if="isLoaded">
        <VisualisationChart />
      </div>
      <UContainer>
        <div class="relative py-20 px-10">
          <p class="text-white pl-4">(bottom)</p>
        </div>
      </UContainer>
    </div>
    <VisualisationPicker />
  </div>
</template>
