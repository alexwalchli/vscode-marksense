module.exports = (wallaby) => {
  return {
    files: [
      'src/**/*.ts',
    ],
    tests: [
      'test/**/*.test.ts'
    ],
    compilers: {
      '**/*.ts': wallaby.compilers.babel()
    },
    env: {
      type: "node"
    },
    setup: function(wallaby){
      console.log('Setup');
      console.log('Current worker id: ' + wallaby.workerId);
      console.log('Current session id: ' + wallaby.sessionId);
    },
    teardown: function (wallaby) {
      console.log('Teardown');
      console.log('Current worker id: ' + wallaby.workerId);
      console.log('Current session id: ' + wallaby.sessionId);
    },
    testFramework: 'mocha',
    debug: true
  };
};