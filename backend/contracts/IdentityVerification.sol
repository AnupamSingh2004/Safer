// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title IdentityVerification - SIH 2025 Demo
 * @dev Smart contract for validating tourist digital identities
 * @notice [32mBLOCKCHAIN VERIFIED[0m - All verification actions are cryptographically logged
 */
contract IdentityVerification is AccessControl, ReentrancyGuard, Pausable {
	bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
	bytes32 public constant POLICE_ROLE = keccak256("POLICE_ROLE");
	bytes32 public constant TOURISM_ROLE = keccak256("TOURISM_ROLE");

	struct VerificationRecord {
		uint256 verificationId;
		address touristWallet;
		string touristIdHash;
		string verificationType; // "kyc", "biometric", "document", "manual"
		string detailsHash; // IPFS hash of verification details
		uint256 timestamp;
		address verifiedBy;
		bool isValid;
	}

	uint256 public totalVerifications;
	mapping(uint256 => VerificationRecord) public verifications;
	mapping(address => uint256[]) public walletToVerifications;
	mapping(string => uint256[]) public touristIdToVerifications;

	event IdentityVerified(
		uint256 indexed verificationId,
		address indexed touristWallet,
		string touristIdHash,
		string verificationType,
		uint256 timestamp,
		address verifiedBy,
		bool isValid
	);

	modifier onlyVerifier() {
		require(
			hasRole(VERIFIER_ROLE, msg.sender) ||
			hasRole(POLICE_ROLE, msg.sender) ||
			hasRole(TOURISM_ROLE, msg.sender),
			"IdentityVerification: Unauthorized"
		);
		_;
	}

	modifier verificationExists(uint256 _verificationId) {
		require(verifications[_verificationId].verificationId != 0, "IdentityVerification: Verification does not exist");
		_;
	}

	constructor() {
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(VERIFIER_ROLE, msg.sender);
		_grantRole(POLICE_ROLE, msg.sender);
		_grantRole(TOURISM_ROLE, msg.sender);
	}

	/**
	 * @dev Verify a tourist identity
	 * @param _touristWallet Tourist wallet address
	 * @param _touristIdHash Hash of tourist ID
	 * @param _verificationType Type of verification
	 * @param _detailsHash IPFS hash of verification details
	 * @param _isValid Is the identity valid
	 */
	function verifyIdentity(
		address _touristWallet,
		string memory _touristIdHash,
		string memory _verificationType,
		string memory _detailsHash,
		bool _isValid
	) external onlyVerifier whenNotPaused returns (uint256) {
		require(_touristWallet != address(0), "IdentityVerification: Invalid wallet");
		require(bytes(_touristIdHash).length > 0, "IdentityVerification: Invalid tourist ID");
		require(bytes(_verificationType).length > 0, "IdentityVerification: Verification type required");
		require(bytes(_detailsHash).length > 0, "IdentityVerification: Details required");

		totalVerifications++;
		uint256 newVerificationId = totalVerifications;

		VerificationRecord storage newRecord = verifications[newVerificationId];
		newRecord.verificationId = newVerificationId;
		newRecord.touristWallet = _touristWallet;
		newRecord.touristIdHash = _touristIdHash;
		newRecord.verificationType = _verificationType;
		newRecord.detailsHash = _detailsHash;
		newRecord.timestamp = block.timestamp;
		newRecord.verifiedBy = msg.sender;
		newRecord.isValid = _isValid;

		walletToVerifications[_touristWallet].push(newVerificationId);
		touristIdToVerifications[_touristIdHash].push(newVerificationId);

		emit IdentityVerified(
			newVerificationId,
			_touristWallet,
			_touristIdHash,
			_verificationType,
			block.timestamp,
			msg.sender,
			_isValid
		);

		return newVerificationId;
	}

	/**
	 * @dev Get verification records for a tourist wallet
	 * @param _wallet Tourist wallet address
	 */
	function getVerificationsByWallet(address _wallet) external view returns (uint256[] memory) {
		return walletToVerifications[_wallet];
	}

	/**
	 * @dev Get verification records for a tourist ID
	 * @param _touristIdHash Tourist ID hash
	 */
	function getVerificationsByTouristId(string memory _touristIdHash) external view returns (uint256[] memory) {
		return touristIdToVerifications[_touristIdHash];
	}

	/**
	 * @dev Emergency pause
	 */
	function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
		_pause();
	}

	/**
	 * @dev Unpause
	 */
	function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
		_unpause();
	}
}
