const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const HF_API_TOKEN = process.env.HF_API_TOKEN;

// Generate image from text prompt (using Stable Diffusion)
exports.generateImage = async (prompt) => {
  const response = await axios({
    url: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
    method: 'post',
    headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
    data: { inputs: prompt },
    responseType: 'arraybuffer'
  });
  return response.data; // returns image buffer
};

// Generate design tips from room description
exports.generateTips = async (roomType, style, additionalInfo = '') => {
  const prompt = `You are an interior design expert. Give 3 specific, actionable design tips for a ${roomType} in ${style} style. ${additionalInfo}. Keep each tip under 20 words.`;
  const response = await axios({
    url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
    method: 'post',
    headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
    data: { inputs: prompt }
  });
  // The model returns a response, extract text
  let tips = response.data?.generated_text || response.data[0]?.generated_text || '';
  tips = tips.replace(prompt, '').trim();
  if (!tips) tips = 'Use natural lighting. Add indoor plants. Choose neutral wall colors.';
  return tips;
};