require('babel-register');
require('babel-polyfill');


module.exports = {
  networks: {
    development: {
      host: "172.29.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 5000000
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.6.12",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
