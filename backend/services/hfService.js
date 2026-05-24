const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Generates an image from a text prompt using Pollinations.ai
 * @param {string} prompt - The text prompt for image generation
 * @returns {Promise<Buffer>} - A buffer containing the image data
 */
exports.generateImage = async (prompt) => {
  try {
    // Encode the prompt to be safely used in a URL
    const encodedPrompt = encodeURIComponent(prompt);
    // Pollinations.ai endpoint for text-to-image generation
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux`;
    console.log(`Generating image for prompt: ${prompt}`);
    
    // Make a GET request to the API endpoint.
    // It will return the image directly.
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer', // Important: tells axios to treat the response as binary data
    });

    return response.data; // This is the image buffer
  } catch (error) {
    console.error('Error generating image with Pollinations.ai:', error.message);
    // Fallback: return a blank placeholder image to avoid app crashes.
    console.log('Using placeholder image instead.');
    // You can keep your previous mock logic or remove it.
    const dummyBuffer = Buffer.from(
      '<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#4f46e5"/><text x="50%" y="50%" font-size="20" fill="white" text-anchor="middle">AI Design (Demo)</text></svg>'
    );
    return dummyBuffer;
  }
};

/**
 * Generates interior design tips using a free text generation endpoint.
 * @param {string} roomType - The type of room (e.g., 'Living Room')
 * @param {string} style - The desired design style (e.g., 'Modern')
 * @param {string} additionalInfo - Optional extra information
 * @returns {Promise<string>} - A string containing the design tips
 */
exports.generateTips = async (roomType, style, additionalInfo = '') => {
  try {
    const prompt = `Give 3 specific, actionable design tips for a ${roomType} in ${style} style. ${additionalInfo}. Keep each tip concise.`;
    const encodedPrompt = encodeURIComponent(prompt);
    // Text generation model endpoint from Pollinations.ai
    const url = `https://text.pollinations.ai/${encodedPrompt}`;
    
    const response = await axios({
      method: 'get',
      url: url,
    });
    
    let tips = response.data;
    if (!tips || tips.length < 10) {
      throw new Error('No tips generated');
    }
    return tips;
  } catch (error) {
    console.error('Error generating tips:', error.message);
    // Provide a more generic fallback text
    return `1. Choose a calm, neutral color palette with ${style} accents.
2. Add natural elements like wood and indoor plants to create warmth.
3. Maximize natural light to make your ${roomType} feel more spacious.`;
  }
};