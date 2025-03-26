export const FILTER_BY_OPTIONS = [
  { value: 'customerId', label: 'customer_list_column_client_id', type: 'string' },
  { value: 'accountNumber', label: 'customer_list_column_account_number', type: 'string' },
  { value: 'name', label: 'column_name', type: 'string' },
  { value: 'fatherLastName', label: 'column_last_father_name', type: 'string' },
  { value: 'motherLastName', label: 'column_last_mother_name', type: 'string' },
  { value: 'phone', label: 'column_phone', type: 'string' },
  { value: 'phone2', label: 'column_phone_2', type: 'string' },
  { value: 'whatsapp', label: 'WhatsApp', type: 'string' },
  { value: 'email', label: 'email', type: 'string' },
  { value: 'balanceDue', label: 'column_balance_due', type: 'number' },
  { value: 'promotion', label: 'column_promotion', type: 'string' },
  { value: 'daysPastDue', label: 'column_days_past_due', type: 'number' },
  { value: 'paymentDueDate', label: 'column_payment_due_date', type: 'date' },
  { value: 'field1', label: 'column_field_1', type: 'string' },
  { value: 'field2', label: 'column_field_2', type: 'string' },
  { value: 'field3', label: 'column_field_3', type: 'string' },
  { value: 'field4', label: 'column_field_4', type: 'string' },
  { value: 'field5', label: 'column_field_5', type: 'string' },
  { value: 'field6', label: 'column_field_6', type: 'string' },
  { value: 'field7', label: 'column_field_7', type: 'string' },
  { value: 'field8', label: 'column_field_8', type: 'string' },
  { value: 'field9', label: 'column_field_9', type: 'string' },
  { value: 'field10', label: 'column_field_10', type: 'string' },
  { value: 'field11', label: 'column_field_11', type: 'string' },
  { value: 'field12', label: 'column_field_12', type: 'string' },
  { value: 'field13', label: 'column_field_13', type: 'string' },
  { value: 'field14', label: 'column_field_14', type: 'string' },
  { value: 'field15', label: 'column_field_15', type: 'string' },
  { value: 'field16', label: 'column_field_16', type: 'string' },
  { value: 'field17', label: 'column_field_17', type: 'string' },
  { value: 'field18', label: 'column_field_18', type: 'string' },
  { value: 'field19', label: 'column_field_19', type: 'string' },
  { value: 'field20', label: 'column_field_20', type: 'string' },
  { value: 'controlGroup', label: 'column_control_group', type: 'string' },
  { value: 'paymentPromiseDate', label: 'customer_list_column_time_zone', type: 'date' },
  { value: 'paymentCommitmentDate', label: 'customer_list_column_payment_promise_date', type: 'date' },
  { value: 'createdAt', label: 'column_payment_commitment_date', type: 'date' },
  { value: 'lastAttempt.typification', label: 'customer_list_column_typification', type: 'string' },
  { value: 'lastAttempt.createdAt', label: 'column_last_attempt_created_at', type: 'date' },
  { value: 'lastAttempt.actionChannel', label: 'customer_list_column_last_attempt_channel', type: 'string' },
];

export const DATE_FILTERS = [
  'paymentDueDate',
  'paymentPromiseDate',
  'paymentCommitmentDate',
  'createdAt',
  'lastAttempt.createdAt',
];

export const CONDITION_OPTIONS = [
  { value: '>=', label: 'greater_than_equal_to', toFilterType: ['number'], toRuleType: 'number' },
  { value: '===', label: 'equal_to', toFilterType: ['number', 'string'], toRuleType: 'text' },
  { value: '<=', label: 'less_than_equal_to', toFilterType: ['number'], toRuleType: 'number' },
  { value: '>', label: 'greater_than', toFilterType: ['number'], toRuleType: 'number' },
  { value: '<', label: 'less_than', toFilterType: ['number'], toRuleType: 'number' },
  { value: '!=', label: 'different_from', toFilterType: ['number', 'string'], toRuleType: 'text' },
  { value: 'in', label: 'in', toFilterType: ['number', 'string'], toRuleType: 'array' },
  { value: 'notIn', label: 'not_in', toFilterType: ['number', 'string'], toRuleType: 'array' },
  { value: 'like', label: 'must_contain', toFilterType: ['string'], toRuleType: 'text' },
  { value: 'notLike', label: 'must_not_contain', toFilterType: ['string'], toRuleType: 'text' },
  { value: 'regexp', label: 'must_contain_regex', toFilterType: ['string'], toRuleType: 'text' },
  { value: 'notRegexp', label: 'must_not_contain_regex', toFilterType: ['string'], toRuleType: 'text' },
  { value: 'between', label: 'between', toFilterType: ['number'], toRuleType: 'array' },
  { value: 'notBetween', label: 'not_between', toFilterType: ['number'], toRuleType: 'array' },
  { value: 'in-custom', label: 'in', toFilterType: ['custom'], toRuleType: 'custom' },
  { value: 'notIn-custom', label: 'not_in', toFilterType: ['custom'], toRuleType: 'custom' },
  { value: 'between-date', label: 'between', toFilterType: ['date'], toRuleType: 'date' },
  { value: 'notBetween-date', label: 'not_between', toFilterType: ['date'], toRuleType: 'date' },
];

