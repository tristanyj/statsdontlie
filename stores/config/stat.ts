import type { Stat, EnrichedStat, EnrichedCategory, Category, StatKey } from '~/types';

import { DEFAULT_STAT_IDS } from '~/assets/scripts/constants';

export const useStatConfigStore = defineStore('config/stat', () => {
  const cacheStore = useCacheStore();
  const { getScale, getFormat } = cacheStore;

  // --------------------------------
  // State
  // --------------------------------

  const categories = ref<Category[]>([]);

  const selectedStatIds = ref<StatKey[]>([...DEFAULT_STAT_IDS]);

  // --------------------------------
  // Computed
  // --------------------------------

  const isLoaded = computed(() => categories.value.length > 0);

  const selectedCategories = computed(() => {
    return enrichedCategories?.value
      ? enrichedCategories.value
          .map((group) => ({
            ...group,
            subCategories: group.subCategories
              .map((subCategory) => ({
                ...subCategory,
                stats: subCategory.stats.filter((column) =>
                  selectedStatIds.value.includes(column.id)
                ),
              }))
              .filter((subCategory) => subCategory.stats.length > 0),
          }))
          .filter((group) => group.subCategories.length > 0)
      : [];
  });

  const selectedSubCategories = computed(() => {
    return selectedCategories.value.flatMap((group) => group.subCategories);
  });

  const selectedStats = computed(() => {
    return selectedCategories.value
      .flatMap((group) => group.subCategories)
      .flatMap((subCategory) => subCategory.stats);
  });

  const selectedStatIdsCount = computed(() => selectedStatIds.value.length);

  const selectableCategories = computed(() => {
    return categories.value.map(({ id, name, color, subCategories }) => ({
      id,
      name,
      color,
      subCategories: subCategories.map(({ id, name, stats }) => ({
        id,
        name,
        color,
        stats: stats.map(({ id, name }) => ({ id, name })),
      })),
    }));
  });

  const selectableStats = computed(() => {
    return categories.value.flatMap((category) =>
      category.subCategories.flatMap((subCategory) => subCategory.stats)
    );
  });

  const enrichedCategories = computed(
    () =>
      categories.value.map((category) => ({
        ...category,
        subCategories: category.subCategories.map((subCategory) => ({
          ...subCategory,
          stats: subCategory.stats.map((stat) => getEnrichedStat(stat, subCategory.color)),
        })),
      })) as EnrichedCategory[]
  );

  // --------------------------------
  // Methods
  // --------------------------------

  const getEnrichedStat = (stat: Stat, color: `#${string}`): EnrichedStat => ({
    ...stat,
    color,
    meta: {
      ...stat.meta,
      scale: getScale(stat),
      format: getFormat(stat),
    },
  });

  const getCategoryById = (id: string) => categories.value.find((category) => category.id === id);
  const getSubCategoryById = (category: Category, subCategoryId: string) => {
    return category?.subCategories.find(
      (subCategory) => subCategory.id === `${category.id}.${subCategoryId}`
    );
  };

  const setCategories = (d: Category[]) =>
    (categories.value = d.map((category) => {
      const subCategories = category.subCategories.map((subCategory) => {
        const stats = subCategory.stats.map((stat) => ({
          ...stat,
          description: stat.description ? stat.description : null,
        }));
        return { ...subCategory, stats };
      });
      return { ...category, subCategories };
    }));

  const setSelectedStatIds = (newselectedStatIds: StatKey[]) =>
    (selectedStatIds.value = newselectedStatIds);

  const restoreDefaultStatSelection = () => {
    selectedStatIds.value = [...DEFAULT_STAT_IDS];
  };

  return {
    isLoaded,
    selectedStatIds,
    selectedStatIdsCount,
    selectableCategories,
    selectableStats,
    selectedCategories,
    selectedSubCategories,
    selectedStats,
    setCategories,
    setSelectedStatIds,
    getCategoryById,
    getSubCategoryById,
    restoreDefaultStatSelection,
  };
});
