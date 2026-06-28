import * as p from "@clack/prompts";

export async function collectProjectPreferences(argumentPath) {
  return p.group(
    {
      path: () =>
        argumentPath
          ? Promise.resolve(argumentPath)
          : p.text({
              message: "Where should we create your project?",
              placeholder: "./my-react-dose-app",
              defaultValue: "./my-react-dose-app",
            }),
      framework: () =>
        p.select({
          message: "Select the framework architecture for your ecosystem:",
          options: [
            { value: "react-core", label: "React-vite (Vite-powered Core)" },
            { value: "next-core", label: "Next-app (App Router Core)" },
          ],
        }),
      architectureFlavor: ({ results }) => {
        if (results.framework === "react-core") {
          return p.select({
            message: "Select your React architecture flavor:",
            options: [
              { value: "spa", label: "React SPA (Standard Client-Side App)" },
              {
                value: "router-v7",
                label: "React Router v7 (Standard Routing & Layouts)",
              },
            ],
          });
        }
        return Promise.resolve("none");
      },
      typescript: () =>
        p.confirm({
          message: "Would you like to use TypeScript for type safety?",
          initialValue: true,
        }),
      store: () =>
        p.select({
          message: "Select State Management Store for your ecosystem:",
          options: [
            { value: "none", label: "None (Prop Drilling / Context API)" },
            { value: "zustand", label: "Zustand (Lightweight & Modern)" },
            { value: "redux", label: "Redux Toolkit (Enterprise State)" },
          ],
        }),
      tailwind: () =>
        p.confirm({
          message: "Would you like to integrate Tailwind CSS for styling?",
          initialValue: true,
        }),
      i18n: () =>
        p.confirm({
          message:
            "Do you need multi-language support (i18n Internationalization)?",
          initialValue: false,
        }),
      reactCompiler: ({ results }) => {
        if (results.framework === "next-core") {
          return p.confirm({
            message: "Would you like to enable the React Compiler?",
            initialValue: true,
          });
        }
        return Promise.resolve(false);
      },
    },
    {
      onCancel: () => {
        p.cancel("Scaffolding cancelled by user.");
        process.exit(0);
      },
    },
  );
}
