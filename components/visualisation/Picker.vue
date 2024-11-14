<script setup lang="ts">
import type { PlayerKey } from '~/types';

import { heightToInches } from '~/assets/scripts/utils';

const configStore = useConfigStore();
const {
  selectedPlayerIds,
  selectablePlayers,
  selectableCategories,
  selectableStats,
  selectedStatIds,
} = storeToRefs(configStore);
const {
  setSelectedPlayerIds,
  setSelectedStatIds,
  restoreDefaultPlayerSelection,
  restoreDefaultStatSelection,
} = configStore;

const interactionStore = useInteractionStore();
const { isPickerOpen, pickerType } = storeToRefs(interactionStore);
const { setIsPickerOpen, openPicker } = interactionStore;

const getImageUrl = (playerId: PlayerKey) => {
  return new URL(`../../assets/images/player/${playerId}.jpg`, import.meta.url).href;
};

const selectedOnly = ref(false);

const heightRange = ref([70, 96]); // 5'0" to 7'0" in inches
const weightRange = ref([150, 350]); // in pounds
const yearsRange = ref([1960, 2024]);

// Positions checkboxes
const positions = ref({
  PG: false,
  SG: false,
  SF: false,
  PF: false,
  C: false,
});

const positionEquivalents = {
  PG: 'Point Guard',
  SG: 'Shooting Guard',
  SF: 'Small Forward',
  PF: 'Power Forward',
  C: 'Center',
};

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

type Option = {
  label: string;
  key: string;
};

const isFiltersOpen = ref(false);

const isSortOpen = ref(false);
const isSortAscending = ref(false);

const sortOptions: Option[] = [
  {
    label: 'Name',
    key: 'name',
  },
  {
    label: 'Win Shares',
    key: 'win-shares',
  },
  {
    label: 'Height',
    key: 'height',
  },
  {
    label: 'Weight',
    key: 'weight',
  },
  {
    label: 'Experience',
    key: 'experience',
  },
  {
    label: 'Draft Year',
    key: 'draft-year',
  },
];

const currentSort = ref(sortOptions[1]);

const selectOption = (option: Option) => {
  if (currentSort.value.key === option.key) {
    isSortAscending.value = !isSortAscending.value;
  }
  currentSort.value = option;
  isSortOpen.value = false;
};

const clearFilters = () => {
  selectedOnly.value = false;
  heightRange.value = [70, 96];
  weightRange.value = [150, 350];
  yearsRange.value = [1960, 2024];
  Object.keys(positions.value).forEach(
    (position) => (positions.value[position as keyof typeof positions.value] = false)
  );
  isFiltersOpen.value = false;
};

const selectAllFilteredPlayers = () => {
  setSelectedPlayerIds(filteredPlayers.value.map((player) => player.id));
};

const value = ref('');

const filteredPlayers = computed(() => {
  const searchTerm = value.value.toLowerCase();

  const filteredBySearch = searchTerm
    ? selectablePlayers.value.filter((player) =>
        player.info.name.toLowerCase().includes(searchTerm)
      )
    : selectablePlayers.value;

  const filteredBySelected = selectedOnly.value
    ? filteredBySearch.filter((player) => selectedPlayerIds.value.includes(player.id))
    : filteredBySearch;

  const filteredByHeight = filteredBySelected.filter((player) => {
    const height = heightToInches(player.info.height);
    return height >= heightRange.value[0] && height <= heightRange.value[1];
  });

  const filteredByWeight = filteredByHeight.filter((player) => {
    const weight = parseInt(player.info.weight);
    return weight >= weightRange.value[0] && weight <= weightRange.value[1];
  });

  const filteredByYears = filteredByWeight.filter((player) => {
    const endYear = player.info.draft[1] + player.info.experience;

    return (
      endYear >= Math.min(yearsRange.value[0], yearsRange.value[1]) &&
      endYear <= Math.max(yearsRange.value[0], yearsRange.value[1])
    );
  });

  const selectedPositions = Object.entries(positions.value)
    .filter((position) => position[1])
    .map((position) => position[0]);

  const filteredByPosition = selectedPositions.length
    ? filteredByYears.filter((player) => {
        return selectedPositions.some((position) => {
          const equivalent = positionEquivalents[position as keyof typeof positionEquivalents];
          console.log(!!equivalent && player.info.position === equivalent);
          return !!equivalent && player.info.position === equivalent;
        });
      })
    : filteredByYears;

  return filteredByPosition;
});

