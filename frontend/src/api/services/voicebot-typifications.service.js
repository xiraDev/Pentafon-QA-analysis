/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import axios from '../../utils/axios';

export const voicebotTypificationsBaseUrl = '/api/v1/voicebot-typifications';

export const getCollection = async () => {
  const res = await axios.get(voicebotTypificationsBaseUrl);

  return res.data;
};

export const createOrUpdateTypifications = async (typifications, prompt) => {
  const updatedTypifications = await axios.put(voicebotTypificationsBaseUrl, {
    newTypification: typifications,
    prompt,
  });

  return updatedTypifications.data.meta;
};

export const deleteTypification = async (typification) => {
  const res = await axios.delete(`${voicebotTypificationsBaseUrl}/${typification}`);

  return res.data;
};
