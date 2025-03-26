// utilities
// utilities
import { fDate } from '../utils/format-time-xira';
import { isEmpty, ladaTimeZone } from '../helpers';

// ----------------------------------------------------------------------

export const clientsAdapter = (clients) => {
  const renderClients = {
    count: clients.count || 0,
    rows: [],
  };

  clients.rows.forEach((client) => {
    renderClients.rows.push(clientAdapter(client));
  });

  return renderClients;
};

export const clientAdapter = (client) => {
  const lastAttempt = client?.attempts?.[0];
  const formattedAttempt = lastAttempt
    ? {
        ...lastAttempt,
        createdAt: lastAttempt.createdAt ? fDate(lastAttempt.createdAt) : null,
        actionChannel: lastAttempt.actionChannel?.toUpperCase() ?? null,
      }
    : // This is to avoid warning messages in the console
      {
        createdAt: null,
        typification: null,
        actionChannel: null,
      };

  return {
    id: client.id,
    customerId: client.customerId,
    accountNumber: client.accountNumber,
    name: client.name,
    fatherLastName: client.fatherLastName,
    motherLastName: client.motherLastName,
    phone: client.phone,
    phone2: client.phone2,
    whatsapp: client.whatsapp,
    email: client.email,
    balanceDue: client.balanceDue,
    promotion: client.promotion,
    daysPastDue: client.daysPastDue,
    paymentDueDate: client.paymentDueDate,
    field1: client.field1,
    field2: client.field2,
    field3: client.field3,
    field4: client.field4,
    field5: client.field5,
    field6: client.field6,
    field7: client.field7,
    field8: client.field8,
    field9: client.field9,
    field10: client.field10,
    field11: client.field11,
    field12: client.field12,
    field13: client.field13,
    field14: client.field14,
    field15: client.field15,
    field16: client.field16,
    field17: client.field17,
    field18: client.field18,
    field19: client.field19,
    field20: client.field20,
    controlGroup: client.controlGroup,
    ladaTimeZone: ladaTimeZone(client.ladaTimeZone),
    paymentCommitmentDate: client.paymentCommitmentDate,
    paymentPromiseDate: client.paymentPromiseDate,
    createdAt: fDate(client.createdAt),
    lastAttempt: formattedAttempt,
  };
};

export const clientDetailsAdapter = (client) => ({
  id: client.id,
  name: client.name,
  fatherLastName: client.fatherLastName,
  motherLastName: client.motherLastName,
  phone: client.phone,
  phone2: client.phone2,
  whatsapp: client.whatsapp,
  email: client.email,
  balanceDue: client.balanceDue,
  promotion: client.promotion,
  daysPastDue: client.daysPastDue,
  paymentDueDate: client.paymentDueDate,
  field1: client.field1,
  field2: client.field2,
  field3: client.field3,
  field4: client.field4,
  field5: client.field5,
  field6: client.field6,
  isInDebt: client.isInDebt,
  paymentCommitmentDate: client.paymentCommitmentDate,
  createdAt: fDate(client.createdAt),
  updatedAt: fDate(client.updatedAt),
});

export const paymentHistoryAdapter = (historicalPayments) => {
  const renderPaymentHistory = {
    count: historicalPayments.count || 0,
    rows: [],
  };

  historicalPayments.rows.forEach((historicalPayment) => {
    renderPaymentHistory.rows.push(historicalPaymentAdapter(historicalPayment));
  });

  return renderPaymentHistory;
};

export const historicalPaymentAdapter = (historicalPayment) => ({
  id: historicalPayment.id,
  paymentDate: historicalPayment.paymentDate,
  credit: historicalPayment.credit,
  pay: historicalPayment.pay,
  currentBalance: historicalPayment.currentBalance,
  customerId: historicalPayment.customerId,
  paymentFileId: historicalPayment.paymentFileId,
  createdAt: fDate(historicalPayment.createdAt),
  updatedAt: fDate(historicalPayment.updatedAt),
  paymentFile: historicalPayment.paymentFile,
});

export const customerAttemptsAdapter = (attempts) => {
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
});

export const shortingAdapter = (shorting = []) => {
  if (isEmpty(shorting)) return [];

  const order = shorting[0].desc ? 'DESC' : 'ASC';
  return [[shorting[0].id, order]];
};
