export default defineAppConfig({
  ui: {
    primary: 'teal',
    gray: 'cool',
    container: {
      constrained: 'max-w-2xl',
    },
    tabs: {
      wrapper: 'relative space-y-0',
    },
    slideover: {
      width: 'w-screen',
      height: 'h-screen max-h-[90%]',
      overlay: {
        base: 'fixed inset-0 transition-opacity',
        background: 'bg-gray-400/75 dark:bg-gray-800/75',
        transition: {
          enter: 'ease-in-out duration-500',
          enterFrom: 'opacity-0',
          enterTo: 'opacity-100',
          leave: 'ease-in-out duration-500',
          leaveFrom: 'opacity-100',
          leaveTo: 'opacity-0',
        },
      },
      base: 'relative flex-1 flex flex-col w-full bg-white/90 focus:outline-none',
      background: 'bg-[white]/95 dark:bg-gray-900',
    },
  },
});
