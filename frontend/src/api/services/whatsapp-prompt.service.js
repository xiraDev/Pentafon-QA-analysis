import axios, { endpoints } from '../../utils/axios';

export const whatsappUrl = endpoints.whatsapp.prompts;

export const getAll = async (url) => axios.get(url)

export const updatePrompt = async (data) => axios.put(`${whatsappUrl}/${data.id}`, data)

export const createPrompt = async (data) => axios.post(whatsappUrl, data)

export const deletePrompt = async (id) => axios.delete(`${whatsappUrl}/${id}`)
