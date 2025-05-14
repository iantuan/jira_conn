import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! 僅在測試環境或開發環境使用
    // 在生產環境前應修復所有類型錯誤
    ignoreBuildErrors: true,
  },
  // 禁用靜態生成，改用按需渲染
  output: "standalone",
  reactStrictMode: false
};

export default nextConfig;
