module.exports = {
  extends: [
    'expo',
    'plugin:react-native-a11y/recommended'
  ],
  plugins: [
    'react-native-a11y'
  ],
  rules: {
    // You can customize specific rules here
    'react-native-a11y/has-accessibility-hint': 'warn',
    'react-native-a11y/has-valid-accessibility-descriptors': 'error',
  }
};