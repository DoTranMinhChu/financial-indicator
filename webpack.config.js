const path = require('path');

module.exports = {
  mode: 'development', // Hoặc 'production' tùy thuộc vào môi trường bạn muốn build
  entry: './src/index.ts', // Đường dẫn đến file entry point của TypeScript
  output: {
    filename: 'bundle.js', // Tên của file bundle được tạo ra sau khi build
    path: path.resolve(__dirname, 'dist'), // Đường dẫn đến thư mục dist
  },
  resolve: {
    extensions: ['.ts', '.js'], // Xác định các phần mở rộng của file mà Webpack nên xem xét khi import
  },
  module: {
    rules: [
      // Rule để xử lý các file TypeScript
      {
        test: /\.ts$/,
        use: 'ts-loader', // Sử dụng ts-loader để biên dịch mã TypeScript thành JavaScript
        exclude: /node_modules/,
      },
    ],
  },
};
