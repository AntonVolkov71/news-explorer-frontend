const presets = [
    [
      "@babel/env",
      {
        targets: { 
          "browsers": [ ">0.25%", "not ie 11"]
        },
        useBuiltIns: "usage",
        corejs: "3.4.1" 
      }
    ],
  ];
  
  module.exports = { presets };