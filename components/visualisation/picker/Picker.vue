<script setup lang="ts">
import type { PlayerKey } from '~/types';

// import { POSITION_EQUIVALENT } from '~/assets/scripts/constants';

// import { heightToInches, formatString } from '~/assets/scripts/utils';

const configStore = useConfigStore();
const { searchInput } = storeToRefs(configStore);

const interactionStore = useInteractionStore();
const { isPickerOpen, pickerType } = storeToRefs(interactionStore);
const { setIsPickerOpen, openPicker } = interactionStore;

const playerConfigStore = usePlayerConfigStore();
const { sortedPlayers, filteredPlayers, selectedPlayerIds } = storeToRefs(playerConfigStore);
const { setSelectedPlayerIds } = playerConfigStore;

const getImageUrl = (playerId: PlayerKey) => {
  return new URL(`../../../assets/images/player/${playerId}.jpg`, import.meta.url).href;
};

// const selectedOnly = ref(false);
// const selectedOnlyStats = ref(false);

// const categories = ref({
//   'Regular Season': true,
//   'Post Season': true,
//   Awards: true,
// });

// const subCategories = ref({
//   Total: true,
//   'Per Game': true,
//   Advanced: true,
//   'Game High': true,
//   Individual: true,
//   Team: true,
// });

const items = [
  {
    key: 'players',
    label: 'Select players',
    icon: 'i-radix-icons:avatar',
  },
  {
    key: 'stats',
    label: 'Select stats',
    icon: 'i-radix-icons:crosshair-2',
  },
];

const selectedIndex = computed({
  get: () => items.findIndex((item) => item.key === pickerType.value),
  set: (newValue: number) => {
    openPicker(items[newValue].key as 'players' | 'stats');
  },
});

// const getChunks = (
//   array: {
//     id: string;
//     name: string;
//   }[],
//   columns: number
// ) => {
//   // Determine number of chunks based on array length
//   const numberOfChunks = array.length < 4 ? 1 : array.length < 7 ? 2 : columns;

//   const chunkSize = Math.ceil(array.length / numberOfChunks);
//   const chunks: (typeof array)[] = Array(numberOfChunks)
//     .fill([])
//     .map(() => []);

//   array.forEach((item, index) => {
//     const chunkIndex = Math.floor(index / chunkSize);
//     if (chunkIndex < numberOfChunks) {
//       chunks[chunkIndex].push(item);
//     }
//   });

//   return chunks;
// };

// const filteredCategories = computed(() => {
//   const searchTerm = value.value.toLowerCase();

//   return selectableCategories.value
//     .map((category) => ({
//       ...category,
//       subCategories: category.subCategories
//         .map((subCategory) => ({
//           ...subCategory,
//           stats: subCategory.stats
//             .filter((stat) => (value.value ? stat.name.toLowerCase().includes(searchTerm) : true))
//             .filter((stat) =>
//               selectedOnlyStats.value ? selectedStatIds.value.includes(stat.id) : true
//             )
//             .filter((stat) => {
//               const [categoryId, subCategoryId] = stat.id.split('.');
//               const parsedCategoryId = formatString(categoryId);
//               const parsedSubCategoryId = formatString(subCategoryId);

//               return (
//                 categories.value[parsedCategoryId as keyof typeof categories.value] &&
//                 subCategories.value[parsedSubCategoryId as keyof typeof subCategories.value]
//               );
//             }),
//         }))
//         .filter((subCategory) => subCategory.stats.length > 0), // Remove empty subCategories
//     }))
//     .filter((category) => category.subCategories.length > 0); // Remove empty categories
// });

// Add a helper computed to check if any results were found
const hasResults = computed(() => {
  if (selectedIndex.value === 0) {
    return filteredPlayers.value.length > 0;
  } else {
    return false;
    // return filteredCategories.value.some((category) =>
    //   category.subCategories.some((sub) => sub.stats.length > 0)
    // );
  }
});

const togglePlayer = (playerId: PlayerKey) => {
  if (selectionPlayers.value.includes(playerId)) {
    // Remove player
    setSelectedPlayerIds(selectionPlayers.value.filter((id) => id !== playerId));
  } else {
    // Add player
    setSelectedPlayerIds([...selectionPlayers.value, playerId]);
  }
};

const selectionPlayers = computed({
  get: () => selectedPlayerIds.value,
  set: (newValue) => {
    setSelectedPlayerIds(newValue);
  },
});

// const selectionStats = computed({
//   get: () => selectedStatIds.value,
//   set: (newValue) => {
//     setSelectedStatIds(newValue);
//   },
// });

const isOpen = computed({
  get: () => isPickerOpen.value,
  set: (newValue) => {
    setIsPickerOpen(newValue);
  },
});

watch(
  () => isOpen.value,
  (newValue) => {
    if (newValue) {
      searchInput.value = '';
    }
  }
);
</script>