const sortedPlayers = computed(() => {
  const copy = [...filteredPlayers.value];

  switch (currentSort.value.key) {
    case 'name':
      return copy.sort((a, b) => {
        const [aFirstName, aLastName] = a.info.name.split(' ');
        const [bFirstName, bLastName] = b.info.name.split(' ');

        return isSortAscending.value
          ? aLastName.localeCompare(bLastName) || aFirstName.localeCompare(bFirstName)
          : bLastName.localeCompare(aLastName) || bFirstName.localeCompare(aFirstName);
      });
    case 'win-shares':
      return copy.sort((a, b) => {
        return isSortAscending.value
          ? a.stats.winShares - b.stats.winShares
          : b.stats.winShares - a.stats.winShares;
      });
    case 'height':
      return copy.sort((a, b) => {
        const aHeight = heightToInches(a.info.height);
        const bHeight = heightToInches(b.info.height);

        return isSortAscending.value ? aHeight - bHeight : bHeight - aHeight;
      });
    case 'weight':
      return copy.sort((a, b) => {
        const aWeight = parseInt(a.info.weight);
        const bWeight = parseInt(b.info.weight);

        return isSortAscending.value ? aWeight - bWeight : bWeight - aWeight;
      });
    case 'experience':
      return copy.sort((a, b) => {
        return isSortAscending.value
          ? a.info.experience - b.info.experience
          : b.info.experience - a.info.experience;
      });
    case 'draft-year':
      return copy.sort((a, b) => {
        return isSortAscending.value
          ? a.info.draft[1] - b.info.draft[1]
          : b.info.draft[1] - a.info.draft[1];
      });
    default:
      return copy;
  }
});

// For stats, we need to maintain the category structure while filtering
const filteredCategories = computed(() => {
  if (!value.value) return selectableCategories.value;

  const searchTerm = value.value.toLowerCase();

  return selectableCategories.value
    .map((category) => ({
      ...category,
      subCategories: category.subCategories
        .map((subCategory) => ({
          ...subCategory,
          stats: subCategory.stats.filter((stat) => stat.name.toLowerCase().includes(searchTerm)),
        }))
        .filter((subCategory) => subCategory.stats.length > 0), // Remove empty subCategories
    }))
    .filter((category) => category.subCategories.length > 0); // Remove empty categories
});

