import type { Player } from '~/types';

export const useInteractionStore = defineStore(
  'interaction',
  () => {
    const isPlayerHovered = ref(false);
    const hoveredPlayer = ref<Player | null>(null);

    const setHoveredPlayer = (player: Player | null) => {
      if (!player) {
        isPlayerHovered.value = false;
        hoveredPlayer.value = null;
        return;
      }

      isPlayerHovered.value = true;
      hoveredPlayer.value = player;
    };

    return {
      isPlayerHovered,
      hoveredPlayer,
      setHoveredPlayer,
    };
  }
  // { persist: true }
);
