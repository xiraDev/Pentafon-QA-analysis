/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import axios from '../../utils/axios';

export const whatsappTypificationsBaseUrl = '/api/v1/whatsapp-typifications';

export const getCollection = async () => {
  const res = await axios.get(whatsappTypificationsBaseUrl);

  return res.data;
};

export const createOrUpdateTypifications = async (typifications, prompt) => {
  const updatedTypifications = await axios.put(whatsappTypificationsBaseUrl, {
    newTypification: typifications,
    prompt,
  });

  return updatedTypifications.data.meta;
};

export const deleteTypification = async (typification) => {
  const res = await axios.delete(`${whatsappTypificationsBaseUrl}/${typification}`);

  return res.data;
};