<template>
  <USlideover
    v-model="isOpen"
    side="bottom"
    class="font-host"
  >
    <div class="grid grid-rows-[auto,auto,1fr] h-full">
      <VisualisationPickerHeader
        v-model="selectedIndex"
        v-model:searchValue="searchInput"
        :items="items"
        @change="searchInput = ''"
        @close="isOpen = false"
      />
      <template v-if="selectedIndex === 0">
        <VisualisationPickerFilterPlayer />
      </template>
      <template v-else>
        <VisualisationPickerFilterStat />
      </template>
      <div
        v-if="selectedIndex === 0"
        class="overflow-y-auto h-full"
      >
        <div
          v-if="hasResults"
          class="grid h-full"
        >
          <div class="p-4 pt-3">
            <div
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4"
            >
              <button
                v-for="(player, i) in sortedPlayers"
                :key="`player-${i}`"
                class="group relative p-2 border transition-all duration-50 rounded-sm bg-white focus:outline-primary-950/50"
                @click="togglePlayer(player.id)"
              >
                <div
                  class="absolute inset-0 opacity-0 transition-opacity duration-0"
                  :class="[
                    selectionPlayers.includes(player.id) ? 'opacity-50' : 'group-hover:opacity-10',
                  ]"
                >
                  <div
                    class="absolute inset-0 transform scale-x-[1.06] scale-y-[1.04] rounded-md bg-primary-950"
                  />
                  <div class="absolute inset-0 bg-white rounded-sm" />
                </div>

                <div class="relative h-full flex flex-col justify-between">
                  <div
                    class="grid grid-flow-col justify-center items-center text-xs text-gray-400 mb-2"
                  >
                    <div class="">{{ player.info.nickname }}</div>
                  </div>
                  <div class="flex flex-col items-center">
                    <img
                      :src="getImageUrl(player.id)"
                      class="h-20 object-contain rounded-sm"
                      alt=""
                    />
                    <div class="text-center mt-2">
                      <div class="items-start font-medium leading-[18px]">
                        <div
                          class="relative left-[3px] bottom-[2px] inline-block w-2 h-2 rounded-full mr-1"
                          :style="{
                            background: player.color,
                          }"
                        />
                        {{ player.info.name }}
                      </div>
                      <div class="text-sm text-gray-500 mt-1">
                        {{ player.info.position }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ player.info.height }} {{ player.info.weight }}lb
                      </div>
                    </div>
                  </div>
                  <div class="grid justify-center items-center text-xs text-gray-400 mt-2">
                    <div>
                      {{ player.info.draft[1] }}-{{ player.info.draft[1] + player.info.experience }}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div
          v-else
          class="p-4 text-center text-gray-500"
        >
          No players found matching criteria
        </div>
      </div>
      <div
        v-if="selectedIndex === 1"
        class="overflow-y-auto h-full"
      >
        <!-- v-if="hasResults" -->
        <div
          v-if="false"
          class="p-4 pt-3 pb-10"
        >
          <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-10 xl:gap-20 items-start">
            <!-- <div
              v-for="(group, i) in sortedCategories"
              :key="`group-${i}`"
              class="grid gap-3 items-start"
              :class="i === 0 ? 'border-transparent' : 'border-gray-200'"
            >
              <div class="flex">
                <div class="relative text-lg font-bold">
                  <div
                    class="absolute left-0 top-0 w-full h-full inline-block transform scale-110 rounded-sm mr-1"
                    :style="{
                      background: `${group.color}66`,
                    }"
                  />
                  <h3 class="relative">
                    {{ group.name }}
                  </h3>
                </div>
              </div>
              <div class="grid gap-4 items-start">
                <div
                  v-for="(subCategory, j) in group.subCategories"
                  :key="`sub-group-${j}`"
                  class="grid gap-2"
                >
                  <div class="flex">
                    <div
                      class="darken relative text-md font-bold cursor-pointer"
                      @click="toggleSubCategorySelection(subCategory.id)"
                    >
                      <div
                        class="absolute left-0 top-0 w-full h-full inline-block transform scale-110 rounded-sm mr-1"
                        :style="{
                          background: `${subCategory.color}33`,
                        }"
                      />
                      <h4 class="relative">
                        {{ subCategory.name }}
                      </h4>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-3 items-start gap-x-2 sm:gap-x-5">
                    <div
                      v-for="(chunk, k) in getChunks(subCategory.stats, 3)"
                      :key="`chunk-${k}`"
                      class="grid gap-y-1 items-start"
                    >
                      <div
                        v-for="(column, index) in chunk"
                        :key="`column-${index}`"
                        class=""
                      >
                        <UCheckbox
                          v-model="selectionStats"
                          :ui="{ inner: 'ms-1.5 flex flex-col' }"
                          :value="column.id"
                          :label="column.name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </div>
        <div
          v-else
          class="p-4 text-center text-gray-500"
        >
          No stats found matching criteria
        </div>
      </div>
    </div>
  </USlideover>
</template>
