<script setup lang="ts">
import type { PlayerKey } from '~/types';

// import havlijo01 from '~/assets/images/havlijo01.jpg';

const configStore = useConfigStore();
const { selectedPlayerIds, selectablePlayers, selectableCategories, selectedStatIds } =
  storeToRefs(configStore);
const { setSelectedPlayerIds, setSelectedStatIds } = configStore;

const interactionStore = useInteractionStore();
const { isPickerOpen, pickerType } = storeToRefs(interactionStore);
const { setIsPickerOpen, openPicker } = interactionStore;

const getImageUrl = (playerId) => {
  return new URL(`../../assets/images/player/${playerId}.jpg`, import.meta.url).href;
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

const value = ref('');

// First, create computed properties for filtered items
const filteredPlayers = computed(() => {
  if (!value.value) return selectablePlayers.value;

  const searchTerm = value.value.toLowerCase();
  return selectablePlayers.value.filter((player) =>
    player.info.name.toLowerCase().includes(searchTerm)
  );
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
    <div class="grid grid-rows-[auto,1fr] h-full">
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
            :ui="{ padding: 'py-3 px-5' }"
            :placeholder="`Search ${selectedIndex === 0 ? 'players' : 'stats'}...`"
            clearable
          />
        </div>
        <div class="">
          <UButton
            color="gray"
            size="sm"
            icon="i-heroicons-x-mark-20-solid"
            class="z-10"
            square
            padded
            @click="isOpen = false"
          />
        </div>
      </div>
      <div
        v-if="selectedIndex === 0"
        class="overflow-y-auto h-full"
      >
        <div
          v-if="hasResults"
          class="grid h-full"
        >
          <div class="p-4">
            <div class="grid grid-cols-8 gap-2">
              <TransitionGroup
                name="player-cards"
                tag="div"
                class="contents"
              >
                <button
                  v-for="(player, i) in filteredPlayers"
                  :key="`player-${i}`"
                  class="group relative p-3 border transition-all duration-200 rounded-md"
                  @click="togglePlayer(player.id)"
                >
                  <!-- Background pattern for selected state -->
                  <div
                    class="absolute inset-0 opacity-0 transition-opacity duration-200"
                    :class="[selectionPlayers.includes(player.id) && 'opacity-5']"
                  >
                    <div class="absolute inset-0 bg-primary-100 pattern-dots" />
                  </div>

                  <!-- Selected indicator -->
                  <!-- <div
                    class="absolute -top-2 -right-2 transform transition-transform duration-200"
                    :class="[
                      selectionPlayers.includes(player.id)
                        ? 'translate-x-0 text-primary-500 opacity-100'
                        : 'translate-x-0 opacity-0',
                    ]"
                  >
                    <UIcon
                      name="i-heroicons-check-circle-20-solid"
                      size="20"
                    />
                  </div> -->

                  <!-- Player content -->
                  <div class="relative grid text-left">
                    <div class="flex justify-center">
                      <img
                        :src="getImageUrl(player.id)"
                        class="h-20 object-contain rounded-sm"
                        alt=""
                      />
                    </div>
                    <div class="grid justify-center text-center">
                      <div class="font-medium truncate">{{ player.info.name }}</div>
                      <div
                        v-if="player.info.nickname"
                        class="text-xs text-gray-500"
                      >
                        {{ player.info.nickname }}
                      </div>
                    </div>
                    <!-- <div class="text-xs text-gray-500">
                      {{ player.info.position }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ player.info.height }}, {{ player.info.weight }}lb
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ player.info.birth_date }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ player.info.experience }} years of experience
                    </div>
                    <div
                      v-if="player.info.teams"
                      class="text-xs text-gray-500"
                    >
                      {{ player.info.teams.join(', ') }}
                    </div>
                    <div class="text-sm text-gray-500 truncate">
                      Drafted {{ player.info.draft[0] }} in {{ player.info.draft[1] }}
                    </div> -->
                  </div>

                  <!-- Hover overlay -->
                  <div
                    class="absolute inset-0 bg-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-5"
                  />
                </button>
              </TransitionGroup>
            </div>
          </div>
          <!-- <div class="border-l min-w-80 p-6">
            <div class="grid gap-4">
              <div class="uppercase font-host">Selected players</div>
              <div class="grid gap-2">
                <div
                  v-for="playerId in selectionPlayers"
                  :key="`selected-${playerId}`"
                >
                  <div class="bg-gray-100 border border-gray-200 rounded-md p-2">
                    {{
                      selectablePlayers.find((player) => player.id === playerId)?.info.name ||
                      'Unknown'
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div> -->
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
          class="p-4 py-10"
        >
          <div class="grid grid-cols-3 gap-5 items-start">
            <div
              v-for="(group, i) in filteredCategories"
              :key="`group-${i}`"
              class="grid gap-4 items-start px-20 border-l"
            >
              <h3 class="text-lg font-bold">{{ group.name }}</h3>
              <div class="grid gap-4 items-start">
                <div
                  v-for="(subCategory, j) in group.subCategories"
                  :key="`sub-group-${j}`"
                  class="grid gap-4"
                >
                  <h4 class="text-md font-bold">{{ subCategory.name }}</h4>
                  <div class="grid grid-cols-2 gap-x-4 gap-y-1">
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
</style>
