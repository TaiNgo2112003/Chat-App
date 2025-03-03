import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { languageTitle: "Language", languageDescription: "Select your preferred language" } },
    vi: { translation: { languageTitle: "Ngôn ngữ", languageDescription: "Chọn ngôn ngữ bạn muốn" } },
    fr: { translation: { languageTitle: "Langue", languageDescription: "Sélectionnez votre langue préférée" } },
    es: { translation: { languageTitle: "Idioma", languageDescription: "Selecciona tu idioma preferido" } }
  },
  lng: 'en', // Ngôn ngữ mặc định
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
