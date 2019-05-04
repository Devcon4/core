
module.exports = function (wallaby) {
    return {
      files: [
        {pattern: 'src\\**\\*.ts', load: false},
        { pattern: 'src\\**\\*.spec.ts', ignore: true }
      ],
  
      tests: [
        { pattern: 'src\\**\\*.spec.ts', load: true }
      ],

      env: {
        type: 'node'
      },

      testFramework: "mocha",
    };
  };
