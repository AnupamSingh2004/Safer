// ============================================================================
// SMART TOURIST SAFETY - HARDHAT CONFIGURATION (Simplified for Demo)
// ============================================================================

require('@nomicfoundation/hardhat-toolbox');

// ============================================================================
// SIMPLIFIED CONFIGURATION FOR DEMO
// ============================================================================

const config = {
  // Solidity Configuration
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  // Network Configuration
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337
    },
    hardhat: {
      chainId: 31337
    }
  },

  // Paths Configuration
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  }
};

module.exports = config;

module.exports = config;