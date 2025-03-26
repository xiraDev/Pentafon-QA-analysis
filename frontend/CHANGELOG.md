# Changelog

## V4.0.3

#### Mar 6, 2025

- **NEW** Translate events from backend
- Update `backend/src/helpers/error-response.js`
- Update `backend/src/controllers/` 
  - in `calling-list.controller.js`
  - in `customer.controller.js`
  - in `email-templates.controller.js`
  - in `experimental.controller.js`
  - in `historical-payments.controller.js`
  - in `mongo/config.controller.js`
  - in `mongo/user.controller.js`
  - in `mongo/whatsapp-conversations.controller.js`
  - in `mongo/whatsapp-prompt.controller.js`
  - in `recordings/voicebot-recordings.controller.js`
  - in `sendgrid.controller.js`
  - in `sql/assignment-files.controller.js`
  - in `sql/attempt.controller.js`
  - in `sql/auth.controller.js`
  - in `sql/channel.controller.js`
  - in `sql/contact-actions.controller.js`
  - in `sql/filter.controller.js`
  - in `sql/rule-filters.controller.js`
  - in `sql/strategy-rules.controller.js`
  - in `sql/strategy.controller.js`
  - in `sql/voicebot-conversations.controller.js`
  - in `sql/voicebot-voices.controller.js`
  - in `sql/whatsapp-conversations.controller.js`
  - in `user.controller.js`
  - in `whatsapp-message-templates.controller.js`
- Update `frontend/src/actions/`
  - in `auth.js`
  - in `contact-action.js`
  - in `customer.js`
  - in `email-template.js`
  - in `strategy-rule.js`
  - in `strategy.js`
  - in `user.js`
  - in `voicebot-recording.js`
  - in `whatsapp-template.js`
- Update `frontend/src/adapters/contact-action.adapter.js`
- Update `frontend/src/api/services/voicebot-prompt.service.js`
- Update `frontend/src/api/services/whatsapp-prompt.service.js`
- Update `frontend/src/sections/auth/jwt/jwt-sign-in-view.jsx`
- Update `frontend/src/sections/management`
  - in `config/config-email-recipients.jsx`
  - in `config/config-report-contact-actions.jsx`
  - in `config/config-whatsapp.jsx`
  - in `email/email-template-form.jsx`
  - in `strategy/strategy-list.jsx`
  - in `strategy/strategy-new-edit-form.jsx`
  - in `strategy/view/strategy-edit-view.jsx`
  - in `user/user-account-change-password.jsx`
  - in `user/user-account-general.jsx`
  - in `user/user-new-edit-form.jsx`
  - in `voicebot-generative-flow/voicebot-generative-flow-list.jsx`
  - in `voicebot-generative-flow/voicebot-generative-flow-new-edit-form.jsx`
  - in `voicebot-typification/voicebot-typification-form.jsx`
  - in `whatsapp-generative-flow/whatsapp-generative-flow-new-edit-form.jsx`
  - in `whatsapp-typification/whatsapp-typification-form.jsx`
  - in `whatsapp/whatsapp-new-edit-template-form.jsx`
- Update `frontend/src/sections/overview/app/contact-action-form.jsx`
- Update `frontend/src/sections/overview/app/customer-list.jsx`
- Update `frontend/src/sections/overview/contact-actions/manage-ca-status-form.jsx`
- Update `frontend/src/sections/reports/atempts/attempts-list.jsx`
- Update `frontend/src/sections/reports/voicebot-recordings/voicebot-recordings-list.jsx`
  
- Update `robot/src/helpers/error-response.js`
- Update `robot/src/controllers/customer.controller.js` 



## V4.0.2

#### Mar 5, 2025

- **NEW** Refactor download CSV Files
- ADD `frontend/src/helpers/download-csv.js`
- Update `frontend/src/sections/reports/atempts/attempts-list.jsx`
- Update `frontend/src/sections/reports/voicebot-conversations/voicebot-conversations-list.jsx`
- Update `frontend/src/sections/reports/whatsapp-conversations/whatsapp-conversations-list.jsx`

## V4.0.1

#### Mar 5, 2025

