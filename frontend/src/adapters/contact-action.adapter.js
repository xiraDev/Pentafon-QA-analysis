import { isEmpty } from 'lodash';

import { fDateTime } from '../utils/format-time';
import { fDate, fFullDateTime } from '../utils/format-time-xira';
// utilities
import { getVoices } from '../api/services/voicebot-voices.service';

// ----------------------------------------------------------------------

export const contactActionsAdapter = (contactActions) => {
  const renderContactActions = [];
  if (isEmpty(contactActions)) return renderContactActions;
  contactActions.forEach((action) => {
    renderContactActions.push(contactActionAdapter(action));
  });

  return renderContactActions;
};


// TODO: refactor this to not use global variables  

let voicesDictionary = null;
let voicesPromise = null;

export async function executeGetVoices() {
  if (voicesDictionary) {
    return voicesDictionary;
  }

  if (!voicesPromise) {
    voicesPromise = getVoices().then((res) => {
      voicesDictionary = res;
      return res;
    }).catch((error) => {
      voicesPromise = null; // Resetear en caso de error
      throw error;
    });
  }

  return voicesPromise;
}

executeGetVoices();

export const contactActionAdapter = (action) => {
  if (action.dispatch_date) {
    return {};
  }
  return {
    id: action.id,
    message: action.message,
    dispatchDate: fFullDateTime(action.dispatchDate),
    status: action.status,
    createdAt: fDateTime(action.createdAt),
    updatedAt: fDateTime(action.updatedAt),
    customersToContact: action.customersToContact || 'N/A',
    contactedCustomers: action.contactedCustomers || 'N/A',
    promptName: action.promptName,
    // TODO: refactor in order to get voices from the component when this function is called
    voice: voicesDictionary?.find((v) => v.id === action.voiceId).slug || "-",
    successfulContacts: action.matching_typifications || 'N/A',
    channel: action.channel,
    strategyId: action.strategyId,
  };
};

export const contactActionDetailsAdapter = (action) => ({
  id: action.id,
  message: action.message,
  dispatchDate: fFullDateTime(action.dispatchDate),
  status: action.status,
  createdAt: fDateTime(action.createdAt),
  updatedAt: fDateTime(action.updatedAt),
  channel: action.channel,
  whatsappTemplate: action.whatsappTemplate,
  emailTemplate: action.emailTemplate,
  voice: action.voice,
  promptName: action.promptName,
  contactField: action.contactField,
  strategyId: action.strategyId,
});

export const caAttemptsAdapter = (attempts) => {
  const renderAttempts = {
    count: attempts.count || 0,
    rows: [],
  };

  attempts.rows.forEach((attempt) => {
    renderAttempts.rows.push(attemptAdapter(attempt));
  });

  return renderAttempts;
};

const attemptAdapter = (attempt) => ({
  id: attempt.id,
  try: attempt.try,
  actionChannel: attempt.actionChannel,
  message: attempt.message,
  actionStatus: attempt.actionStatus,
  twilioCallSid: attempt.twilioCallSid,
  sgMessageId: attempt.sgMessageId,
  wMessageId: attempt.wMessageId,
  createdAt: fDate(attempt.createdAt),
  customer: attempt.customer.name,
});

export const cAFiltersAdapter = (filters) => {
  const renderFilters = {
    count: filters.count || 0,
    rows: [],
  };

  filters.rows.forEach((filter) => {
    renderFilters.rows.push(filterAdapter(filter));
  });

  return renderFilters;
};

const filterAdapter = (filter) => ({
  id: filter.id,
  filter: filter.filter,
  condition: filter.condition,
  rule: renderRule(filter.rule),
  createdAt: fDate(filter.createdAt),
});

const renderRule = (rule) => {
  try {
    return JSON.parse(rule);
  } catch (error) {
    // console.error('Error parsing JSON:', error);
  }
  return rule;
};
