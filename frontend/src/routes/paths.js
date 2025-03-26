// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  about: '/about-us',
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  customer: {
    root: path(ROOTS_DASHBOARD, '/app'),
    view: (id) => path(ROOTS_DASHBOARD, `/customers/${id}`),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/user/${id}/edit`)
  },
  file: {
    root: path(ROOTS_DASHBOARD, '/files-manager'),
    customers: path(ROOTS_DASHBOARD, '/files-manager/customers'),
    newCustomers: path(ROOTS_DASHBOARD, '/files-manager/customers/new'),
    payments: path(ROOTS_DASHBOARD, '/files-manager/payments'),
  },
  template: {
    root: path(ROOTS_DASHBOARD, '/email-templates-manager'),
  },
  contactAction: {
    root: path(ROOTS_DASHBOARD, '/contact-actions'),
    list: path(ROOTS_DASHBOARD, '/contact-actions/list'),
    view: (id) => path(ROOTS_DASHBOARD, `/contact-actions/${id}`),
  },
  whatsapp: {
    root: path(ROOTS_DASHBOARD, '/whatsapp-templates'),
    list: path(ROOTS_DASHBOARD, '/whatsapp-templates/list'),
    new: path(ROOTS_DASHBOARD, '/whatsapp-templates/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/whatsapp-templates/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/whatsapp-templates/${id}/edit`),
  },
  strategyAutomation: {
    root: path(ROOTS_DASHBOARD, '/strategy-automation'),
    list: path(ROOTS_DASHBOARD, '/strategy-automation/list'),
    new: path(ROOTS_DASHBOARD, '/strategy-automation/new'),
  },
  qaAnalysis: {
    root: path(ROOTS_DASHBOARD, '/qa/dashboard'),
    edit: path(ROOTS_DASHBOARD, '/qa/edit'),
    analytics: path(ROOTS_DASHBOARD, '/qa/analytics'),
    audios: path(ROOTS_DASHBOARD, '/qa/audios'),
    campaigns: path(ROOTS_DASHBOARD, '/qa/campaigns'),
  },
  generativeFlows: {
    root: path(ROOTS_DASHBOARD, '/generative-flows'),
    voicebot: path(ROOTS_DASHBOARD, '/generative-flows/voicebot'),
    voicebotNew: path(ROOTS_DASHBOARD, '/generative-flows/voicebot/new'),
    voicebotEdit: (id) => path(ROOTS_DASHBOARD, `/generative-flows/voicebot/${id}/edit`),
    voicebotView: (id) => path(ROOTS_DASHBOARD, `/generative-flows/voicebot/${id}`),
    whatsapp: path(ROOTS_DASHBOARD, '/generative-flows/whatsapp'),
    whatsappNew: path(ROOTS_DASHBOARD, '/generative-flows/whatsapp/new'),
    whatsappEdit: (id) => path(ROOTS_DASHBOARD, `/generative-flows/whatsapp/${id}/edit`),
    whatsappView: (id) => path(ROOTS_DASHBOARD, `/generative-flows/whatsapp/${id}`),
  },
  conversationReports: {
    root: path(ROOTS_DASHBOARD, '/conversations-reports'),
    voicebot: path(ROOTS_DASHBOARD, '/conversations-reports/voicebot'),
    whatsapp: path(ROOTS_DASHBOARD, '/conversations-reports/whatsapp'),
  },
  attemptsReports: {
    root: path(ROOTS_DASHBOARD, '/attempts-reports'),
  },
  config: {
    root: path(ROOTS_DASHBOARD, '/config'),
  },
  voicebotRecordings: {
    root: path(ROOTS_DASHBOARD, '/voicebot-recordings'),
  },
  typifications: {
    root: path(ROOTS_DASHBOARD, '/typifications'),
    voicebot: path(ROOTS_DASHBOARD, '/typifications/voicebot'),
    whatsapp: path(ROOTS_DASHBOARD, '/typifications/whatsapp'),
  },
  analytics: {
    root: path(ROOTS_DASHBOARD, '/analytics'),
  },
  analyticsChat: {
    root: path(ROOTS_DASHBOARD, '/analytics-chat'),
  },
  audios: {
    root: path(ROOTS_DASHBOARD, '/audios'),
  },
  strategy: {
    root: path(ROOTS_DASHBOARD, '/strategy'),
    list: path(ROOTS_DASHBOARD, '/strategy/list'),
    new: path(ROOTS_DASHBOARD, '/strategy/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/strategy/${id}/edit`),
  },
};

export const PATH_DOCS = '';
