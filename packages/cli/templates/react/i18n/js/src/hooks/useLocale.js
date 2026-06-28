import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export function useLocale() {
  const { t, i18n: i18nInstance } = useTranslation();

  /** @param {Lang} lang */
  const changeLanguage = async (lang) => {
    localStorage.setItem("lang", lang);
    await i18n.changeLanguage(lang);
  };

  return {
    t,
    changeLanguage,
    currentLanguage: i18nInstance.resolvedLanguage,
  };
}
