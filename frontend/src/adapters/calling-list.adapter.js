// utilities
import { fDate } from '../utils/format-time-xira';

// ----------------------------------------------------------------------

export const caCallingListAdapter = (callingList) => {
  const renderCallingList = {
    count: callingList.count || 0,
    rows: [],
  };

  callingList.rows.forEach((_call) => {
    renderCallingList.rows.push(callAdapter(_call));
  });

  return renderCallingList;
};

const callAdapter = (call) => ({
  id: call.id,
  try: call.try,
  actionChannel: 'Voicebot',
  message: '',
  actionStatus: call.actionStatus,
  createdAt: fDate(call.createdAt),
  customer: call.customer.name,
});