export const STRATEGY_RULE_FILTER_CONDITION_OPTIONS = [
  { value: '>=', label: 'greater_than_equal_to', toFilterType: ['number'], toRuleType: 'number' },
  { value: '===', label: 'equal_to', toFilterType: ['number', 'string'], toRuleType: 'text' },
  { value: '<=', label: 'less_than_equal_to', toFilterType: ['number'], toRuleType: 'number' },
  { value: '>', label: 'greater_than', toFilterType: ['number'], toRuleType: 'number' },
  { value: '<', label: 'less_than', toFilterType: ['number'], toRuleType: 'number' },
  { value: '!=', label: 'different_from', toFilterType: ['number', 'string'], toRuleType: 'text' },
  { value: 'in', label: 'in', toFilterType: ['number', 'string'], toRuleType: 'array' },
  { value: 'notIn', label: 'not_in', toFilterType: ['number', 'string'], toRuleType: 'array' },
  { value: 'like', label: 'must_contain', toFilterType: ['string'], toRuleType: 'text' },
  { value: 'notLike', label: 'must_not_contain', toFilterType: ['string'], toRuleType: 'text' },
  { value: 'regexp', label: 'must_contain_regex', toFilterType: ['string'], toRuleType: 'text' },
  { value: 'notRegexp', label: 'must_not_contain_regex', toFilterType: ['string'], toRuleType: 'text' },
  { value: 'between', label: 'between', toFilterType: ['number'], toRuleType: 'array' },
  { value: 'notBetween', label: 'not_between', toFilterType: ['number'], toRuleType: 'array' },
  { value: 'in-custom', label: 'in', toFilterType: ['custom'], toRuleType: 'custom' },
  { value: 'notIn-custom', label: 'not_in', toFilterType: ['custom'], toRuleType: 'custom' },
  { value: '===-date', label: 'equal_to', toFilterType: ['date'], toRuleType: 'date' },
];

export const ZONE_OPTIONS = [
  { value: 'central-standard', label: 'Central Time Zone, Central Standard Time (Mexico)' },
  { value: 'pacific-standard', label: 'Pacific Time Zone, Pacific Standard Time (Mexico)' },
  { value: 'mountain-standard', label: 'Mountain Time Zone, Mountain Standard Time (Mexico)' },
  { value: 'central', label: 'Central Time Zone' },
  { value: 'eastern-standard', label: 'Eastern Time Zone, Eastern Standard Time (Mexico), Central Time Zone' },
  { value: 'mountain', label: 'Mountain Time Zone' },
];

export const RELATIVE_DATE_OPTIONS = [
  { value: 'today', label: 'Hoy' },
  { value: 'yesterday', label: 'Ayer' },
  { value: 'tomorrow', label: 'Mañana' },
  { value: '1-day-ago', label: 'Hace 1 día' },
  { value: '2-days-ago', label: 'Hace 2 días' },
  { value: '3-days-ago', label: 'Hace 3 días' },
  { value: '1-day-after', label: 'Dentro de 1 día' },
  { value: '2-days-after', label: 'Dentro de 2 días' },
  { value: '3-days-after', label: 'Dentro de 3 días' },
  // { value: 'this-week', label: 'Esta semana' },
  // { value: 'last-week', label: 'Semana pasada' },
  // { value: 'this-month', label: 'Este mes' },
  // { value: 'last-month', label: 'Mes pasado' },
  // { value: 'this-year', label: 'Este año' },
  // { value: 'last-year', label: 'Año pasado' },
];
