export const strategyRuleCreateAdapter = (strategyRule, contactField, number, strategyId) => ({
  name: strategyRule.name,
  number,
  dispatchDate: strategyRule.dispatchDate,
  waitingRecontact: strategyRule.waitingRecontact,
  contactField,
  strategyId,
});

export const strategyRule2TaskAdapter = (strategyRule) => ({
  id: strategyRule.id,
  name: strategyRule.name,
  number: strategyRule.number,
  strategyId: strategyRule.strategyId,
  dispatchDate: strategyRule.dispatchDate,
  waitingRecontact: strategyRule.waitingRecontact,
  filters: [],
});
