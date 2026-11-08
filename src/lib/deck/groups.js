// Subsamples for the group exercise. Each table gets one and reports its peak age.
export const groups = [
  { id: 'all', name: 'Everyone', rule: 'all 350 respondents', keep: () => true },
  { id: 'men', name: 'Men', rule: 'sex = 1', keep: (r) => r.sex === 1 },
  { id: 'women', name: 'Women', rule: 'sex = 2', keep: (r) => r.sex === 2 },
  { id: 'working', name: 'Working age', rule: 'age 18–64', keep: (r) => r.age <= 64 },
  { id: 'core', name: 'Core career', rule: 'age 25–70', keep: (r) => r.age >= 25 && r.age <= 70 },
  { id: 'capped', name: 'No top earners', rule: 'income ≤ 4,000', keep: (r) => r.income <= 4000 },
];
