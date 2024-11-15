<script setup lang="ts">
import type { SortOption } from '~/types';

import { PLAYER_SORT_OPTIONS } from '~/assets/scripts/constants';

const playerConfigStore = usePlayerConfigStore();
const {
  isSortAscending,
  currentSort,
  isFiltered,
  filters,
  filteredPlayers,
  selectedPlayerIds,
  selectablePlayers,
} = storeToRefs(playerConfigStore);
const {
  setSelectedPlayerIds,
  restoreDefaultPlayerSelection,
  selectAllFilteredPlayers,
  clearFilters,
} = playerConfigStore;

const clearSelection = () => {
  setSelectedPlayerIds([]);
};

const isFiltersOpen = ref(false);
const isSortOpen = ref(false);

const selectOption = (option: SortOption) => {
  if (currentSort.value.key === option.key) {
    isSortAscending.value = !isSortAscending.value;
  }
  currentSort.value = option;
  isSortOpen.value = false;
};
</script>

<template>
  <VisualisationPickerFilter
    v-model:isFiltersOpen="isFiltersOpen"
    v-model:isSortOpen="isSortOpen"
    :is-sort-ascending="isSortAscending"
    :is-filtered="isFiltered"
    :selectable-length="selectablePlayers.length"
    :selected-length="selectedPlayerIds.length"
    :filtered-length="filteredPlayers.length"
    :total-length="selectablePlayers.length"
    :sort-options="PLAYER_SORT_OPTIONS"
    :current-sort="currentSort"
    @clear-selection="clearSelection"
    @restore-default-selection="restoreDefaultPlayerSelection"
    @select-all-filtered="selectAllFilteredPlayers"
    @clear-filters="clearFilters"
    @select-option="selectOption"
  >
    <div class="filters-container rounded-lg">
      <div class="mb-3">
        <label class="block text-sm text-gray-700 mb-1">Selected Only</label>
        <UToggle v-model="filters.selectedOnly" />
      </div>
      <VisualisationPickerFilterRange
        v-model:rangeValue="filters.heightRange"
        :min="70"
        :max="90"
      />
      <VisualisationPickerFilterRange
        v-model:rangeValue="filters.weightRange"
        :min="150"
        :max="350"
      />
      <VisualisationPickerFilterRange
        v-model:rangeValue="filters.yearsRange"
        :min="1960"
        :max="2024"
      />
      <div>
        <label class="block text-sm text-gray-700 mb-1">Positions</label>
        <div class="flex gap-3">
          <label
            v-for="(checked, position) in filters.positions"
            :key="position"
            class="flex items-center"
          >
            <div class="checkbox">
              <UCheckbox
                v-model="filters.positions[position]"
                :ui="{ inner: 'ms-1 flex flex-col' }"
                :label="position"
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  </VisualisationPickerFilter>
</template>