// Add a helper computed to check if any results were found
const hasResults = computed(() => {
  if (selectedIndex.value === 0) {
    return filteredPlayers.value.length > 0;
  } else {
    return filteredCategories.value.some((category) =>
      category.subCategories.some((sub) => sub.stats.length > 0)
    );
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

const clearSelection = (type: 'players' | 'stats') => {
  if (type === 'players') {
    setSelectedPlayerIds([]);
  } else {
    setSelectedStatIds([]);
  }
};

const selectionPlayers = computed({
  get: () => selectedPlayerIds.value,
  set: (newValue) => {
    setSelectedPlayerIds(newValue);
  },
});

const selectionStats = computed({
  get: () => selectedStatIds.value,
  set: (newValue) => {
    setSelectedStatIds(newValue);
  },
});

const isOpen = computed({
  get: () => isPickerOpen.value,
  set: (newValue) => {
    setIsPickerOpen(newValue);
  },
});
</script>

<template>
  <USlideover
    v-model="isOpen"
    side="bottom"
    class="font-host"
  >
    <div class="grid grid-rows-[auto,auto,1fr] h-full">
      <div class="grid grid-cols-[auto,1fr,auto] gap-10 items-center border-b p-4">
        <div class="">
          <UTabs
            v-model="selectedIndex"
            :items="items"
            :ui="{ content: false }"
            @change="value = ''"
          />
        </div>
        <div class="">
          <UInput
            v-model="value"
            icon="i-radix-icons:magnifying-glass"
            padded
            size="md"
            color="gray"
            variant="outline"
            :placeholder="`Search ${selectedIndex === 0 ? 'players' : 'stats'}...`"
            clearable
          />
        </div>
        <div class="">
          <UButton
            color="gray"
            size="md"
            icon="i-heroicons-x-mark-20-solid"
            square
            padded
            @click="isOpen = false"
          />
        </div>
      </div>
      <template v-if="selectedIndex === 0">
        <div class="grid grid-flow-col justify-between py-3 mt-2 px-4">
          <div class="flex space-x-2 text-sm text-gray-500">
            <div class="">{{ selectedPlayerIds.length }} selected,</div>
            <div class="">{{ filteredPlayers.length }} filtered,</div>
            <div class="">{{ selectablePlayers.length }} total</div>
            <div class="">&#8226;</div>
            <div
              class="underline cursor-pointer"
              @click="clearSelection('players')"
            >
              Clear selection
            </div>
            <div class="">&#8226;</div>
            <div
              class="underline cursor-pointer"
              @click="restoreDefaultPlayerSelection"
            >
              Default selection
            </div>
            <div class="">&#8226;</div>
            <div
              class="underline cursor-pointer"
              @click="selectAllFilteredPlayers"
            >
              Select all filtered
            </div>
          </div>
          <div class="flex space-x-2 text-sm text-gray-500">
            <UPopover
              v-model:open="isFiltersOpen"
              :popper="{ arrow: true }"
            >
              <div class="underline">Filters</div>
              <template #panel>
                <div class="p-4">
                  <div class="filters-container rounded-lg">
                    <div class="flex">
                      <div
                        class="underline cursor-pointer mb-4"
                        @click="clearFilters()"
                      >
                        Clear filters
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="block text-sm text-gray-700 mb-1">Selected Only</label>
                      <UToggle v-model="selectedOnly" />
                    </div>

                    <!-- Height Range Slider -->
                    <div class="slider-container mb-5">
                      <label class="block text-sm text-gray-700 mb-2">
                        Height Range ({{ heightRange[0] }}" - {{ heightRange[1] }}")
                      </label>
                      <div class="relative h-1">
                        <div class="absolute h-full rounded-full bg-gray-300 w-full" />
                        <div
                          class="absolute h-full bg-primary-700 rounded-full"
                          :style="{
                            left: `${Math.min(
                              ((heightRange[0] - 70) / (96 - 70)) * 100,
                              ((heightRange[1] - 70) / (96 - 70)) * 100
                            )}%`,
                            right: `${
                              100 -
                              Math.max(
                                ((heightRange[0] - 70) / (96 - 70)) * 100,
                                ((heightRange[1] - 70) / (96 - 70)) * 100
                              )
                            }%`,
                          }"
                        />
                        <input
                          v-model="heightRange[0]"
                          type="range"
                          :min="70"
                          :max="96"
                          class="range-slider"
                        />
                        <input
                          v-model="heightRange[1]"
                          type="range"
                          :min="70"
                          :max="96"
                          class="range-slider"
                        />
                      </div>
                    </div>

                    <!-- Weight Range Slider -->
                    <div class="slider-container mb-5">
                      <label class="block text-sm text-gray-700 mb-2">
                        Weight Range ({{ weightRange[0] }} - {{ weightRange[1] }} lbs)
                      </label>
                      <div class="relative h-1">
                        <div class="absolute h-full rounded-full bg-gray-300 w-full" />
                        <div
                          class="absolute h-full bg-primary-700 rounded-full"
                          :style="{
                            left: `${Math.min(
                              ((weightRange[0] - 150) / (350 - 150)) * 100,
                              ((weightRange[1] - 150) / (350 - 150)) * 100
                            )}%`,
                            right: `${
                              100 -
                              Math.max(
                                ((weightRange[0] - 150) / (350 - 150)) * 100,
                                ((weightRange[1] - 150) / (350 - 150)) * 100
                              )
                            }%`,
                          }"
                        />
                        <input
                          v-model="weightRange[0]"
                          type="range"
                          :min="150"
                          :max="350"
                          class="range-slider"
                        />
                        <input
                          v-model="weightRange[1]"
                          type="range"
                          :min="150"
                          :max="350"
                          class="range-slider"
                        />
                      </div>
                    </div>

                    <!-- Years Range Slider -->
                    <div class="slider-container mb-5">
                      <label class="block text-sm text-gray-700 mb-2">
                        Years active ({{ Math.min(yearsRange[0], yearsRange[1]) }} -
                        {{ Math.max(yearsRange[0], yearsRange[1]) }})
                      </label>
                      <div class="relative h-1">
                        <div class="absolute h-full rounded-full bg-gray-300 w-full" />
                        <div
                          class="absolute h-full bg-primary-700 rounded-full"
                          :style="{
                            left: `${Math.min(
                              ((yearsRange[0] - 1960) / (2024 - 1960)) * 100,
                              ((yearsRange[1] - 1960) / (2024 - 1960)) * 100
                            )}%`,
                            right: `${
                              100 -
                              Math.max(
                                ((yearsRange[0] - 1960) / (2024 - 1960)) * 100,
                                ((yearsRange[1] - 1960) / (2024 - 1960)) * 100
                              )
                            }%`,
                          }"
                        />
                        <input
                          v-model.number="yearsRange[0]"
                          type="range"
                          :min="1960"
                          :max="2024"
                          class="range-slider"
                        />
                        <input
                          v-model.number="yearsRange[1]"
                          type="range"
                          :min="1960"
                          :max="2024"
                          class="range-slider"
                        />
                      </div>
                    </div>

                    <!-- Position Checkboxes -->
                    <div>
                      <label class="block text-sm text-gray-700 mb-1"> Positions </label>
                      <div class="flex gap-3">
                        <label
                          v-for="(checked, position) in positions"
                          :key="position"
                          class="flex items-center"
                        >
                          <UCheckbox v-model="positions[position]" />
                          <span class="ml-1 text-sm">{{ position }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </UPopover>
            <!-- <div class="underline">Filter by :</div> -->
            <div class="">&#8226;</div>
            <UPopover
              v-model:open="isSortOpen"
              :popper="{ arrow: true }"
            >
              <div class="flex items-center space-x-1 underline">
                <span>Sort by : {{ currentSort.label }}</span>
              </div>

              <template #panel>
                <div class="p-2 w-36">
                  <div
                    v-for="option in sortOptions"
                    :key="option.key"
                    role="menuitem"
                    class="px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-start items-center"
                    @click="selectOption(option)"
                  >
                    <UIcon
                      v-if="currentSort.key === option.key"
                      :name="
                        isSortAscending ? 'i-radix-icons:arrow-up' : 'i-radix-icons:arrow-down'
                      "
                      class="mr-2"
                    />
                    <span>
                      {{ option.label }}
                    </span>
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="grid grid-flow-col justify-between py-3 mt-2 px-4">
          <div class="flex space-x-2 text-sm text-gray-500">
            <div class="">{{ selectedStatIds.length }} Selected,</div>
            <div class="">{{ selectableStats.length }} Total</div>
            <div class="">&#8226;</div>
            <div
              class="underline cursor-pointer"
              @click="clearSelection('stats')"
            >
              Clear selection
            </div>
            <div class="">&#8226;</div>
            <div
              class="underline cursor-pointer"
              @click="restoreDefaultStatSelection"
            >
              Default selection
            </div>
          </div>
        </div>
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
            <div class="grid grid-cols-8 2xl:grid-cols-12 gap-4">
              <button
                v-for="(player, i) in sortedPlayers"
                :key="`player-${i}`"
                class="group relative p-2 border transition-all duration-50 rounded-sm bg-white focus:outline-primary-950/50"
                @click="togglePlayer(player.id)"
              >
                <!-- Background pattern for selected state -->
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

                <!-- Player content -->
                <div class="relative h-full flex flex-col justify-between">
                  <div
                    class="grid grid-flow-col justify-center items-center text-[10px] text-gray-400 mb-2"
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
                      <div class="text-xs text-gray-500 mt-1">
                        {{ player.info.position }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ player.info.height }} {{ player.info.weight }}lb
                      </div>
                    </div>
                  </div>
                  <div class="grid justify-center items-center text-[10px] text-gray-400 mt-2">
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
          No players found matching "{{ value }}"
        </div>
      </div>
      <div
        v-if="selectedIndex === 1"
        class="overflow-y-auto h-full"
      >
        <div
          v-if="hasResults"
          class="p-4 pt-3 pb-10"
        >
          <div class="grid grid-cols-3 gap-20 items-start">
            <div
              v-for="(group, i) in filteredCategories"
              :key="`group-${i}`"
              class="grid gap-4 items-start"
              :class="i === 0 ? 'border-transparent' : 'border-gray-200'"
            >
              <h3 class="text-lg font-bold">{{ group.name }}</h3>
              <div class="grid gap-4 items-start">
                <div
                  v-for="(subCategory, j) in group.subCategories"
                  :key="`sub-group-${j}`"
                  class="grid gap-4"
                >
                  <h4 class="text-md font-bold">{{ subCategory.name }}</h4>
                  <div class="grid grid-cols-3 gap-x-4 gap-y-1">
                    <div
                      v-for="(column, k) in subCategory.stats"
                      :key="`column-${k}`"
                      class=""
                    >
                      <UCheckbox
                        v-model="selectionStats"
                        :value="column.id"
                        :label="column.name"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="p-4 text-center text-gray-500"
        >
          No stats found matching "{{ value }}"
        </div>
      </div>
    </div>
  </USlideover>
