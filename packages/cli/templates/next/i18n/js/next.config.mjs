import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
