/**
 * Centralized API keys and environment variables management
 * This file centralizes all external API integrations configuration
 */

const getEnv = (key: string, required = false): string | undefined => {
  const value = process.env[key];
  
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
};

// API Keys for external services
export const getGeminiApiKey = (): string | undefined => {
  return getEnv("GEMINI_API_KEY");
};

export const getGoogleMapsApiKey = (): string | undefined => {
  return getEnv("GOOGLE_MAPS_API_KEY");
};

export const getSpeechToTextApiKey = (): string | undefined => {
  return getEnv("SPEECH_TO_TEXT_API_KEY");
};

// Helper to check if API is configured
export const isGeminiConfigured = (): boolean => {
  return !!getGeminiApiKey();
};

export const isGoogleMapsConfigured = (): boolean => {
  return !!getGoogleMapsApiKey();
};

export const isSpeechToTextConfigured = (): boolean => {
  return !!getSpeechToTextApiKey();
};

// Get all API configuration status
export const getApiConfigStatus = () => {
  return {
    gemini: isGeminiConfigured(),
    googleMaps: isGoogleMapsConfigured(),
    speechToText: isSpeechToTextConfigured(),
  };
};

// Legacy exports for backward compatibility
export const geminiApiKey = getGeminiApiKey;
export const googleMapsApiKey = getGoogleMapsApiKey;
export const speechToTextApiKey = getSpeechToTextApiKey;

