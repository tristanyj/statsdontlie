<script setup lang="ts">
// import type { SubCategoryKey } from '~/types';

import { formatString } from '~/assets/scripts/utils';

const statConfigStore = useStatConfigStore();
const { selectableCategories, selectableStats, selectedStatIds } = storeToRefs(statConfigStore);

const { setSelectedStatIds, restoreDefaultStatSelection } = statConfigStore;

interface Props {
  searchValue: string;
}

const props = withDefaults(defineProps<Props>(), {
  searchValue: '',
});

type Option = {
  label: string;
  key: string;
};

const selectedOnly = ref(false);

const sortOptions: Option[] = [
  {
    label: 'Default',
    key: 'default',
  },
  {
    label: 'Name',
    key: 'name',
  },
];

const categories = ref({
  'Regular Season': true,
  'Post Season': true,
  Awards: true,
});

const subCategories = ref({
  Total: true,
  'Per Game': true,
  Advanced: true,
  'Game High': true,
  Individual: true,
  Team: true,
});

const currentSort = ref(sortOptions[0]);

const filteredCategories = computed(() => {
  const searchTerm = props.searchValue.toLowerCase();

  return selectableCategories.value
    .map((category) => ({
      ...category,
      subCategories: category.subCategories
        .map((subCategory) => ({
          ...subCategory,
          stats: subCategory.stats
            .filter((stat) => (searchTerm ? stat.name.toLowerCase().includes(searchTerm) : true))
            .filter((stat) => (selectedOnly.value ? selectedStatIds.value.includes(stat.id) : true))
            .filter((stat) => {
              const [categoryId, subCategoryId] = stat.id.split('.');
              const parsedCategoryId = formatString(categoryId);
              const parsedSubCategoryId = formatString(subCategoryId);

              return (
                categories.value[parsedCategoryId as keyof typeof categories.value] &&
                subCategories.value[parsedSubCategoryId as keyof typeof subCategories.value]
              );
            }),
        }))
        .filter((subCategory) => subCategory.stats.length > 0), // Remove empty subCategories
    }))
    .filter((category) => category.subCategories.length > 0); // Remove empty categories
});

const filteredStats = computed(() => {
  return filteredCategories.value.flatMap((category) =>
    category.subCategories.flatMap((subCategory) => subCategory.stats)
  );
});

const isFiltersOpenStats = ref(false);
const isSortOpen = ref(false);
const isSortAscending = ref(true);

const selectOption = (option: Option) => {
  if (currentSort.value.key === option.key) {
    isSortAscending.value = !isSortAscending.value;
  }
  currentSort.value = option;
  isSortOpen.value = false;
};

// const toggleSubCategorySelection = (subCategoryId: SubCategoryKey) => {
//   const stats = filteredCategories.value
//     .flatMap((category) => category.subCategories)
//     .find((subCategory) => subCategory.id === subCategoryId)?.stats;

//   if (!stats) return;

//   const allSelected = stats.every((stat) => selectedStatIds.value.includes(stat.id));

//   if (allSelected) {
//     setSelectedStatIds(selectedStatIds.value.filter((id) => !id.includes(subCategoryId)));
//   } else {
//     setSelectedStatIds(
//       [
//         ...selectedStatIds.value,
//         ...stats.map((stat) => stat.id).filter((id, index, self) => self.indexOf(id) === index),
//       ].filter((id, index, self) => self.indexOf(id) === index)
//     );
//   }
// };

const clearFiltersStats = () => {
  selectedOnly.value = false;
  Object.keys(categories.value).forEach(
    (category) => (categories.value[category as keyof typeof categories.value] = true)
  );
  Object.keys(subCategories.value).forEach(
    (subCategory) => (subCategories.value[subCategory as keyof typeof subCategories.value] = true)
  );
  isFiltersOpenStats.value = false;
};

const selectAllFilteredStats = () => {
  setSelectedStatIds(
    filteredCategories.value
      .flatMap((category) => category.subCategories)
      .flatMap((subCategory) => subCategory.stats)
      .map((stat) => stat.id)
  );
};
const clearSelection = () => {
  setSelectedStatIds([]);
};

// const sortedCategories = computed(() => {
//   const copy = [...filteredCategories.value];

//   switch (currentSort.value.key) {
//     case 'name':
//       // sort stats by name
//       return copy
//         .map((category) => ({
//           ...category,
//           subCategories: category.subCategories
//             .map((subCategory) => ({
//               ...subCategory,
//               stats: subCategory.stats.sort((a, b) =>
//                 isSortAscending.value
//                   ? a.name.localeCompare(b.name)
//                   : b.name.localeCompare(a.name)
//               ),
//             }))
//             .sort((a, b) =>
//               isSortAscending.value
//                 ? a.name.localeCompare(b.name)
//                 : b.name.localeCompare(a.name)
//             ),
//         }))
//         .sort((a, b) =>
//           isSortAscending.value ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
//         );
//     default:
//       return copy;
//   }
// });

const isFiltered = computed(() => {
  return (
    selectedOnly.value ||
    Object.values(categories.value).some((category) => !category) ||
    Object.values(subCategories.value).some((subCategory) => !subCategory)
  );
});
</script>

<template>
  <VisualisationPickerFilter
    v-model:isFiltersOpen="isFiltersOpenStats"
    v-model:isSortOpen="isSortOpen"
    :is-sort-ascending="isSortAscending"
    :is-filtered="isFiltered"
    :selectable-length="selectableStats.length"
    :selected-length="selectedStatIds.length"
    :filtered-length="filteredStats.length"
    :total-length="selectableStats.length"
    :sort-options="sortOptions"
    :current-sort="currentSort"
    @clear-selection="clearSelection"
    @restore-default-selection="restoreDefaultStatSelection"
    @select-all-filtered="selectAllFilteredStats"
    @clear-filters="clearFiltersStats"
    @select-option="selectOption"
  >
    <div class="filters-container rounded-lg w-60">
      <div class="mb-3">
        <label class="block text-sm text-gray-700">Selected Only</label>
        <UToggle v-model="selectedOnly" />
      </div>
      <div class="mb-3">
        <label class="block text-sm text-gray-700 mb-1">Categories</label>
        <div class="flex flex-wrap gap-x-3 gap-y-2">
          <label
            v-for="(checked, category) in categories"
            :key="category"
            class="flex items-center"
          >
            <div class="checkbox">
              <UCheckbox
                v-model="categories[category]"
                :ui="{ inner: 'ms-1 flex flex-col' }"
                :label="category"
              />
            </div>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm text-gray-700 mb-1">Sub Categories</label>
        <div class="flex flex-wrap gap-x-3 gap-y-2">
          <label
            v-for="(checked, category) in subCategories"
            :key="category"
            class="flex items-center"
          >
            <div class="checkbox">
              <UCheckbox
                v-model="subCategories[category]"
                :ui="{ inner: 'ms-1 flex flex-col' }"
                :label="category"
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  </VisualisationPickerFilter>
</template>
