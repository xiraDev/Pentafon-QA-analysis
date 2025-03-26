import axios, { endpoints } from '../../utils/axios';

export const voicebotUrl = endpoints.voicebot.prompts;

export const getAll = async (url) => axios.get(url)

export const updatePrompt = async (data) => axios.put(`${voicebotUrl}/${data.id}`, data)

export const createPrompt = async (data) => axios.post(voicebotUrl, data)

export const deletePrompt = async (id) => axios.delete(`${voicebotUrl}/${id}`)