- Translate Elements
- Update `/src/_mock/_filters.js`
- Update `src/locales/langs/en/common.json`
- Update `frontend/src/locales/langs/es/common.json`
- Update `frontend/src/sections/management/strategy/details/kanban-details-filter`
- Update `frontend/src/sections/management/strategy/filter-form-dialog.jsx`
- Update `frontend/src/sections/overview/app/customer-new-filter-form.jsx`
- Update `frontend/src/sections/overview/app/customer-tag-filtered.jsx`
- Update `frontend/src/sections/overview/contact-actions/contact-action-details-filters.jsx`
- Update `frontend/src/sections/overview/contact-actions/contact-action-details-general.jsx`
- Update `frontend/src/locales/langs/en/navbar.json`
- Update `frontend/src/sections/management/user/user-list.jsx`
- Update `frontend/src/sections/overview/contact-actions/contact-actions-list.jsx`
- Update `frontend/src/utils/constants.js`
  
## V4.0.0

#### Feb 28, 2025

- New Version 
  
## V3.2.0

#### Jan 13, 2025

- Refactor AHT graphic
- Update `src/pages/Dashboard/Analytics/components/AnalyticsAHT`
- Update `src/redux/slices/analytics`

## V3.1.0

#### Jan 03, 2025

- **NEW** Add component Analytics AHT
- Update `src/App`
- Update `src/main`
- Change `LocalizationProvider` to work with language dynamically
- Update `src/actions/analytics`
- Update `src/hooks/useLocales`
- Update `src/locales/en` 
- Update `src/locales/es`
- Update `src/pages/Dashboard/Analytics/GeneralAnalytics`
- Update to solve eslint errors:
  - In `src/layouts/dashboard/header/AccountPopover`
  - In `src/pages/Dashboard/ContactActions/Detail/components/ContactActionAttempts`
  - In `src/pages/Dashboard/ContactActions/Detail/components/ContactActionCallingList`
  - In `src/pages/Dashboard/ContactActions/List/ContactActionList`
  - In `src/pages/Dashboard/GeneralApp/components/CustomerList/CustomerList`
  - In `src/pages/management/FileManager/CustomerFile/List/AssignmentFileList`
  - In `src/pages/management/GenerativeFlows/Voicebot/components/VoicebotList`
  - In `src/pages/management/GenerativeFlows/Whatsapp/components/WhatsappList`
  - In `src/pages/management/User/List/UserList`
  - In `src/pages/reports/attempts/components/AttemptsList`
- Update `src/redux/slices/analytics`
- Update `src/utils/format-time`

## V3.0.2

#### Dec 18, 2024

- Refactor error message on voicebot prompt form
- Update `src/pages/management/GenerativeFlows/Voicebot/VoicebotNew/components/VoicebotNewEditForm`

## v3.0.1

#### Dec 17, 2024

- Refactor add CA id to attempts reports

## v3.0.0

#### Dec 13, 2024

- **NEW** Add manage status on CA (pause/resume/cancel)
- ADD `src/pages/Dashboard/ContactActions/List/components/ManageCAStatusForm`
- ADD `src/pages/Dashboard/ContactActions/List/ContactActionList`
- Add `frontend/public/assets/placeholder`
- Move `src/pages/Analytics` to `src/pages/Dashboard/Analytics`
- Move `src/pages/ContactActions` to `src/pages/Dashboard/ContactActions`
- Update `src/redux/slices/contact-action`
- Update `src/utils/format-time`
- Update `src/utils/formatNumber`
- Update `src/actions/contact-action`
- Update `src/locales/en`
- Update `src/locales/es`
- Update `frontend/src/components/Image`
- Update `frontend/src/helpers/check-ca-satus`
- Update `frontend/src/routes/index`

## v2.3.0

#### Dec 05, 2024

- **NEW** S3 integration on voicebot recordings
- Add progress on attempts reports download
- Refactor attempts adapter to manage null duration
- Add translate to progress on attempts reports download

## v2.2.1

#### Nov 19, 2024

- Move `src/pages/Template` to `src/pages/management/Template`
- Rename folder `src/pages/management/Template` => `src/pages/management/Email`
- Move `src/pages/Whatsapp` to `src/pages/management/Whatsapp`
- Update translate on Whatsapp management page
- Update translate on Email management page

## v2.2.0

#### Oct 30, 2024

- **NEW** page dashboard Analytics

## v2.1.0

#### Oct 28, 2024

- **NEW** section dashboard CA details
- Fix old CA attempts reports

## v2.0.0

#### Oct 16, 2024

- **NEW** Add i18n
- Refactor components removing unused imports
- Update Gpt from `gpt-3.5-turbo` to `gpt-4o`

## v1.1.0

#### Sep 04, 2024

- Add voicebot v3
- Remove ^ characters from packaje.json
- **NEW** section management Config email recipients
- Refactor and validations in whatsapp functions and voicebot

## v1.0.0

#### Aug 29, 2024

Initial release.