import { PATH_DASHBOARD } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;
const getIconifyIcon = (name) => <Iconify icon={name} />;

const ICONS = {
  analytics: getIconifyIcon('streamline:graph-bar-increase'),
  analyticsChat: getIconifyIcon('material-symbols:voice-chat-outline-rounded'),
  attemptsReports: getIconifyIcon('fluent-mdl2:connect-contacts'),
  campaigns: getIconifyIcon('solar:clipboard-linear'),
  contactActions: getIconifyIcon('ic:round-pending-actions'),
  conversationReports: getIconifyIcon('mdi:conversation-outline'),
  dashboard: icon('ic-dashboard'),
  emailTemplate: getIconifyIcon('fluent:mail-template-24-regular'),
  file: getIconifyIcon('material-symbols:folder-zip-outline'),
  gear: getIconifyIcon('fluent:settings-20-regular'),
  generativeFlows: getIconifyIcon('fluent:prompt-16-regular'),
  strategy: getIconifyIcon('material-symbols:strategy-outline-rounded'),
  typifications: getIconifyIcon('ph:funnel'),
  user: getIconifyIcon('solar:user-outline'),
  voicebotRecordings: getIconifyIcon('fluent:mic-record-24-regular'),
  whatsapp: getIconifyIcon('ic:baseline-whatsapp'),
};

// ----------------------------------------------------------------------

export const navData = (t) => [
  /*
   * QA Analysis
   */
  {
    subheader: t('QA_analysis'),
    items: [
      {
        title: t('QA_dashboard'),
        path: PATH_DASHBOARD.qaAnalysis.root,
        icon: ICONS.dashboard,
      },
      {
        title: t('QA_editor'),
        path: PATH_DASHBOARD.qaAnalysis.edit,
        icon: ICONS.contactActions,
        roles: ['administrator', 'root'] 
      },
      {
        title: t('QA_analytics'),
        path: PATH_DASHBOARD.qaAnalysis.analytics,
        icon: ICONS.analytics,
      },
      {
        title: 'Audios',
        path: PATH_DASHBOARD.qaAnalysis.audios,
        icon: ICONS.voicebotRecordings,
      },
      {
        title: t('Campaigns'),
        path: PATH_DASHBOARD.qaAnalysis.campaigns,
        icon: ICONS.campaigns,
        roles: ['administrator', 'root'] 
      },
    ],
  },
  /*
   * USERS
   */
  {subheader: t('user'),
    items:[
      {
        title: t('user'),
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: t('list'), path: PATH_DASHBOARD.user.list, roles: ['administrator', 'root'] },
          { title: t('account'), path: PATH_DASHBOARD.user.account },
          { title: t('create'), path: PATH_DASHBOARD.user.new, roles: ['administrator', 'root'] },
        ],
      },
    ]
  }
  
];
