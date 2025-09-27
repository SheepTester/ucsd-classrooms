declare const process: { env: { NODE_ENV: "development" | "production" } };

declare module "*.webp" {
  const path: string;
  export default path;
}

declare module "*.svg" {
  const path: string;
  export default path;
}
