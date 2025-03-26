import { isEmpty } from 'src/helpers';

// ----------------------------------------------------------------------

export const ruleFilterCreateAdapter = (ruleId, filter) => ({
  filter: filter.filter,
  condition: filter.condition,
  rule: filter.rule,
  strategyRuleId: ruleId,
});

export const filters2TaskAdapter = (filters) => {
  const renderFilters = [];
  if (isEmpty(filters)) return renderFilters;

  filters.forEach((filter) => {
    renderFilters.push(filterTaskAdapter(filter));
  });

  return renderFilters;
};

const filterTaskAdapter = (filter) => ({
  id: filter.id,
  filter: filter.filter,
  condition: filter.condition,
  rule: filter.rule,
  strategyRuleId: filter.strategyRuleId,
});
