<script setup lang="ts">
const configStore = useConfigStore();
const { selectedPlayerIds, selectablePlayers, selectableCategories, selectedStatIds } =
  storeToRefs(configStore);
const { setSelectedPlayerIds, setSelectedStatIds } = configStore;

const interactionStore = useInteractionStore();
const { isPickerOpen, pickerType } = storeToRefs(interactionStore);
const { setIsPickerOpen, openPicker } = interactionStore;

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
    class="font-inter"
  >
    <div class="grid grid-rows-[auto,1fr] h-full">
      <div class="grid grid-cols-[auto,1fr,auto] gap-10 items-center font-inter border-b p-4">
        <div class="">
          <UTabs
            v-model="selectedIndex"
            :items="items"
            :ui="{ content: false }"
          />
        </div>
        <div class="">
          <UInput v-model="value" />
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
      <div class="overflow-y-auto">
        <div v-if="selectedIndex === 0">
          <h2 class="text-2xl font-bold text-center">Select Players</h2>
          <div class="flex justify-center p-5">
            <div class="grid grid-flow-col gap-5 text-center">
              <div
                v-for="(player, i) in selectablePlayers"
                :key="`player-${i}`"
                class=""
              >
                <div class="">
                  <UCheckbox
                    v-model="selectionPlayers"
                    :value="player.id"
                    :label="player.info.name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedIndex === 1">
          <h2 class="text-2xl font-bold text-center">Select Stats</h2>
          <div class="flex justify-center p-5">
            <div class="grid grid-cols-3 gap-5 text-center">
              <div
                v-for="(group, i) in selectableCategories"
                :key="`group-${i}`"
              >
                <h3 class="text-lg font-bold">{{ group.name }}</h3>
                <div class="">
                  <div
                    v-for="(subCategory, j) in group.subCategories"
                    :key="`sub-group-${j}`"
                    class=""
                  >
                    <h4 class="text-md font-bold">{{ subCategory.name }}</h4>
                    <div class="">
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
        </div>
      </div>
    </div>
  </USlideover>
</template>
