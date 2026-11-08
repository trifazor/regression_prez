// Class predictions from the opening slide, revealed again in Part 4.
export const options = [
  { id: 'rise', label: 'Keeps rising', icon: '↗' },
  { id: 'flat', label: 'Flat, age doesn’t matter', icon: '→' },
  { id: 'hump', label: 'Rises, then falls', icon: '∩' },
  { id: 'fall', label: 'Falls', icon: '↘' },
];
export const votes = $state({ rise: 0, flat: 0, hump: 0, fall: 0 });
