import { isEmpty } from '../helpers';

// ----------------------------------------------------------------------

export const shortingAdapter = (shorting = []) => {
  if (isEmpty(shorting)) return [];

  const order = shorting[0].desc ? 'DESC' : 'ASC';
  return [[shorting[0].id, order]];
};
