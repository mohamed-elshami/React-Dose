import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import type { Lang } from "@/i18n/i18next";

export function useLocale() {
  const { t, i18n: i18nInstance } = useTranslation();

  const changeLanguage = async (lang: Lang) => {
    localStorage.setItem("lang", lang);
    await i18n.changeLanguage(lang);
  };

  return {
    t,
    changeLanguage,
    currentLanguage: i18nInstance.resolvedLanguage as Lang,
  };
}
