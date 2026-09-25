export type IconName = 'plus' | 'minus' | 'close' | 'spinner'

interface IconPath {
  d: string
  opacity?: number
}

/** Paths on a 24×24 grid, stroked in currentColor by BaseIcon. */
export const icons: Record<IconName, IconPath[]> = {
  plus: [{ d: 'M12 5v14' }, { d: 'M5 12h14' }],
  minus: [{ d: 'M5 12h14' }],
  close: [{ d: 'M6 6l12 12' }, { d: 'M18 6 6 18' }],
  spinner: [
    { d: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18', opacity: 0.25 },
    { d: 'M21 12a9 9 0 0 0-9-9' },
  ],
}
