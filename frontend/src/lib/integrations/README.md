# Integrations - API Keys Management

קובץ זה מרכז את כל מפתחות ה-API החיצוניים ומנהל אותם במקום אחד.

## שימוש

```typescript
import { 
  getGeminiApiKey, 
  getGoogleMapsApiKey,
  isGeminiConfigured,
  getApiConfigStatus 
} from "@/lib/integrations/env";

// קבלת מפתח API
const geminiKey = getGeminiApiKey();

// בדיקה אם API מוגדר
if (isGeminiConfigured()) {
  // השתמש ב-Gemini API
}

// בדיקת סטטוס כל ה-APIs
const status = getApiConfigStatus();
// { gemini: true, googleMaps: false, speechToText: false }
```

## API Keys

### Gemini API
- **Environment Variable:** `GEMINI_API_KEY`
- **Function:** `getGeminiApiKey()`
- **Check:** `isGeminiConfigured()`
- **Required:** לא (אופציונלי)

### Google Maps API
- **Environment Variable:** `GOOGLE_MAPS_API_KEY`
- **Function:** `getGoogleMapsApiKey()`
- **Check:** `isGoogleMapsConfigured()`
- **Required:** לא (אופציונלי)

### Speech-to-Text API
- **Environment Variable:** `SPEECH_TO_TEXT_API_KEY`
- **Function:** `getSpeechToTextApiKey()`
- **Check:** `isSpeechToTextConfigured()`
- **Required:** לא (לא בשימוש - משתמשים ב-Web Speech API)

## יתרונות

✅ **מרכזי** - כל מפתחות ה-API במקום אחד  
✅ **Type-safe** - TypeScript types מלאים  
✅ **Validation** - בדיקות אם API מוגדר  
✅ **Maintainable** - קל לעדכן ולהוסיף APIs חדשים  

## הוספת API חדש

1. הוסף function חדש ב-`env.ts`:
```typescript
export const getNewApiKey = (): string | undefined => {
  return getEnv("NEW_API_KEY");
};

export const isNewApiConfigured = (): boolean => {
  return !!getNewApiKey();
};
```

2. עדכן את `getApiConfigStatus()`:
```typescript
export const getApiConfigStatus = () => {
  return {
    gemini: isGeminiConfigured(),
    googleMaps: isGoogleMapsConfigured(),
    speechToText: isSpeechToTextConfigured(),
    newApi: isNewApiConfigured(), // הוסף כאן
  };
};
```

3. הוסף ל-`.env.local`:
```env
NEW_API_KEY="your-key-here"
```

