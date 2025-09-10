/**
 * Smart Tourist Safety System - Smart Contract Deployment Script
 * Automated deployment script for tourist identity blockchain contracts
 */

const { ethers, network, hardhat } = require("hardhat");
const fs = require("fs");
const path = require("path");

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEPLOYMENT_CONFIG = {
  // Network specific settings
  networks: {
    localhost: {
      gasPrice: "20000000000", // 20 gwei
      gasLimit: "6000000",
      confirmations: 1
    },
    polygon: {
      gasPrice: "30000000000", // 30 gwei
      gasLimit: "6000000",
      confirmations: 2
    },
    mumbai: {
      gasPrice: "20000000000", // 20 gwei
      gasLimit: "6000000",
      confirmations: 1
    }
  },
  
  // Contract deployment order
  deploymentOrder: [
    "IdentityRegistry",
    "TouristIdentity", 
    "IdentityVerification",
    "EmergencyLogging"
  ],
  
  // Constructor parameters
  constructorParams: {
    IdentityRegistry: [],
    TouristIdentity: [], // Will be filled with registry address
    IdentityVerification: [], // Will be filled with registry address
    EmergencyLogging: [] // Will be filled with registry address
  }
};

// ============================================================================
// DEPLOYMENT FUNCTIONS
// ============================================================================

/**
 * Deploy a single contract
 */
async function deployContract(contractName, constructorArgs = [], deployer) {
  console.log(`\n📋 Deploying ${contractName}...`);
  
  try {
    // Get contract factory
    const ContractFactory = await ethers.getContractFactory(contractName, deployer);
    
    // Get network config
    const networkConfig = DEPLOYMENT_CONFIG.networks[network.name] || 
                         DEPLOYMENT_CONFIG.networks.localhost;
    
    // Deploy contract
    const contract = await ContractFactory.deploy(...constructorArgs, {
      gasPrice: networkConfig.gasPrice,
      gasLimit: networkConfig.gasLimit
    });
    
    // Wait for deployment
    console.log(`⏳ Waiting for deployment transaction: ${contract.deploymentTransaction().hash}`);
    await contract.waitForDeployment();
    
    // Wait for confirmations
    const receipt = await contract.deploymentTransaction().wait(networkConfig.confirmations);
    
    const contractAddress = await contract.getAddress();
    console.log(`✅ ${contractName} deployed to: ${contractAddress}`);
    console.log(`📊 Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`🔗 Block number: ${receipt.blockNumber}`);
    
    return {
      contract,
      address: contractAddress,
      deploymentHash: contract.deploymentTransaction().hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
    
  } catch (error) {
    console.error(`❌ Failed to deploy ${contractName}:`, error.message);
    throw error;
  }
}

/**
 * Verify contract deployment
 */
async function verifyDeployment(contractAddress, contractName) {
  try {
    console.log(`🔍 Verifying ${contractName} at ${contractAddress}...`);
    
    // Check if contract exists
    const code = await ethers.provider.getCode(contractAddress);
    if (code === "0x") {
      throw new Error("No contract code found at address");
    }
    
    // Try to interact with contract
    const contract = await ethers.getContractAt(contractName, contractAddress);
    
    // Basic functionality test based on contract type
    if (contractName === "IdentityRegistry") {
      // Test registry functionality
      const isRegistry = await contract.isContract ? await contract.isContract() : true;
      console.log(`✅ ${contractName} verification passed`);
    } else {
      console.log(`✅ ${contractName} verification passed`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Verification failed for ${contractName}:`, error.message);
    return false;
  }
}

/**
 * Save deployment information
 */
