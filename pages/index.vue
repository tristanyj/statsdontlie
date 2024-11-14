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
      <!-- <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl">
        <div
          class="absolute -bottom-4 -left-8 transform -rotate-90 origin-top-left font-normal text-white opacity-25"
        >
          LeBron James - Michael Jordan - Kobe Bryant
        </div>
      </div> -->
      <!-- <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl">
      </div> -->
      <UContainer class="relative">
        <div class="absolute top-0 left-0 w-1 h-[100vh] bg-white" />
        <div class="absolute top-0 right-0 w-1 h-[100vh] bg-white" />
        <div class="relative py-12 pb-6 px-2 font-anton">
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
          <div class="mt-5">
            <!-- <div class="grid grid-cols-2 border-4 border-white">
              <div
                class="flex justify-center items-center border-r-4 border-white cursor-pointer py-1 transition-color duration-100 hover:bg-white/5"
                @click="openPicker('players')"
              >
                <div class="text-white font-medium uppercase">Select players</div>
              </div>
              <div
                class="flex justify-center items-center cursor-pointer py-1 transition-color duration-100 hover:bg-white/5"
                @click="openPicker('stats')"
              >
                <div class="text-white font-medium uppercase">Select stats</div>
              </div>
            </div> -->
          </div>
        </div>
      </UContainer>
      <div v-if="isLoaded">
        <VisualisationChart />
      </div>
      <UContainer>
        <div class="relative py-16 px-10 text-center lowercase">
          <p class="text-white pl-4">
            Created by Tristan Lanoye |
            <a
              href="https://tristanyj.com"
              class="underline"
              >tristanyj.com</a
            >
          </p>
          <div class="max-w-80 mx-auto h-px bg-white my-4 opacity-25" />
          <div class="text-gray-200 text-sm lowercase">
            Data from
            <a
              href="https://www.basketball-reference.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-gray-100 transition-colors duration-50 underline"
              >Basketball Reference</a
            >; <br />
            up to date as of november 2024.
          </div>
        </div>
      </UContainer>
    </div>
    <VisualisationPicker />
  </div>
</template>
