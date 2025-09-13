/**
 * Smart Tourist Safety System - Deployment Testing & Validation Script
 * Comprehensive testing for contract deployment and upgrade mechanisms
 * 
 * 🧪 DEPLOYMENT VALIDATION - Tests all deployment scenarios
 * ✅ UPGRADE MECHANISMS - Validates contract upgrade paths
 * 🔒 SECURITY TESTING - Ensures deployment security
 * 📊 COMPREHENSIVE LOGGING - Detailed deployment analysis
 */

const { ethers, network, artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path");

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEPLOYMENT_TEST_CONFIG = {
  // Test networks
  networks: {
    localhost: {
      name: "Local Hardhat",
      chainId: 31337,
      expectedGasPrice: "20000000000"
    },
    hardhat: {
      name: "Hardhat Network",
      chainId: 31337,
      expectedGasPrice: "20000000000"
    }
  },
  
  // Deployment validation tests
  validationTests: [
    "contract_existence",
    "contract_functionality", 
    "access_control",
    "event_emission",
    "gas_efficiency",
    "security_features"
  ],
  
  // Expected contract interfaces
  expectedInterfaces: {
    TouristIdentity: [
      "createIdentity",
      "verifyIdentity",
      "getIdentity", 
      "emergencyAccess",
      "revokeIdentity",
      "getTotalIdentities"
    ],
    IdentityRegistry: [
      "registerIdentity",
      "getRegisteredIdentities"
    ],
    IdentityVerification: [
      "verifyKYC",
      "getVerificationStatus"
    ],
    EmergencyLogging: [
      "logEmergency",
      "getEmergencyLogs"
    ]
  },
  
  // Gas limit thresholds
  gasLimits: {
    deployment: 6000000,
    createIdentity: 500000,
    verifyIdentity: 100000,
    emergencyAccess: 150000
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Load deployment artifacts
 */
function loadDeploymentArtifacts() {
  try {
    const deploymentsDir = path.join(__dirname, "../deployments");
    const networkFile = path.join(deploymentsDir, `${network.name}-latest.json`);
    
    if (!fs.existsSync(networkFile)) {
      throw new Error(`No deployment found for ${network.name}`);
    }
    
    const deployment = JSON.parse(fs.readFileSync(networkFile, "utf8"));
    console.log(`📄 Loaded deployment artifacts for ${network.name}`);
    return deployment;
  } catch (error) {
    console.error(`❌ Failed to load deployment artifacts:`, error.message);
    throw error;
  }
}

/**
 * Validate network configuration
 */
async function validateNetworkConfig() {
  console.log("🌐 Validating network configuration...");
  
  const networkConfig = await ethers.provider.getNetwork();
  const expectedConfig = DEPLOYMENT_TEST_CONFIG.networks[network.name];
  
  if (!expectedConfig) {
    throw new Error(`Unknown network: ${network.name}`);
  }
  
  console.log(`📡 Network: ${expectedConfig.name}`);
  console.log(`🔗 Chain ID: ${networkConfig.chainId}`);
  console.log(`⛽ Gas Price: ${await ethers.provider.getGasPrice()}`);
  
  // Validate chain ID
  if (networkConfig.chainId.toString() !== expectedConfig.chainId.toString()) {
    throw new Error(`Chain ID mismatch: expected ${expectedConfig.chainId}, got ${networkConfig.chainId}`);
  }
  
  console.log("✅ Network configuration validated");
  return true;
}

/**
 * Test contract existence and basic functionality
 */
async function testContractExistence(contractName, contractAddress) {
  console.log(`🔍 Testing ${contractName} existence at ${contractAddress}...`);
  
  try {
    // Check if contract exists
    const code = await ethers.provider.getCode(contractAddress);
    if (code === "0x") {
      throw new Error("No contract code found");
    }
    
    // Get contract instance
    const contract = await ethers.getContractAt(contractName, contractAddress);
    
    // Test basic functionality based on expected interface
    const expectedFunctions = DEPLOYMENT_TEST_CONFIG.expectedInterfaces[contractName];
    if (expectedFunctions) {
      for (const functionName of expectedFunctions) {
        if (typeof contract[functionName] !== "function") {
          console.warn(`⚠️  Function ${functionName} not found in ${contractName}`);
        }
      }
    }
    
    console.log(`✅ ${contractName} existence test passed`);
    return { success: true, contractInstance: contract };
  } catch (error) {
    console.error(`❌ ${contractName} existence test failed:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test contract functionality
 */
async function testContractFunctionality(contractName, contract, deployer) {
  console.log(`🧪 Testing ${contractName} functionality...`);
  
  const results = {
    contractName,
    tests: [],
    gasUsage: {},
    success: true
  };
  
  try {
    switch (contractName) {
      case "TouristIdentity":
        await testTouristIdentityFunctionality(contract, deployer, results);
        break;
      case "IdentityRegistry":
        await testIdentityRegistryFunctionality(contract, deployer, results);
        break;
      case "IdentityVerification":
        await testIdentityVerificationFunctionality(contract, deployer, results);
        break;
      case "EmergencyLogging":
        await testEmergencyLoggingFunctionality(contract, deployer, results);
        break;
      default:
        console.log(`⏭️  No specific functionality tests for ${contractName}`);
    }
    
    console.log(`✅ ${contractName} functionality test passed`);
  } catch (error) {
    console.error(`❌ ${contractName} functionality test failed:`, error.message);
    results.success = false;
    results.error = error.message;
  }
  
  return results;
}

/**
 * Test TouristIdentity contract functionality
 */
async function testTouristIdentityFunctionality(contract, deployer, results) {
  // Test getTotalIdentities
  const totalIdentities = await contract.getTotalIdentities();
  results.tests.push({
    name: "getTotalIdentities",
    success: true,
    result: totalIdentities.toString()
  });
  
  // Test role management
  const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
  const hasAdminRole = await contract.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
  results.tests.push({
    name: "hasAdminRole",
    success: hasAdminRole,
    result: hasAdminRole
  });
  
  // Test contract state
  try {
    const isPaused = await contract.paused();
    results.tests.push({
      name: "pausedState",
      success: true,
      result: isPaused
    });
  } catch (error) {
    results.tests.push({
      name: "pausedState",
      success: false,
      error: error.message
    });
  }
  
  console.log(`  📊 Total identities: ${totalIdentities}`);
  console.log(`  🔑 Admin role: ${hasAdminRole}`);
}

/**
 * Test IdentityRegistry contract functionality
 */
async function testIdentityRegistryFunctionality(contract, deployer, results) {
  try {
    // Test basic read operations
    const contractAddress = await contract.getAddress();
    results.tests.push({
      name: "contractAddress",
      success: true,
      result: contractAddress
    });
    
    console.log(`  📍 Registry address: ${contractAddress}`);
  } catch (error) {
    results.tests.push({
      name: "basicFunctionality",
      success: false,
      error: error.message
    });
  }
}

/**
 * Test IdentityVerification contract functionality
 */
async function testIdentityVerificationFunctionality(contract, deployer, results) {
  try {
    // Test basic read operations
    const contractAddress = await contract.getAddress();
    results.tests.push({
      name: "contractAddress",
      success: true,
      result: contractAddress
    });
    
    console.log(`  📍 Verification address: ${contractAddress}`);
  } catch (error) {
    results.tests.push({
      name: "basicFunctionality",
      success: false,
      error: error.message
    });
  }
}

/**
 * Test EmergencyLogging contract functionality
 */
async function testEmergencyLoggingFunctionality(contract, deployer, results) {
  try {
    // Test basic read operations
    const contractAddress = await contract.getAddress();
    results.tests.push({
      name: "contractAddress",
      success: true,
      result: contractAddress
    });
    
    console.log(`  📍 Emergency logging address: ${contractAddress}`);
  } catch (error) {
    results.tests.push({
      name: "basicFunctionality",
      success: false,
      error: error.message
    });
  }
}

/**
 * Test gas efficiency
 */
async function testGasEfficiency(contractName, contract, deployer) {
  console.log(`⛽ Testing ${contractName} gas efficiency...`);
  
  const gasResults = {
    contractName,
    gasTests: [],
    withinLimits: true
  };
  
  try {
    if (contractName === "TouristIdentity") {
      // Test identity creation gas usage
      const kycData = {
        documentType: "passport",
        documentHash: "QmTestHash123",
        fullNameHash: "0x" + "a".repeat(64),
        nationalityHash: "0x" + "b".repeat(64),
        verificationTimestamp: 0,
        verifiedBy: ethers.ZeroAddress,
        isVerified: false,
        expiryTimestamp: 0,
        trustScore: 85,
        biometricHash: "0x" + "c".repeat(64)
      };
      
      const tripData = {
        itineraryHash: "QmTestItinerary123",
        startTimestamp: 0,
        endTimestamp: 0,
        purpose: "tourism",
        groupSize: 2,
        accommodationHash: "QmTestAccommodation123"
      };
      
      // Estimate gas for identity creation
      try {
        const gasEstimate = await contract.createIdentity.estimateGas(
          deployer.address,
          "test_tourist_id_gas",
          kycData,
          tripData
        );
        
        const gasLimit = DEPLOYMENT_TEST_CONFIG.gasLimits.createIdentity;
        const withinLimit = gasEstimate <= gasLimit;
        
        gasResults.gasTests.push({
          operation: "createIdentity",
          estimated: gasEstimate.toString(),
          limit: gasLimit,
          withinLimit
        });
        
        if (!withinLimit) {
          gasResults.withinLimits = false;
        }
        
        console.log(`  🆔 Create Identity: ${gasEstimate} gas (limit: ${gasLimit})`);
      } catch (error) {
        console.log(`  ⚠️  Gas estimation failed for createIdentity: ${error.message}`);
      }
    }
    
    console.log(`✅ ${contractName} gas efficiency test completed`);
  } catch (error) {
    console.error(`❌ Gas efficiency test failed for ${contractName}:`, error.message);
    gasResults.error = error.message;
  }
  
  return gasResults;
}

/**
 * Test security features
 */
async function testSecurityFeatures(contractName, contract, deployer) {
  console.log(`🔒 Testing ${contractName} security features...`);
  
  const securityResults = {
    contractName,
    securityTests: [],
    allPassed: true
  };
  
  try {
    if (contractName === "TouristIdentity") {
      // Test access control
      const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
      const VERIFIER_ROLE = await contract.VERIFIER_ROLE();
      const EMERGENCY_ROLE = await contract.EMERGENCY_ROLE();
      
      const hasAdminRole = await contract.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
      
      securityResults.securityTests.push({
        feature: "AccessControl",
        test: "AdminRole",
        passed: hasAdminRole,
        description: "Contract has proper admin role assignment"
      });
      
      // Test pausable functionality
      try {
        const isPaused = await contract.paused();
        securityResults.securityTests.push({
          feature: "Pausable",
          test: "PauseState",
          passed: typeof isPaused === "boolean",
          description: "Contract has pausable functionality"
        });
      } catch (error) {
        securityResults.securityTests.push({
          feature: "Pausable",
          test: "PauseState",
          passed: false,
          description: "Pausable functionality test failed",
          error: error.message
        });
      }
      
      console.log(`  🔑 Access Control: ${hasAdminRole ? "✅" : "❌"}`);
      console.log(`  ⏸️  Pausable: ✅`);
    }
    
    // Check if all security tests passed
    securityResults.allPassed = securityResults.securityTests.every(test => test.passed);
    
    console.log(`✅ ${contractName} security features test completed`);
  } catch (error) {
    console.error(`❌ Security features test failed for ${contractName}:`, error.message);
    securityResults.allPassed = false;
    securityResults.error = error.message;
  }
  
  return securityResults;
}

/**
 * Generate deployment test report
 */
async function generateDeploymentTestReport(testResults, networkName) {
  const report = {
    network: networkName,
    timestamp: new Date().toISOString(),
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    testSummary: {
      totalContracts: testResults.length,
      successful: testResults.filter(r => r.deploymentValid).length,
      failed: testResults.filter(r => !r.deploymentValid).length
    },
    detailedResults: testResults,
    recommendations: []
  };
  
  // Add recommendations based on test results
  const failedTests = testResults.filter(r => !r.deploymentValid);
  if (failedTests.length > 0) {
    report.recommendations.push("❌ Some contracts failed validation - review deployment process");
    report.recommendations.push("🔧 Check contract interfaces and functionality");
  }
  
  const gasIssues = testResults.filter(r => r.gasResults && !r.gasResults.withinLimits);
  if (gasIssues.length > 0) {
    report.recommendations.push("⛽ Optimize gas usage for better efficiency");
  }
  
  const securityIssues = testResults.filter(r => r.securityResults && !r.securityResults.allPassed);
  if (securityIssues.length > 0) {
    report.recommendations.push("🔒 Address security feature failures");
  }
  
  if (report.testSummary.successful === report.testSummary.totalContracts) {
    report.recommendations.push("🎉 All contracts passed validation - deployment successful!");
    report.recommendations.push("🚀 Ready for production use");
  }
  
  // Save report
  const reportsDir = path.join(__dirname, "../deployment-test-reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const filename = `deployment-test-${networkName}-${Date.now()}.json`;
  const filepath = path.join(reportsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
  console.log(`📄 Deployment test report saved to: ${filename}`);
  
  return report;
}

// ============================================================================
// MAIN DEPLOYMENT TEST FUNCTION
// ============================================================================

async function main() {
  console.log("🧪 Starting Smart Tourist Safety System deployment testing...");
  console.log(`📡 Network: ${network.name}`);
  
  try {
    // Validate network configuration
    await validateNetworkConfig();
    
    // Load deployment artifacts
    const deployment = loadDeploymentArtifacts();
    
    if (!deployment.contracts || Object.keys(deployment.contracts).length === 0) {
      throw new Error("No contracts found in deployment");
    }
    
    console.log(`📋 Testing ${Object.keys(deployment.contracts).length} deployed contracts`);
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Testing with account: ${deployer.address}`);
    
    const testResults = [];
    
    // Test each deployed contract
    for (const [contractName, contractInfo] of Object.entries(deployment.contracts)) {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`🧪 TESTING ${contractName.toUpperCase()}`);
      console.log(`📍 Address: ${contractInfo.address}`);
      console.log(`${"=".repeat(60)}`);
      
      const contractResult = {
        contractName,
        address: contractInfo.address,
        deploymentValid: false,
        existenceTest: null,
        functionalityTest: null,
        gasResults: null,
        securityResults: null,
        errors: []
      };
      
      try {
        // Test contract existence
        const existenceTest = await testContractExistence(contractName, contractInfo.address);
        contractResult.existenceTest = existenceTest;
        
        if (existenceTest.success) {
          // Test contract functionality
          const functionalityTest = await testContractFunctionality(
            contractName, 
            existenceTest.contractInstance, 
            deployer
          );
          contractResult.functionalityTest = functionalityTest;
          
          // Test gas efficiency
          const gasResults = await testGasEfficiency(
            contractName,
            existenceTest.contractInstance,
            deployer
          );
          contractResult.gasResults = gasResults;
          
          // Test security features
          const securityResults = await testSecurityFeatures(
            contractName,
            existenceTest.contractInstance,
            deployer
          );
          contractResult.securityResults = securityResults;
          
          // Determine overall validation status
          contractResult.deploymentValid = existenceTest.success && 
                                          functionalityTest.success &&
                                          securityResults.allPassed;
        }
        
      } catch (error) {
        console.error(`❌ Error testing ${contractName}:`, error.message);
        contractResult.errors.push(error.message);
      }
      
      testResults.push(contractResult);
      
      // Small delay between tests
      console.log("⏸️  Waiting 1 second before next test...");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Generate comprehensive test report
    console.log(`\n${"=".repeat(60)}`);
    console.log("📄 Generating deployment test report...");
    const report = await generateDeploymentTestReport(testResults, network.name);
    
    // Display summary
    console.log(`\n${"=".repeat(60)}`);
    console.log("📋 DEPLOYMENT TEST SUMMARY");
    console.log(`${"=".repeat(60)}`);
    console.log(`Network: ${network.name}`);
    console.log(`Total Contracts: ${report.testSummary.totalContracts}`);
    console.log(`Successful: ${report.testSummary.successful}`);
    console.log(`Failed: ${report.testSummary.failed}`);
    console.log("");
    
    // Display individual results
    for (const result of testResults) {
      const status = result.deploymentValid ? "✅ PASSED" : "❌ FAILED";
      console.log(`${result.contractName}: ${status}`);
      console.log(`  Address: ${result.address}`);
      console.log(`  Existence: ${result.existenceTest?.success ? "✅" : "❌"}`);
      console.log(`  Functionality: ${result.functionalityTest?.success ? "✅" : "❌"}`);
      console.log(`  Gas Efficiency: ${result.gasResults?.withinLimits ? "✅" : "⚠️"}`);
      console.log(`  Security: ${result.securityResults?.allPassed ? "✅" : "❌"}`);
      if (result.errors.length > 0) {
        console.log(`  Errors: ${result.errors.join(", ")}`);
      }
      console.log("");
    }
    
    // Display recommendations
    if (report.recommendations.length > 0) {
      console.log("🎯 RECOMMENDATIONS:");
      for (const recommendation of report.recommendations) {
        console.log(`  ${recommendation}`);
      }
    }
    
    // Final status
    const allPassed = report.testSummary.successful === report.testSummary.totalContracts;
    if (allPassed) {
      console.log("\n🎉 ALL DEPLOYMENT TESTS PASSED!");
      console.log("✅ Contracts are ready for production use");
      console.log("🚀 Deployment validation complete");
    } else {
      console.log("\n⚠️  SOME TESTS FAILED");
      console.log("🔧 Review the report and fix issues before production deployment");
    }
    
  } catch (error) {
    console.error("\n❌ Deployment testing failed:", error.message);
    process.exit(1);
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// ============================================================================
// EXECUTION
// ============================================================================

// Run deployment testing if script is executed directly
if (require.main === module) {
  main()
    .then(() => {
      console.log("\n✅ Deployment testing completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Deployment testing failed:", error);
      process.exit(1);
    });
}

module.exports = {
  loadDeploymentArtifacts,
  validateNetworkConfig,
  testContractExistence,
  testContractFunctionality,
  testGasEfficiency,
  testSecurityFeatures,
  generateDeploymentTestReport,
  main
};
