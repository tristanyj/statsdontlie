<script setup lang="ts">
const preferencesStore = usePreferencesStore();
const { selectedQBs } = storeToRefs(preferencesStore);
const { updateSelectedQBs } = preferencesStore;

defineProps<{
  players: { id: string; name: string }[];
}>();

const selection = computed({
  get: () => selectedQBs.value,
  set: (newValue) => {
    updateSelectedQBs(newValue);
  },
});
</script>

<template>
  <div>
    <div class="flex justify-center p-5">
      <div class="grid grid-flow-col gap-5 text-center">
        <div
          v-for="(player, i) in players"
          :key="`player-${i}`"
          class=""
        >
          <div class="">
            <UCheckbox
              v-model="selection"
              :value="player.id"
              :label="player.name"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
