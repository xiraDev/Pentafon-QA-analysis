import { isEmpty } from 'lodash';

// utilities
import { fDateTime } from '../utils/format-time-xira';

// ----------------------------------------------------------------------

export const whatsConversAdapter = (whatsConvers) => {
  const renderWhatsConvers = [];
  if (isEmpty(whatsConvers)) return renderWhatsConvers;
  whatsConvers.forEach((whatsConver) => {
    renderWhatsConvers.push(converAdapter(whatsConver));
  });

  return renderWhatsConvers;
};

export const converAdapter = (whatsConver) => ({
  id: whatsConver.id,
  phoneNumber: whatsConver.phoneNumber,
  typification: whatsConver.typification,
  createdAt: fDateTime(whatsConver.createdAt),
});

export const messagesConverAdapter = (messages) => {
  const renderMessages = [];
  if (isEmpty(messages)) return renderMessages;
  messages.forEach((message) => {
    renderMessages.push(messageAdapter(message));
  });

  return renderMessages;
};

export const messageAdapter = (message) => ({
  id: message.id,
  message: message.message,
  conversationId: message.conversationId,
  transmitter: message.transmitter,
  createdAt: fDateTime(message.createdAt),
});

export const conversations2ExportAdapter = (conversations) => {
  const finalArray = [];

  conversations.forEach((conversation) => {
    const { id: conversationId, phoneNumber, messagesWhatsapps } = conversation;

    // Recorremos cada mensaje en la conversación
    messagesWhatsapps.forEach((message) => {
      const { id: messageId, message: messageContent, transmitter, createdAt } = message;

      // Creamos un nuevo objeto con el formato requerido
      const newObject = {
        conversation_id: conversationId,
        message_id: messageId,
        phone_number: phoneNumber,
        message: messageContent,
        transmitter,
        created_at: fDateTime(createdAt),
      };

      // Agregamos el nuevo objeto al arreglo final
      finalArray.push(newObject);
    });
  });

  return finalArray;
};

export const cloneMessagesVoicebots = (sourceArray, targetArray) => {
  // Recorreremos cada elemento del arreglo de destino
  targetArray.forEach((targetItem) => {
    const targetConversationId = targetItem.id;

    // Buscar el item correspondiente en el arreglo fuente por su conversationId
    const sourceItem = sourceArray.find((item) => item.id === targetConversationId);

    // Si encontramos el item correspondiente en el arreglo fuente
    if (sourceItem) {
      // Clonamos los messagesWhatsapps del sourceItem al targetItem
      targetItem.messagesWhatsapps = [...sourceItem.messagesWhatsapps];
    }
  });

  return targetArray;
};
