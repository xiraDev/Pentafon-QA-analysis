import { isEmpty } from 'lodash';

import { fCurrency } from 'src/utils/format-number';
// utilities
import { fDate, fTime24, fDateSql } from 'src/utils/format-time-xira';

// ----------------------------------------------------------------------

export const attempts2ReportsAdapter = (attempts) => {
  const renderAttempts = [];
  if (isEmpty(attempts)) return renderAttempts;
  attempts.forEach((_attempt) => {
    renderAttempts.push(attempt2ReportAdapter(_attempt));
  });

  return renderAttempts;
};

export const attempt2ReportAdapter = (attempt) => ({
  id: attempt.id,
  typification: attempt.typification,
  lastContactDate: fDate(attempt.lastContactDate),
  actionChannel: attempt.actionChannel,
  testId: attempt.testId || '',
  contactDate: fDate(attempt.createdAt),
  contactTime: fTime24(attempt.createdAt),
  callDuration: attempt.callDuration ? `${attempt.callDuration} s` : null,
  actionStatus: attempt.actionStatus,
  contactActionId: attempt.contactActionId,
  customer: {
    customerId: attempt.customer.customerId,
    accountNumber: attempt.customer.accountNumber,
    name: attempt.customer.name,
    fatherLastName: attempt.customer.fatherLastName,
    motherLastName: attempt.customer.motherLastName,
    phone: attempt.customer.phone,
    phone2: attempt.customer.phone2,
    whatsapp: attempt.customer.whatsapp,
    email: attempt.customer.email,
    balanceDue: fCurrency(attempt.customer.balanceDue),
    promotion: attempt.customer.promotion,
    daysPastDue: attempt.customer.daysPastDue,
    paymentDueDate: attempt.customer.paymentDueDate ? fDateSql(attempt.customer.paymentDueDate) : '',
    field1: attempt.customer.field1,
    field2: attempt.customer.field2,
    field3: attempt.customer.field3,
    field4: attempt.customer.field4,
    field5: attempt.customer.field5,
    field6: attempt.customer.field6,
    field7: attempt.customer.field7,
    field8: attempt.customer.field8,
    field9: attempt.customer.field9,
    field10: attempt.customer.field10,
    field11: attempt.customer.field11,
    field12: attempt.customer.field12,
    field13: attempt.customer.field13,
    field14: attempt.customer.field14,
    field15: attempt.customer.field15,
    field16: attempt.customer.field16,
    field17: attempt.customer.field17,
    field18: attempt.customer.field18,
    field19: attempt.customer.field19,
    field20: attempt.customer.field20,
    controlGroup: attempt.customer.controlGroup,
    paymentCommitmentDate: attempt.customer.paymentCommitmentDate ? fDate(attempt.customer.paymentCommitmentDate) : '',
  },
});
