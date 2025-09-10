// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/ITouristIdentity.sol";

/**
 * @title IdentityRegistry
 * @dev Central registry for managing all tourist identities and verification
 * @notice Provides centralized access control and verification management
 */
contract IdentityRegistry is AccessControl, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    // Roles
    bytes32 public constant REGISTRY_ADMIN_ROLE = keccak256("REGISTRY_ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant TOURISM_ROLE = keccak256("TOURISM_ROLE");
    bytes32 public constant POLICE_ROLE = keccak256("POLICE_ROLE");
    
    // Counters
    Counters.Counter private _registrationCounter;
    Counters.Counter private _verifierCounter;
    
    // Structs
    struct RegistryRecord {
        uint256 registryId;
        address identityContract;
        uint256 identityId;
        address touristWallet;
        string touristIdHash;
        address registeredBy;
        uint256 registrationTimestamp;
        bool isActive;
        bool isVerified;
        uint256 verificationTimestamp;
        address verifiedBy;
        string status; // "active", "suspended", "revoked", "expired"
        string location; // Registration location
    }
    
    struct VerifierInfo {
        uint256 verifierId;
        address verifierAddress;
        string organization;
        string role; // "government", "police", "embassy", "tourism_board"
        string jurisdiction;
        bool isActive;
        uint256 registeredTimestamp;
        uint256 verificationsCount;
        address registeredBy;
    }
    
    struct RegistryStats {
        uint256 totalRegistrations;
        uint256 activeIdentities;
        uint256 verifiedIdentities;
        uint256 pendingVerifications;
        uint256 revokedIdentities;
        uint256 totalVerifiers;
        uint256 activeVerifiers;
    }
    
    // Mappings
    mapping(uint256 => RegistryRecord) public registryRecords;
    mapping(address => uint256) public walletToRegistry;
    mapping(string => uint256) public touristIdToRegistry;
    mapping(address => uint256) public contractToRegistry;
    mapping(uint256 => VerifierInfo) public verifiers;
    mapping(address => uint256) public verifierAddressToId;
    mapping(string => uint256[]) public locationToIdentities;
    mapping(string => uint256[]) public statusToIdentities;
    
    // Arrays for enumeration
    uint256[] public allRegistryIds;
    uint256[] public allVerifierIds;
    
    // Contract references
    mapping(address => bool) public authorizedContracts;
    
    // Events
    event IdentityRegistered(
        uint256 indexed registryId,
        address indexed identityContract,
        uint256 indexed identityId,
        address touristWallet,
        string touristIdHash,
        uint256 timestamp
    );
    
    event IdentityVerified(
        uint256 indexed registryId,
        address indexed verifier,
        uint256 timestamp
    );
    
    event IdentityStatusChanged(
        uint256 indexed registryId,
        string oldStatus,
        string newStatus,
        address changedBy,
        uint256 timestamp
    );
    
    event VerifierRegistered(
        uint256 indexed verifierId,
        address indexed verifierAddress,
        string organization,
        string role,
        uint256 timestamp
    );
    
    event VerifierStatusChanged(
        uint256 indexed verifierId,
        bool isActive,
        address changedBy,
        uint256 timestamp
    );
    
    event EmergencyAccess(
        uint256 indexed registryId,
        address indexed accessor,
        string accessType,
        string reason,
        uint256 timestamp
    );
    
    event BulkVerification(
        uint256[] registryIds,
        address indexed verifier,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyAuthorizedContract() {
        require(
            authorizedContracts[msg.sender],
            "IdentityRegistry: Not authorized contract"
        );
        _;
    }
    
    modifier registryExists(uint256 _registryId) {
        require(
            registryRecords[_registryId].registryId != 0,
            "IdentityRegistry: Registry record does not exist"
        );
        _;
    }
    
    modifier verifierExists(uint256 _verifierId) {
        require(
            verifiers[_verifierId].verifierId != 0,
            "IdentityRegistry: Verifier does not exist"
        );
        _;
    }
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRY_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);
        _grantRole(TOURISM_ROLE, msg.sender);
        _grantRole(POLICE_ROLE, msg.sender);
    }
    
    /**
     * @dev Registers a new identity in the registry
     * @param _identityContract Address of the identity contract
     * @param _identityId Identity ID from the contract
     * @param _touristWallet Tourist's wallet address
     * @param _touristIdHash Hash of tourist ID
     * @param _location Registration location
     */
    function registerIdentity(
        address _identityContract,
        uint256 _identityId,
        address _touristWallet,
        string memory _touristIdHash,
        string memory _location
    ) external onlyAuthorizedContract whenNotPaused returns (uint256) {
        require(_identityContract != address(0), "IdentityRegistry: Invalid contract address");
        require(_touristWallet != address(0), "IdentityRegistry: Invalid wallet address");
        require(bytes(_touristIdHash).length > 0, "IdentityRegistry: Invalid tourist ID hash");
        require(walletToRegistry[_touristWallet] == 0, "IdentityRegistry: Wallet already registered");
        require(touristIdToRegistry[_touristIdHash] == 0, "IdentityRegistry: Tourist ID already registered");
        
        _registrationCounter.increment();
        uint256 newRegistryId = _registrationCounter.current();
        
        RegistryRecord storage newRecord = registryRecords[newRegistryId];
        newRecord.registryId = newRegistryId;
        newRecord.identityContract = _identityContract;
        newRecord.identityId = _identityId;
        newRecord.touristWallet = _touristWallet;
        newRecord.touristIdHash = _touristIdHash;
        newRecord.registeredBy = tx.origin; // Original transaction sender
        newRecord.registrationTimestamp = block.timestamp;
        newRecord.isActive = true;
        newRecord.isVerified = false;
        newRecord.status = "active";
        newRecord.location = _location;
        
        walletToRegistry[_touristWallet] = newRegistryId;
        touristIdToRegistry[_touristIdHash] = newRegistryId;
        contractToRegistry[_identityContract] = newRegistryId;
        allRegistryIds.push(newRegistryId);
        locationToIdentities[_location].push(newRegistryId);
        statusToIdentities["active"].push(newRegistryId);
        
        emit IdentityRegistered(
            newRegistryId,
            _identityContract,
            _identityId,
            _touristWallet,
            _touristIdHash,
            block.timestamp
        );
        
        return newRegistryId;
    }
    
    /**
     * @dev Verifies an identity in the registry
     * @param _registryId Registry ID to verify
     */
    function verifyIdentity(uint256 _registryId) 
        external 
        onlyRole(VERIFIER_ROLE) 
        registryExists(_registryId) 
        whenNotPaused 
    {
        require(!registryRecords[_registryId].isVerified, "IdentityRegistry: Already verified");
        require(
            keccak256(bytes(registryRecords[_registryId].status)) == keccak256(bytes("active")),
            "IdentityRegistry: Identity not active"
        );
        
        registryRecords[_registryId].isVerified = true;
        registryRecords[_registryId].verificationTimestamp = block.timestamp;
        registryRecords[_registryId].verifiedBy = msg.sender;
        
        // Update verifier statistics
        uint256 verifierId = verifierAddressToId[msg.sender];
        if (verifierId != 0) {
            verifiers[verifierId].verificationsCount++;
        }
        
        emit IdentityVerified(_registryId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Bulk verification of multiple identities
     * @param _registryIds Array of registry IDs to verify
     */
    function bulkVerifyIdentities(uint256[] memory _registryIds) 
        external 
        onlyRole(VERIFIER_ROLE) 
        whenNotPaused 
    {
        require(_registryIds.length > 0, "IdentityRegistry: Empty array");
        require(_registryIds.length <= 100, "IdentityRegistry: Too many identities");
        
        for (uint256 i = 0; i < _registryIds.length; i++) {
            uint256 registryId = _registryIds[i];
            if (registryRecords[registryId].registryId != 0 && 
                !registryRecords[registryId].isVerified &&
                keccak256(bytes(registryRecords[registryId].status)) == keccak256(bytes("active"))) {
                
                registryRecords[registryId].isVerified = true;
                registryRecords[registryId].verificationTimestamp = block.timestamp;
                registryRecords[registryId].verifiedBy = msg.sender;
                
                emit IdentityVerified(registryId, msg.sender, block.timestamp);
            }
        }
        
        // Update verifier statistics
        uint256 verifierId = verifierAddressToId[msg.sender];
        if (verifierId != 0) {
            verifiers[verifierId].verificationsCount += _registryIds.length;
        }
        
        emit BulkVerification(_registryIds, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Changes identity status
     * @param _registryId Registry ID
     * @param _newStatus New status
     */
    function changeIdentityStatus(uint256 _registryId, string memory _newStatus) 
        external 
        onlyRole(REGISTRY_ADMIN_ROLE) 
        registryExists(_registryId) 
    {
        require(
            keccak256(bytes(_newStatus)) == keccak256(bytes("active")) ||
            keccak256(bytes(_newStatus)) == keccak256(bytes("suspended")) ||
            keccak256(bytes(_newStatus)) == keccak256(bytes("revoked")) ||
            keccak256(bytes(_newStatus)) == keccak256(bytes("expired")),
            "IdentityRegistry: Invalid status"
        );
        
        string memory oldStatus = registryRecords[_registryId].status;
        registryRecords[_registryId].status = _newStatus;
        
        if (keccak256(bytes(_newStatus)) != keccak256(bytes("active"))) {
            registryRecords[_registryId].isActive = false;
        } else {
            registryRecords[_registryId].isActive = true;
        }
        
        // Update status arrays
        statusToIdentities[_newStatus].push(_registryId);
        
        emit IdentityStatusChanged(_registryId, oldStatus, _newStatus, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Registers a new verifier
     * @param _verifierAddress Verifier's address
     * @param _organization Organization name
     * @param _role Verifier role
     * @param _jurisdiction Jurisdiction area
     */
    function registerVerifier(
        address _verifierAddress,
        string memory _organization,
        string memory _role,
        string memory _jurisdiction
    ) external onlyRole(REGISTRY_ADMIN_ROLE) returns (uint256) {
        require(_verifierAddress != address(0), "IdentityRegistry: Invalid verifier address");
        require(bytes(_organization).length > 0, "IdentityRegistry: Organization required");
        require(verifierAddressToId[_verifierAddress] == 0, "IdentityRegistry: Verifier already registered");
        
        _verifierCounter.increment();
        uint256 newVerifierId = _verifierCounter.current();
        
        VerifierInfo storage newVerifier = verifiers[newVerifierId];
        newVerifier.verifierId = newVerifierId;
        newVerifier.verifierAddress = _verifierAddress;
        newVerifier.organization = _organization;
        newVerifier.role = _role;
        newVerifier.jurisdiction = _jurisdiction;
        newVerifier.isActive = true;
        newVerifier.registeredTimestamp = block.timestamp;
        newVerifier.verificationsCount = 0;
        newVerifier.registeredBy = msg.sender;
        
        verifierAddressToId[_verifierAddress] = newVerifierId;
        allVerifierIds.push(newVerifierId);
        
        // Grant verifier role
        _grantRole(VERIFIER_ROLE, _verifierAddress);
        
        emit VerifierRegistered(newVerifierId, _verifierAddress, _organization, _role, block.timestamp);
        
        return newVerifierId;
    }
    
    /**
     * @dev Updates verifier status
     * @param _verifierId Verifier ID
     * @param _isActive New active status
     */
    function updateVerifierStatus(uint256 _verifierId, bool _isActive) 
        external 
        onlyRole(REGISTRY_ADMIN_ROLE) 
        verifierExists(_verifierId) 
    {
        verifiers[_verifierId].isActive = _isActive;
        
        if (_isActive) {
            _grantRole(VERIFIER_ROLE, verifiers[_verifierId].verifierAddress);
        } else {
            _revokeRole(VERIFIER_ROLE, verifiers[_verifierId].verifierAddress);
        }
        
        emit VerifierStatusChanged(_verifierId, _isActive, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Emergency access to registry data
     * @param _registryId Registry ID
     * @param _accessType Type of access
     * @param _reason Reason for emergency access
     */
    function emergencyAccess(
        uint256 _registryId, 
        string memory _accessType,
        string memory _reason
    ) external onlyRole(EMERGENCY_ROLE) registryExists(_registryId) returns (RegistryRecord memory) {
        require(bytes(_reason).length > 0, "IdentityRegistry: Reason required");
        
        emit EmergencyAccess(_registryId, msg.sender, _accessType, _reason, block.timestamp);
        
        return registryRecords[_registryId];
    }
    
    /**
     * @dev Gets registry statistics
     */
    function getRegistryStats() external view returns (RegistryStats memory) {
        uint256 activeCount = 0;
        uint256 verifiedCount = 0;
        uint256 pendingCount = 0;
        uint256 revokedCount = 0;
        uint256 activeVerifiers = 0;
        
        for (uint256 i = 0; i < allRegistryIds.length; i++) {
            uint256 registryId = allRegistryIds[i];
            RegistryRecord memory record = registryRecords[registryId];
            
            if (record.isActive) activeCount++;
            if (record.isVerified) verifiedCount++;
            if (!record.isVerified && record.isActive) pendingCount++;
            if (keccak256(bytes(record.status)) == keccak256(bytes("revoked"))) revokedCount++;
        }
        
        for (uint256 i = 0; i < allVerifierIds.length; i++) {
            if (verifiers[allVerifierIds[i]].isActive) activeVerifiers++;
        }
        
        return RegistryStats({
            totalRegistrations: _registrationCounter.current(),
            activeIdentities: activeCount,
            verifiedIdentities: verifiedCount,
            pendingVerifications: pendingCount,
            revokedIdentities: revokedCount,
            totalVerifiers: _verifierCounter.current(),
            activeVerifiers: activeVerifiers
        });
    }
    
    /**
     * @dev Gets identities by location
     * @param _location Location string
     */
    function getIdentitiesByLocation(string memory _location) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return locationToIdentities[_location];
    }
    
    /**
     * @dev Gets identities by status
     * @param _status Status string
     */
    function getIdentitiesByStatus(string memory _status) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return statusToIdentities[_status];
    }
    
    /**
     * @dev Authorizes a contract to register identities
     * @param _contract Contract address
     */
    function authorizeContract(address _contract) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        authorizedContracts[_contract] = true;
    }
    
    /**
     * @dev Revokes contract authorization
     * @param _contract Contract address
     */
    function revokeContractAuthorization(address _contract) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        authorizedContracts[_contract] = false;
    }
    
    /**
     * @dev Gets registry record by wallet
     * @param _wallet Wallet address
     */
    function getRegistryByWallet(address _wallet) 
        external 
        view 
        returns (RegistryRecord memory) 
    {
        uint256 registryId = walletToRegistry[_wallet];
        require(registryId != 0, "IdentityRegistry: No registry found for wallet");
        
        return registryRecords[registryId];
    }
    
    /**
     * @dev Gets registry record by tourist ID
     * @param _touristIdHash Tourist ID hash
     */
    function getRegistryByTouristId(string memory _touristIdHash) 
        external 
        view 
        returns (RegistryRecord memory) 
    {
        uint256 registryId = touristIdToRegistry[_touristIdHash];
        require(registryId != 0, "IdentityRegistry: No registry found for tourist ID");
        
        return registryRecords[registryId];
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
