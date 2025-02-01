export default {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },

  clearMocks: true,

  coverageProvider: "v8",

  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },

  // 📌 Define o diretório raiz para buscar arquivos de teste
  roots: ["<rootDir>/src"],

  // 📌 Ignora a pasta `dist/` ao rodar os testes
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // 📌 Ignora `dist/` ao buscar módulos
  modulePathIgnorePatterns: ["/dist/"],

  // 📌 Apenas para garantir que não seja incluído na cobertura
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],

  testEnvironment: "jest-environment-node",
};
