module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  moduleNameMapper: {
    // Strip the .js suffix so Jest can resolve ./index.js -> ./index.ts
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
