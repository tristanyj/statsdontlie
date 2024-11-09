<script setup lang="ts">
const configStore = useConfigStore();
const { selectableCategories, selectedStatIds } = storeToRefs(configStore);
const { setSelectedStatIds } = configStore;

const selection = computed({
  get: () => selectedStatIds.value,
  set: (newValue) => {
    setSelectedStatIds(newValue);
  },
});
</script>

<template>
  <div>
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
                    v-model="selection"
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
</template>
