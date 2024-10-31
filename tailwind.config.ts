import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
      },
      colors: {
        primary: colors.green,
      },
    },
  },
};
