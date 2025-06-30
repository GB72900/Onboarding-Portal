/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FunctionKey: string; // add your variables here
  // more variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
