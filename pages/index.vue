<script setup lang="ts">
import basket from '@/assets/images/basket.svg';
import basketCircle from '@/assets/images/basket-circle.svg';

useHead({ title: "Home | Broadway: Compare NFL's best QBs." });

const configStore = useConfigStore();
const { isLoaded } = storeToRefs(configStore);
</script>

<template>
  <div class="grid content">
    <div class="relative">
      <div class="absolute top-0 left-[10%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[20%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[30%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[40%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[50%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[60%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[70%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[80%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[90%] h-full w-1 bg-white opacity-[3%]" />
      <UContainer class="relative">
        <div class="relative py-16 font-anton">
          <div class="flex justify-center relative mb-5">
            <div class="relative">
              <img
                :src="basketCircle"
                alt=""
                class="w-32 h-32 md:w-36 md:h-36 spin-slow"
              />
              <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 md:w-28 h-24 md:h-28"
              >
                <img
                  :src="basket"
                  alt="Basketball"
                  class="w-full spin-slow-reverse"
                />
              </div>
            </div>
          </div>
          <h1 class="uppercase text-white text-center text-7xl md:text-8xl">Stats don't lie</h1>
          <div class="mt-8">
            <div class="grid md:grid-cols-2 gap-6 text-justify">
              <p class="font-host text-gray-100">
                I follow sports for storylines and numbers. I like statistics, records, rivalries. I
                probably like that better than actually watching the thing. In this visualization, I
                tried conveying what fascinates me about sports by comparing some of the greatest
                basketball players of all time.
              </p>
              <p class="font-host text-gray-100 text-justify">
                I collected data for 50 players and 130+ statistics from
                <a
                  href="https://www.basketball-reference.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline"
                  >Basketball Reference</a
                >. Stats are mapped around a circle on a scale from usually 0 to the NBA record.
                Each player has its own color. You can click the center of the chart to choose
                players and stats to compare.
              </p>
            </div>
          </div>
        </div>
      </UContainer>
      <div class="relative px-4">
        <VisualisationChart v-if="isLoaded" />
        <div
          v-else
          class="relative max-w-[1400px] w-full mx-auto"
        >
          <div class="pb-[100%]" />
          <div class="absolute inset-0 animate-pulse rounded-full bg-gray-100 opacity-20" />
        </div>
      </div>
      <UContainer>
        <div class="relative py-16 text-center lowercase">
          <p class="text-white">
            Created by Tristan Lanoye
            <span class="relative right-1 mx-3 opacity-50">|</span>
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
