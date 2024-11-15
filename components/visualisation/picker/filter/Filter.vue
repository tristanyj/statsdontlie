<script setup lang="ts">
import { useVModel } from '@vueuse/core';

interface Props {
  isSortOpen: boolean;
  isSortAscending: boolean;
  isFiltersOpen: boolean;
  isFiltered: boolean;
  selectableLength: number;
  selectedLength: number;
  filteredLength: number;
  totalLength: number;
  sortOptions: { key: string; label: string }[];
  currentSort: { key: string; label: string };
}

const props = withDefaults(defineProps<Props>(), {
  isSortOpen: false,
  isSortAscending: false,
  isFiltersOpen: false,
  isFiltered: false,
  selectableLength: 0,
  selectedLength: 0,
  filteredLength: 0,
  totalLength: 0,
  sortOptions: () => [],
  currentSort: () => ({ key: '', label: '' }),
});

const emit = defineEmits<{
  clearSelection: [];
  restoreDefaultSelection: [];
  selectAllFiltered: [];
  clearFilters: [];
  selectOption: [option: { key: string; label: string }];
  'update:isSortOpen': [value: boolean];
  'update:isFiltersOpen': [value: boolean];
}>();

const isSortOpen = useVModel(props, 'isSortOpen', emit);
const isFiltersOpen = useVModel(props, 'isFiltersOpen', emit);
</script>

<template>
  <div class="grid lg:grid-flow-col justify-between py-3 mt-2 px-4">
    <div class="grid sm:grid-flow-col items-center gap-2 text-sm sm:mb-2 lg:mb-0 text-gray-500">
      <div class="grid grid-flow-col justify-start gap-1 items-center">
        <div>{{ selectedLength }} selected,</div>
        <div>{{ filteredLength }} filtered,</div>
        <div>{{ totalLength }} total</div>
      </div>
      <div class="grid grid-flow-col justify-start gap-2 mb-2 sm:mb-0 items-center">
        <div class="hidden sm:inline">&#8226;</div>
        <VisualisationPickerFilterControl @click="emit('clearSelection')">
          Clear selection
        </VisualisationPickerFilterControl>
        <div class="">&#8226;</div>
        <VisualisationPickerFilterControl @click="emit('restoreDefaultSelection')">
          Default selection
        </VisualisationPickerFilterControl>
        <template v-if="filteredLength < selectableLength">
          <div class="hidden sm:inline">&#8226;</div>
          <VisualisationPickerFilterControl
            class="hidden sm:inline"
            @click="emit('selectAllFiltered')"
          >
            Select all filtered
          </VisualisationPickerFilterControl>
        </template>
      </div>
    </div>
    <div class="flex space-x-2 text-sm text-gray-500">
      <template v-if="isFiltered">
        <VisualisationPickerFilterControl @click="emit('clearFilters')">
          Clear filters
        </VisualisationPickerFilterControl>
        <div class="">&#8226;</div>
      </template>
      <UPopover
        v-model:open="isFiltersOpen"
        :popper="{ arrow: true }"
      >
        <VisualisationPickerFilterControl>Filters</VisualisationPickerFilterControl>
        <template #panel>
          <div class="p-4">
            <slot />
          </div>
        </template>
      </UPopover>
      <div class="">&#8226;</div>
      <UPopover
        v-model:open="isSortOpen"
        :popper="{ arrow: true }"
      >
        <VisualisationPickerFilterControl>
          Sort by : {{ currentSort.label }}
        </VisualisationPickerFilterControl>
        <template #panel>
          <div class="p-2 w-36">
            <div
              v-for="option in sortOptions"
              :key="option.key"
              role="menuitem"
              class="px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-start items-center"
              @click="emit('selectOption', option)"
            >
              <UIcon
                v-if="currentSort.key === option.key"
                :name="isSortAscending ? 'i-radix-icons:arrow-up' : 'i-radix-icons:arrow-down'"
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
