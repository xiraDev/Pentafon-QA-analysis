import { isEmpty } from 'src/helpers';

// utilities
import { fDate } from '../utils/format-time';

// ----------------------------------------------------------------------

export const strategiesAdapter = (strategies) => {
  const renderStrategies = [];
  if (isEmpty(strategies)) return renderStrategies;
  strategies.forEach((strategy) => {
    renderStrategies.push(strategyAdapter(strategy));
  });

  return renderStrategies;
};

export const strategyAdapter = (strategy) => ({
  id: strategy.id,
  name: strategy.name,
  controlGroup: strategy.controlGroup,
  isEnable: strategy.isEnable,
  createdAt: fDate(strategy.createdAt),
});
