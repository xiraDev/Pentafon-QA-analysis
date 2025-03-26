import { isEmpty } from 'lodash';

// utilities
import { fDateTime } from '../utils/format-time-xira';

// ----------------------------------------------------------------------

export const emailTemplatesAdapter = (emailTemplates) => {
  const renderEmailTemplates = [];
  if (isEmpty(emailTemplates)) return renderEmailTemplates;
  emailTemplates.forEach((template) => {
    renderEmailTemplates.push(emailTemplateAdapter(template));
  });

  return renderEmailTemplates;
};

export const emailTemplateAdapter = (template) => ({
  id: template.id,
  template: template.template,
  createdAt: fDateTime(template.createdAt),
  updatedAt: fDateTime(template.updatedAt),
});