async function saveDeploymentInfo(deployments, networkName) {
  const deploymentInfo = {
    network: networkName,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    timestamp: new Date().toISOString(),
    deployer: deployments[0]?.deployer || "unknown",
    contracts: {}
  };
  
  // Add contract information
  for (const [contractName, deployment] of Object.entries(deployments)) {
    if (deployment.address) {
      deploymentInfo.contracts[contractName] = {
        address: deployment.address,
        deploymentHash: deployment.deploymentHash,
        blockNumber: deployment.blockNumber,
        gasUsed: deployment.gasUsed,
        verified: deployment.verified || false
      };
    }
  }
  
  // Save to file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const filename = `${networkName}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Deployment info saved to: ${filename}`);
  
  // Also save as latest
  const latestFilepath = path.join(deploymentsDir, `${networkName}-latest.json`);
  fs.writeFileSync(latestFilepath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Latest deployment info saved to: ${networkName}-latest.json`);
  
  return deploymentInfo;
}

/**
 * Update environment configuration
 */
async function updateEnvConfig(deployments, networkName) {
  try {
    const envConfigPath = path.join(__dirname, "../.env.local");
    let envContent = "";
    
    // Read existing env file if it exists
    if (fs.existsSync(envConfigPath)) {
      envContent = fs.readFileSync(envConfigPath, "utf8");
    }
    
    // Update contract addresses
    const contractAddresses = Object.entries(deployments)
      .filter(([_, deployment]) => deployment.address)
      .map(([contractName, deployment]) => 
        `NEXT_PUBLIC_${contractName.toUpperCase()}_ADDRESS=${deployment.address}`
      )
      .join("\n");
    
    // Add network configuration
    const networkConfig = `
# Smart Contract Addresses (${networkName})
${contractAddresses}
NEXT_PUBLIC_NETWORK_NAME=${networkName}
NEXT_PUBLIC_CHAIN_ID=${(await ethers.provider.getNetwork()).chainId}
`;
    
    // Append or update env file
    envContent += networkConfig;
    fs.writeFileSync(envConfigPath, envContent);
    
    console.log(`📝 Environment configuration updated`);
  } catch (error) {
    console.error(`⚠️  Failed to update environment config:`, error.message);
  }
}

// ============================================================================
// MAIN DEPLOYMENT FUNCTION
// ============================================================================

async function main() {
  console.log("🚀 Starting Smart Tourist Safety System deployment...");
  console.log(`📡 Network: ${network.name}`);
  console.log(`⛽ Gas Price: ${DEPLOYMENT_CONFIG.networks[network.name]?.gasPrice || "default"}`);
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deploying with account: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} ETH`);
  
  if (balance < ethers.parseEther("0.1")) {
    console.warn("⚠️  Low balance! Make sure you have enough ETH for deployment");
  }
  
  const deployments = {};
  
  try {
    // Deploy contracts in order
    for (const contractName of DEPLOYMENT_CONFIG.deploymentOrder) {
      console.log(`\n${"=".repeat(50)}`);
      
      // Prepare constructor arguments
      let constructorArgs = [...DEPLOYMENT_CONFIG.constructorParams[contractName]];
      
      // Add registry address for dependent contracts
      if (contractName !== "IdentityRegistry" && deployments.IdentityRegistry) {
        constructorArgs = [deployments.IdentityRegistry.address, ...constructorArgs];
      }
      
      // Deploy contract
      const deployment = await deployContract(contractName, constructorArgs, deployer);
      deployment.deployer = deployer.address;
      
      // Verify deployment
      const verified = await verifyDeployment(deployment.address, contractName);
      deployment.verified = verified;
      
      deployments[contractName] = deployment;
      
      // Small delay between deployments
      console.log("⏸️  Waiting 2 seconds before next deployment...");
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log(`\n${"=".repeat(50)}`);
    console.log("🎉 All contracts deployed successfully!");
    
    // Save deployment information
    console.log("\n📄 Saving deployment information...");
    const deploymentInfo = await saveDeploymentInfo(deployments, network.name);
    
    // Update environment configuration
    console.log("\n📝 Updating environment configuration...");
    await updateEnvConfig(deployments, network.name);
    
    // Summary
    console.log(`\n${"=".repeat(50)}`);
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log(`${"=".repeat(50)}`);
    console.log(`Network: ${network.name}`);
    console.log(`Chain ID: ${deploymentInfo.chainId}`);
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Timestamp: ${deploymentInfo.timestamp}`);
    console.log("");
    
    for (const [contractName, deployment] of Object.entries(deployments)) {
      console.log(`${contractName}:`);
      console.log(`  Address: ${deployment.address}`);
      console.log(`  Gas Used: ${deployment.gasUsed}`);
      console.log(`  Verified: ${deployment.verified ? "✅" : "❌"}`);
      console.log("");
    }
    
    // Next steps
    console.log("🎯 NEXT STEPS:");
    console.log("1. Run verification script to verify contracts on block explorer");
    console.log("2. Update frontend configuration with new contract addresses");
    console.log("3. Test contract functionality");
    console.log("4. Set up monitoring and alerts");
    
  } catch (error) {
    console.error("\n❌ Deployment failed:", error.message);
    
    // Cleanup on failure
    console.log("\n🧹 Cleaning up failed deployment...");
    
    // Save partial deployment info for debugging
    if (Object.keys(deployments).length > 0) {
      await saveDeploymentInfo(deployments, `${network.name}-failed`);
    }
    
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

// Run deployment if script is executed directly
if (require.main === module) {
  main()
    .then(() => {
      console.log("\n✅ Deployment completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = {
  deployContract,
  verifyDeployment,
  saveDeploymentInfo,
  main
};