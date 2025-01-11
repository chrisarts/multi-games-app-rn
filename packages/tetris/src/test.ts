// @ts-nocheck

const people = [
  {
    id: 1,
    name: 'David',
  },
  {
    id: 1,
    name: 'Marcial',
  },
  {
    id: 1,
    name: 'Chris',
  },
];

// Spread
people.reduce((prev, current) => {
  return {
    ...prev,
    [current.id]: current,
  };
});
