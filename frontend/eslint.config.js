module.exports = {
  rules: {
    "import/no-unresolved": 0,
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        alias: {
          "@env": ".env",
        },
      },
    },
  },
};
