<script setup lang="ts">
const configStore = useConfigStore();
const { selectedPlayerIds, selectablePlayers } = storeToRefs(configStore);
const { setSelectedPlayerIds } = configStore;

const selection = computed({
  get: () => selectedPlayerIds.value,
  set: (newValue) => {
    setSelectedPlayerIds(newValue);
  },
});
</script>

<template>
  <div>
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
              v-model="selection"
              :value="player.id"
              :label="player.info.name"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
