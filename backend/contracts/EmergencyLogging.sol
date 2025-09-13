// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EmergencyLogging - SIH 2025 Demo
 * @dev Immutable emergency incident logging for tourists
 * @notice [32mBLOCKCHAIN VERIFIED[0m - All emergency logs are tamper-proof and auditable
 */
contract EmergencyLogging is AccessControl, ReentrancyGuard, Pausable {
	bytes32 public constant EMERGENCY_LOGGER_ROLE = keccak256("EMERGENCY_LOGGER_ROLE");
	bytes32 public constant POLICE_ROLE = keccak256("POLICE_ROLE");
	bytes32 public constant TOURISM_ROLE = keccak256("TOURISM_ROLE");

	struct EmergencyRecord {
		uint256 recordId;
		address touristWallet;
		string touristIdHash;
		string incidentType; // "panic", "missing", "distress", "medical", "crime"
		string location; // Geohash or coordinates
		string detailsHash; // IPFS hash of encrypted details
		uint256 timestamp;
		address reportedBy;
		bool resolved;
		uint256 resolvedTimestamp;
		address resolvedBy;
	}

	uint256 public totalRecords;
	mapping(uint256 => EmergencyRecord) public records;
	mapping(address => uint256[]) public walletToRecords;
	mapping(string => uint256[]) public touristIdToRecords;

	event EmergencyReported(
		uint256 indexed recordId,
		address indexed touristWallet,
		string touristIdHash,
		string incidentType,
		string location,
		uint256 timestamp,
		address reportedBy
	);

	event EmergencyResolved(
		uint256 indexed recordId,
		address indexed resolvedBy,
		uint256 resolvedTimestamp
	);

	modifier onlyLogger() {
		require(
			hasRole(EMERGENCY_LOGGER_ROLE, msg.sender) ||
			hasRole(POLICE_ROLE, msg.sender) ||
			hasRole(TOURISM_ROLE, msg.sender),
			"EmergencyLogging: Unauthorized"
		);
		_;
	}

	modifier recordExists(uint256 _recordId) {
		require(records[_recordId].recordId != 0, "EmergencyLogging: Record does not exist");
		_;
	}

	constructor() {
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(EMERGENCY_LOGGER_ROLE, msg.sender);
		_grantRole(POLICE_ROLE, msg.sender);
		_grantRole(TOURISM_ROLE, msg.sender);
	}

	/**
	 * @dev Report a new emergency incident
	 * @param _touristWallet Tourist wallet address
	 * @param _touristIdHash Hash of tourist ID
	 * @param _incidentType Type of incident
	 * @param _location Location string
	 * @param _detailsHash IPFS hash of encrypted details
	 */
	function reportEmergency(
		address _touristWallet,
		string memory _touristIdHash,
		string memory _incidentType,
		string memory _location,
		string memory _detailsHash
	) external onlyLogger whenNotPaused returns (uint256) {
		require(_touristWallet != address(0), "EmergencyLogging: Invalid wallet");
		require(bytes(_touristIdHash).length > 0, "EmergencyLogging: Invalid tourist ID");
		require(bytes(_incidentType).length > 0, "EmergencyLogging: Incident type required");
		require(bytes(_location).length > 0, "EmergencyLogging: Location required");
		require(bytes(_detailsHash).length > 0, "EmergencyLogging: Details required");

		totalRecords++;
		uint256 newRecordId = totalRecords;

		EmergencyRecord storage newRecord = records[newRecordId];
		newRecord.recordId = newRecordId;
		newRecord.touristWallet = _touristWallet;
		newRecord.touristIdHash = _touristIdHash;
		newRecord.incidentType = _incidentType;
		newRecord.location = _location;
		newRecord.detailsHash = _detailsHash;
		newRecord.timestamp = block.timestamp;
		newRecord.reportedBy = msg.sender;
		newRecord.resolved = false;

		walletToRecords[_touristWallet].push(newRecordId);
		touristIdToRecords[_touristIdHash].push(newRecordId);

		emit EmergencyReported(
			newRecordId,
			_touristWallet,
			_touristIdHash,
			_incidentType,
			_location,
			block.timestamp,
			msg.sender
		);

		return newRecordId;
	}

	/**
	 * @dev Resolve an emergency incident
	 * @param _recordId Emergency record ID
	 */
	function resolveEmergency(uint256 _recordId) external recordExists(_recordId) onlyLogger whenNotPaused {
		require(!records[_recordId].resolved, "EmergencyLogging: Already resolved");

		records[_recordId].resolved = true;
		records[_recordId].resolvedTimestamp = block.timestamp;
		records[_recordId].resolvedBy = msg.sender;

		emit EmergencyResolved(_recordId, msg.sender, block.timestamp);
	}

	/**
	 * @dev Get emergency records for a tourist wallet
	 * @param _wallet Tourist wallet address
	 */
	function getRecordsByWallet(address _wallet) external view returns (uint256[] memory) {
		return walletToRecords[_wallet];
	}

	/**
	 * @dev Get emergency records for a tourist ID
	 * @param _touristIdHash Tourist ID hash
	 */
	function getRecordsByTouristId(string memory _touristIdHash) external view returns (uint256[] memory) {
		return touristIdToRecords[_touristIdHash];
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
