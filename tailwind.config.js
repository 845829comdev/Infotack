module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f9fafb',
          900: '#000000', // Полностью чёрный фон
          950: '#0a0a0a', // Очень тёмный серый
        },
        accent: {
          blue: '#1e90ff', // Яркий синий для акцентов
          cyan: '#00ffff', // Яркий циан
        },
      },
    },
  },
  plugins: [],
}
