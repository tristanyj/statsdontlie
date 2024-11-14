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
      <!-- <VisualisationTest /> -->
      <div class="absolute top-0 left-[10%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[20%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[30%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[40%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[50%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[60%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[70%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[80%] h-full w-1 bg-white opacity-[3%]" />
      <div class="absolute top-0 left-[90%] h-full w-1 bg-white opacity-[3%]" />
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
        <!-- <div class="absolute top-0 left-0 w-1 h-[100vh] bg-white" />
        <div class="absolute top-0 right-0 w-1 h-[100vh] bg-white" /> -->
        <div class="relative py-16 font-anton">
          <!-- <div class="mb-5"></div> -->
          <div class="flex justify-center relative mb-5">
            <div class="relative">
              <img
                :src="basketCircle"
                alt=""
                class="w-36 h-36 spin-slow"
              />
              <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28"
              >
                <img
                  :src="basket"
                  alt="Basketball"
                  class="w-full spin-slow-reverse"
                />
              </div>
            </div>
          </div>
          <h1 class="uppercase text-white text-center text-8xl">
            Stats don't lie
            <!-- <span class="text-7xl">Compare the greatest <br /> </span>
            <span class="text-5xl"> basketball players of all time </span> -->
          </h1>
          <div class="mt-8">
            <div class="grid grid-cols-[1fr,2fr] gap-6 text-justify">
              <p class="font-host text-gray-100">
                I follow sports for storylines and numbers. I like statistics, records, rivalries. I
                probably like that better than actually watching the thing. This visualization was
                created to explore my interest.
              </p>
              <p class="font-host text-gray-100 text-justify">
                Basketball history is filled with great stories and achievements. I collected data
                for 50 players and 130+ statistics from
                <a
                  href="https://www.basketball-reference.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline"
                  >Basketball Reference</a
                >. Stats are mapped around a circle on a scale from usually 0 to the NBA record.
                Each player has its own color. You can click the center of the chart to choose
                players and stats to compare.

                <!-- Stats are grouped by categories and types. Each player has its own color. The
                arc's length is proportional to the player's value in that stat compared to the NBA
                record. -->
              </p>
              <!-- <p class="font-host text-gray-50">
                On a technical note, I used Vue 3, Vite, and Tailwind CSS. Don't try to select more
                than 50 statistics at the time, it may hurt the chart.
              </p> -->
            </div>
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
