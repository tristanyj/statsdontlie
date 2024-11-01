<script setup lang="ts">
const configStore = useConfigStore();
const { selectableColumnsGroupedByGroupKey } = storeToRefs(configStore);

const preferencesStore = usePreferencesStore();
const { selectedColumnIds } = storeToRefs(preferencesStore);
const { updateSelectedColumnIds } = preferencesStore;

const selection = computed({
  get: () => selectedColumnIds.value,
  set: (newValue) => {
    updateSelectedColumnIds(newValue);
  },
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-center">Select Columns</h2>
    <div class="flex justify-center p-5">
      <div class="grid grid-cols-3 gap-5 text-center">
        <div
          v-for="(group, i) in selectableColumnsGroupedByGroupKey"
          :key="`group-${i}`"
        >
          <h3 class="text-lg font-bold">{{ group.name }}</h3>
          <div
            v-for="(column, j) in group.columns"
            :key="`column-${j}`"
            class=""
          >
            <div class="">
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
</template>