</template>

<style scoped>
.player-cards-move,
.player-cards-enter-active,
.player-cards-leave-active {
  transition: all 0.25s ease;
}

.player-cards-enter-from,
.player-cards-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.player-cards-leave-active {
  /* position: absolute; */
  opacity: 0;
}

.slider-container {
  @apply relative w-full;
}

.range-slider {
  @apply absolute w-full appearance-none bg-transparent pointer-events-none;
  top: -11px; /* Adjust thumb vertical alignment */
  height: 1rem;
}

.range-slider::-webkit-slider-thumb {
  @apply h-4 w-4 rounded-full border-none bg-primary-800 cursor-pointer pointer-events-auto relative;
  -webkit-appearance: none;
}

.range-slider::-moz-range-thumb {
  @apply h-4 w-4 rounded-full border-none bg-primary-800 cursor-pointer pointer-events-auto relative;
}

.range-slider::-webkit-slider-runnable-track {
  @apply w-full h-1 bg-transparent cursor-pointer;
}

.range-slider::-moz-range-track {
  @apply w-full h-1 bg-transparent cursor-pointer;
}

/* Make both thumbs appear above track */
.range-slider {
  @apply z-20;
}

/* Hover and focus states */
.range-slider::-webkit-slider-thumb:hover,
.range-slider::-moz-range-thumb:hover {
  @apply bg-blue-600;
}

.range-slider:focus {
  @apply outline-none;
}

.range-slider:focus::-webkit-slider-thumb {
  @apply ring-2 ring-blue-300;
}

.range-slider:focus::-moz-range-thumb {
  @apply ring-2 ring-blue-300;
}
</style>
