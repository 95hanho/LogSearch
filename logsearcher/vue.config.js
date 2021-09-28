module.exports = {
  devServer: {
    // api요청이 있을때 어디에서 처리할지를 설정
    proxy: {
      "/api": {
        // 테스트
        target: "http://localhost:3000",
        changeOrigin: true,
        historyApiFallback: true,
      },
    },
  },
  outputDir: "../backend2/public",
};
