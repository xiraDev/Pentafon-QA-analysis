import { fDateTime } from '../utils/format-time-xira';

export const voicebotPromptsAdapter = (prompts) => {
  const adaptedPrompts = [];
  if (!prompts || prompts.length === 0) return adaptedPrompts;

  prompts.forEach((prompt) => {
    adaptedPrompts.push(voicebotPromptAdapter(prompt));
  });

  return adaptedPrompts;
};

export const voicebotPromptAdapter = (prompt) => ({
  name: prompt.name,
  id: prompt._id,
  prompt: prompt.prompt.length > 20 ? `${prompt.prompt.substring(0, 20)}...` : prompt.prompt,
  additionalPrompt:
    prompt.additionalPrompt && prompt.additionalPrompt.length > 30
      ? `${prompt.additionalPrompt.substring(0, 30)}...`
      : prompt.additionalPrompt || '',
  createdAt: fDateTime(prompt.createdAt),
  updatedAt: fDateTime(prompt.updatedAt),
  isEnable: prompt.isEnable,
});

export const voicebotPromptEditAdapter = (prompt) => ({
  id: prompt?._id,
  name: prompt?.name,
  status: prompt?.isEnable ? 'enabled' : 'disabled',
  renderedStatus: prompt?.isEnable ? 'Habilitado' : 'Deshabilitado',
  prompt: {
    text: prompt?.prompt,
    additionalText: prompt?.additionalPrompt || '',
  },
  createdAt: prompt?.createdAt,
  updatedAt: prompt?.updatedAt,
});

export const createVoicebotPromptAdapter = (data) => ({
  name: data.name.trim().toLowerCase(),
  prompt: data.prompt.trim(),
  additionalPrompt: data.additionalPrompt ? data.additionalPrompt.trim() : '',
  isEnable: data.isEnable || false,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
