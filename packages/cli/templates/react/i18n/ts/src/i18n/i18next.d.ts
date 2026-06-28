import en from "./locales/en.json";

export type Lang = "en" | "ar";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof en;
    };
  }
}
