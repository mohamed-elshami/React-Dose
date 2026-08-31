import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Example: route("about", `routes/about.tsx`),
] satisfies RouteConfig;
