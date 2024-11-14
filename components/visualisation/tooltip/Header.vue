<script setup lang="ts">
defineProps<{
  categoryName: string;
  categoryColor: `#${string}`;
  subCategoryName: string;
  statName?: string;
  statDescription?: string;
}>();
</script>

<template>
  <div
    class="pb-1 p-2"
    :style="{ background: `${categoryColor}1A` }"
  >
    <div class="flex gap-1 mb-1 text-sm">
      <div
        class="px-1"
        :style="{ background: `${categoryColor}` }"
      >
        {{ categoryName }}
      </div>
      <div
        class="px-1 text-gray-900"
        :style="{ background: `${categoryColor}80` }"
      >
        {{ subCategoryName }}
      </div>
    </div>
    <div
      v-if="statName"
      class="font-semibold text-base"
    >
      {{ statName }}
    </div>
    <div
      v-if="statDescription"
      class="text-sm mb-1"
    >
      {{ statDescription }}
    </div>
  </div>
</template>
