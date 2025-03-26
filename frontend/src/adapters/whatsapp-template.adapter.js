import { isEmpty, cloneDeep } from 'lodash';

// helpers
import { templateStatus } from '../helpers';
// _mock_
import { HEADER_OPTION, BUTTONS_OPTION, SUBTYPE_BUTTONS_OPTION } from '../_mock';

// ----------------------------------------------------------------------

export const whatsappTemplatesAdapter = (whatsappTemplates) => {
  const renderWhatsappTemplates = [];
  if (isEmpty(whatsappTemplates)) return renderWhatsappTemplates;
  whatsappTemplates.forEach((template) => {
    renderWhatsappTemplates.push(whatsappTemplateAdapter(template));
  });

  return renderWhatsappTemplates;
};

export const whatsappTemplateAdapter = (template) => ({
  name: template.name,
  status: template.status,
  renderedStatus: templateStatus(template.status),
  id: template.id,
  components: template.components,
  language: template.language,
  category: template.category,
  rejected_reason: template.rejected_reason,
  quality_score: template.quality_score,
});

export const createWhatsappTemplateAdapter = (whatsappTemplate, uploadedImages = []) => {
  const components = [];

  if (!isEmpty(whatsappTemplate.header) && whatsappTemplate.headerType === HEADER_OPTION[0].key) {
    components.push({
      type: 'HEADER',
      format: 'TEXT',
      text: whatsappTemplate.header,
    });
  } else if (whatsappTemplate.headerType === HEADER_OPTION[1].key) {
    components.push({
      type: 'HEADER',
      format: 'IMAGE',
      example: {
        header_handle: uploadedImages,
      },
    });
  }

  if (!isEmpty(whatsappTemplate.footer))
    components.push({
      type: 'FOOTER',
      text: whatsappTemplate.footer,
    });

  if (isEmpty(whatsappTemplate?.bodyText)) {
    components.push({
      type: 'BODY',
      text: whatsappTemplate.body,
    });
  } else {
    components.push({
      type: 'BODY',
      text: whatsappTemplate.body,
      example: {
        body_text: [whatsappTemplate.bodyText],
      },
    });
  }

  if (!isEmpty(whatsappTemplate.buttons)) {
    const buttonsComponents = {
      type: 'BUTTONS',
      buttons: [],
    };
    if (whatsappTemplate.buttonsType === BUTTONS_OPTION[0].key) {
      buttonsComponents.buttons = whatsappTemplate.buttons;
    } else {
      whatsappTemplate.buttons.forEach((_button) => {
        if (_button.type === SUBTYPE_BUTTONS_OPTION[1].key) {
          buttonsComponents.buttons.push({
            type: _button.type,
            text: _button.text,
            phone_number: _button.mode + _button.meta,
          });
        } else if (_button.type === SUBTYPE_BUTTONS_OPTION[2].key) {
          buttonsComponents.buttons.push({
            type: _button.type,
            text: _button.text,
            url: _button.meta,
          });
        }
      });
    }

    components.push(buttonsComponents);
  }

  return {
    category: whatsappTemplate.category,
    components,
    name: whatsappTemplate.name,
  };
};

export const whatsappTemplateEditAdapter = (template) => ({
  name: template?.name,
  status: template?.status,
  renderedStatus: templateStatus(template?.status),
  id: template?.id,
  components: {
    header: template?.components.find((el) => el.type === 'HEADER'),
    body: template?.components.find((el) => el.type === 'BODY'),
    footer: template?.components.find((el) => el.type === 'FOOTER'),
    buttons: checkButtonsType(template).buttons,
  },
  category: template?.category,
  buttonsType: checkButtonsType(template).type,
  language: template?.language,
});

function getCountryCode(phoneNumber) {
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  const countryCodeMatch = digitsOnly.match(/^\+?(\d{1,2})/);

  if (countryCodeMatch) {
    const countryCode = countryCodeMatch[1];
    return countryCode;
  }
  return null;
}

function getRightmostDigits(phoneNumber) {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  const rightmostDigits = digitsOnly.slice(-10);

  return rightmostDigits;
}

const checkButtonsType = (template) => {
  const buttonsC = cloneDeep(template?.components.find((el) => el.type === 'BUTTONS'));
  if (!buttonsC) return { buttons: [], type: BUTTONS_OPTION[0].key };

  let isCallToAction = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const button of buttonsC.buttons) {
    if (button.type === 'URL' || button.type === 'PHONE_NUMBER') {
      isCallToAction = true;
      break;
    }
  }

  if (!isCallToAction) return { buttons: buttonsC, type: BUTTONS_OPTION[0].key };

  // TODO: refactor bellow code to quit eslint-disable
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < buttonsC.buttons.length; i++) {
    if (buttonsC.buttons[i].type === 'URL') {
      buttonsC.buttons[i] = {
        type: buttonsC.buttons[i].type,
        text: buttonsC.buttons[i].text,
        mode: 'static',
        meta: buttonsC.buttons[i].url,
      };
    } else if (buttonsC.buttons[i].type === 'PHONE_NUMBER') {
      buttonsC.buttons[i] = {
        type: buttonsC.buttons[i].type,
        text: buttonsC.buttons[i].text,
        mode: `+${getCountryCode(buttonsC.buttons[i].phone_number)}`,
        meta: getRightmostDigits(buttonsC.buttons[i].phone_number),
      };
    }
  }

  return { buttons: buttonsC, type: BUTTONS_OPTION[1].key };
};

export const sendWhatsappCAAdapter = (template) => {
  const data = {
    name: template.name,
    language: { code: template.language },
    components: [],
  };

  let whatsAppMessage = null;

  if (template.headerType === 'image')
    data.components.push({
      type: 'header',
      parameters: [
        {
          type: 'image',
          image: {
            link: template.cover,
          },
        },
      ],
    });

  if (!isEmpty(template.body)) {
    data.components.push({
      type: 'body',
      parameters: template.bodyText.map((item) => ({
        type: 'text',
        text: item,
      })),
    });

    whatsAppMessage = {
      body: template.body,
      variables: template.bodyText,
    };
  }

  if (template.buttons.length > 0 && template.buttonsType === BUTTONS_OPTION[0].key)
    template.buttons.forEach((_button, idx) => {
      data.components.push({
        type: 'button',
        sub_type: _button.type.toLowerCase(),
        index: idx,
        parameters: [
          {
            type: 'PAYLOAD',
            payload: _button.text,
          },
        ],
      });
    });

  return { data, whatsAppMessage };
};
