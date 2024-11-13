import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        host: ['Host Grotesk', 'sans-serif'],
      },
      colors: {
        primary: colors.amber,
      },
    },
  },
};
