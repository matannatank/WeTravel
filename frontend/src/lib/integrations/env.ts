const requiredServerEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    console.warn(`[integrations] Missing ${key}. Using placeholder value.`);
    return "";
  }

  return value;
};

export const geminiApiKey = () => requiredServerEnv("GEMINI_API_KEY");
export const googleMapsApiKey = () =>
  requiredServerEnv("GOOGLE_MAPS_API_KEY");
export const speechToTextApiKey = () =>
  requiredServerEnv("SPEECH_TO_TEXT_API_KEY");

