<script setup lang="ts">
import basket from '@/assets/images/basket.svg';
useHead({ title: "Home | Broadway: Compare NFL's best QBs." });

const configStore = useConfigStore();
const { isLoaded } = storeToRefs(configStore);

const interactionStore = useInteractionStore();
const { openPicker } = interactionStore;
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
          <!-- <div class="mb-5"></div> -->
          <h1 class="uppercase text-white text-8xl">
            <div class="relative w-24 inline-block">
              <img
                :src="basket"
                alt="Basketball"
                class="absolute bottom-0 left-3 inline w-24 h-24 center-image"
              />
            </div>
            Compare the greatest basketball players of all time
          </h1>
          <div class="px-2">
            <div class="grid grid-cols-2 border-4 border-white">
              <div
                class="flex justify-center items-center border-r-4 border-white cursor-pointer"
                @click="openPicker('players')"
              >
                <div class="text-white font-medium uppercase">Select players</div>
              </div>
              <div
                class="flex justify-center items-center cursor-pointer"
                @click="openPicker('stats')"
              >
                <div class="text-white font-medium uppercase">Select stats</div>
              </div>
            </div>
          </div>
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
