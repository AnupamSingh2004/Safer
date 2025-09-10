// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title TouristIdentity
 * @dev Smart contract for managing individual tourist digital identities
 * @notice Stores encrypted KYC data, trip information, and emergency contacts on-chain
 */
contract TouristIdentity is AccessControl, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    // Roles
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant TOURISM_ROLE = keccak256("TOURISM_ROLE");
    
    // Counter for identity IDs
    Counters.Counter private _identityIdCounter;
    
    // Structs
    struct KYCData {
        string documentType; // "passport", "aadhaar", "driving_license", "voter_id"
        string documentHash; // IPFS hash of encrypted document
        string fullNameHash; // Hash of full name for privacy
        string nationalityHash; // Hash of nationality
        uint256 verificationTimestamp;
        address verifiedBy;
        bool isVerified;
        uint256 expiryTimestamp;
    }
    
    struct TripData {
        string itineraryHash; // IPFS hash of encrypted itinerary
        uint256 startTimestamp;
        uint256 endTimestamp;
        string purpose; // "tourism", "business", "transit", "medical", "education"
        uint8 groupSize;
        string accommodationHash; // IPFS hash of accommodation details
    }
    
    struct EmergencyContact {
        string nameHash; // Hash of contact name
        string relationship;
        string phoneHash; // Hash of phone number
        string emailHash; // Hash of email
        bool isPrimary;
    }
    
    struct DigitalIdentity {
        uint256 identityId;
        address touristWallet;
        string touristIdHash; // Hash of government-issued tourist ID
        KYCData kycData;
        TripData tripData;
        EmergencyContact[] emergencyContacts;
        uint256 createdTimestamp;
        uint256 lastUpdatedTimestamp;
        bool isActive;
        bool isRevoked;
    }
    
    // Mappings
    mapping(uint256 => DigitalIdentity) public identities;
    mapping(address => uint256) public walletToIdentity;
    mapping(string => uint256) public touristIdToIdentity;
    
    // Events
    event IdentityCreated(
        uint256 indexed identityId,
        address indexed touristWallet,
        string touristIdHash,
        uint256 timestamp
    );
    
    event IdentityVerified(
        uint256 indexed identityId,
        address indexed verifier,
        uint256 timestamp
    );
    
    event IdentityUpdated(
        uint256 indexed identityId,
        address indexed updatedBy,
        uint256 timestamp
    );
    
    event IdentityRevoked(
        uint256 indexed identityId,
        address indexed revokedBy,
        string reason,
        uint256 timestamp
    );
    
    event EmergencyAccess(
        uint256 indexed identityId,
        address indexed accessor,
        string accessReason,
        uint256 timestamp
    );
    
    event TripStarted(
        uint256 indexed identityId,
        uint256 startTimestamp
    );
    
    event TripEnded(
        uint256 indexed identityId,
        uint256 endTimestamp
    );
    
    // Modifiers
    modifier onlyIdentityOwner(uint256 _identityId) {
        require(
            identities[_identityId].touristWallet == msg.sender,
            "TouristIdentity: Not identity owner"
        );
        _;
    }
    
    modifier identityExists(uint256 _identityId) {
        require(
            identities[_identityId].identityId != 0,
            "TouristIdentity: Identity does not exist"
        );
        _;
    }
    
    modifier identityActive(uint256 _identityId) {
        require(
            identities[_identityId].isActive && !identities[_identityId].isRevoked,
            "TouristIdentity: Identity not active"
        );
        _;
    }
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);
        _grantRole(TOURISM_ROLE, msg.sender);
    }
    
    /**
     * @dev Creates a new digital identity for a tourist
     * @param _touristWallet Address of the tourist's wallet
     * @param _touristIdHash Hash of government-issued tourist ID
     * @param _kycData KYC information
     * @param _tripData Trip information
     */
    function createIdentity(
        address _touristWallet,
        string memory _touristIdHash,
        KYCData memory _kycData,
        TripData memory _tripData
    ) external whenNotPaused returns (uint256) {
        require(_touristWallet != address(0), "TouristIdentity: Invalid wallet address");
        require(bytes(_touristIdHash).length > 0, "TouristIdentity: Invalid tourist ID hash");
        require(walletToIdentity[_touristWallet] == 0, "TouristIdentity: Wallet already has identity");
        require(touristIdToIdentity[_touristIdHash] == 0, "TouristIdentity: Tourist ID already exists");
        
        _identityIdCounter.increment();
        uint256 newIdentityId = _identityIdCounter.current();
        
        DigitalIdentity storage newIdentity = identities[newIdentityId];
        newIdentity.identityId = newIdentityId;
        newIdentity.touristWallet = _touristWallet;
        newIdentity.touristIdHash = _touristIdHash;
        newIdentity.kycData = _kycData;
        newIdentity.tripData = _tripData;
        newIdentity.createdTimestamp = block.timestamp;
        newIdentity.lastUpdatedTimestamp = block.timestamp;
        newIdentity.isActive = true;
        newIdentity.isRevoked = false;
        
        walletToIdentity[_touristWallet] = newIdentityId;
        touristIdToIdentity[_touristIdHash] = newIdentityId;
        
        emit IdentityCreated(newIdentityId, _touristWallet, _touristIdHash, block.timestamp);
        
        return newIdentityId;
    }
    
    /**
     * @dev Adds emergency contact to an identity
     * @param _identityId Identity ID
     * @param _contact Emergency contact information
     */
    function addEmergencyContact(
        uint256 _identityId,
        EmergencyContact memory _contact
    ) external identityExists(_identityId) onlyIdentityOwner(_identityId) {
        require(
            identities[_identityId].emergencyContacts.length < 5,
            "TouristIdentity: Maximum 5 emergency contacts allowed"
        );
        
        identities[_identityId].emergencyContacts.push(_contact);
        identities[_identityId].lastUpdatedTimestamp = block.timestamp;
        
        emit IdentityUpdated(_identityId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Verifies an identity (only verifiers can call)
     * @param _identityId Identity ID to verify
     */
    function verifyIdentity(uint256 _identityId) 
        external 
        onlyRole(VERIFIER_ROLE) 
        identityExists(_identityId) 
        whenNotPaused 
    {
        require(!identities[_identityId].kycData.isVerified, "TouristIdentity: Already verified");
        
        identities[_identityId].kycData.isVerified = true;
        identities[_identityId].kycData.verifiedBy = msg.sender;
        identities[_identityId].kycData.verificationTimestamp = block.timestamp;
        identities[_identityId].lastUpdatedTimestamp = block.timestamp;
        
        emit IdentityVerified(_identityId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Updates trip data
     * @param _identityId Identity ID
     * @param _tripData New trip data
     */
    function updateTripData(
        uint256 _identityId,
        TripData memory _tripData
    ) external identityExists(_identityId) onlyIdentityOwner(_identityId) {
        identities[_identityId].tripData = _tripData;
        identities[_identityId].lastUpdatedTimestamp = block.timestamp;
        
        emit IdentityUpdated(_identityId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Starts a trip
     * @param _identityId Identity ID
     */
    function startTrip(uint256 _identityId) 
        external 
        identityExists(_identityId) 
        identityActive(_identityId)
        onlyIdentityOwner(_identityId) 
    {
        require(
            identities[_identityId].kycData.isVerified,
            "TouristIdentity: Identity must be verified to start trip"
        );
        
        identities[_identityId].tripData.startTimestamp = block.timestamp;
        identities[_identityId].lastUpdatedTimestamp = block.timestamp;
        
        emit TripStarted(_identityId, block.timestamp);
    }
    
    /**
     * @dev Ends a trip
     * @param _identityId Identity ID
     */
    function endTrip(uint256 _identityId) 
        external 
        identityExists(_identityId) 
        onlyIdentityOwner(_identityId) 
    {
        require(
            identities[_identityId].tripData.startTimestamp > 0,
            "TouristIdentity: Trip not started"
        );
        require(
            identities[_identityId].tripData.endTimestamp == 0,
            "TouristIdentity: Trip already ended"
        );
        
        identities[_identityId].tripData.endTimestamp = block.timestamp;
        identities[_identityId].lastUpdatedTimestamp = block.timestamp;
        
        emit TripEnded(_identityId, block.timestamp);
    }
    
    /**
     * @dev Emergency access to identity data
     * @param _identityId Identity ID
     * @param _accessReason Reason for emergency access
     */
    function emergencyAccess(uint256 _identityId, string memory _accessReason) 
        external 
        onlyRole(EMERGENCY_ROLE) 
        identityExists(_identityId) 
        returns (DigitalIdentity memory) 
    {
        require(bytes(_accessReason).length > 0, "TouristIdentity: Access reason required");
        
        emit EmergencyAccess(_identityId, msg.sender, _accessReason, block.timestamp);
        
        return identities[_identityId];
    }
    
    /**
     * @dev Revokes an identity
     * @param _identityId Identity ID to revoke
     * @param _reason Reason for revocation
     */
    function revokeIdentity(uint256 _identityId, string memory _reason) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
        identityExists(_identityId) 
    {
        require(!identities[_identityId].isRevoked, "TouristIdentity: Already revoked");
        require(bytes(_reason).length > 0, "TouristIdentity: Reason required");
        
        identities[_identityId].isRevoked = true;
        identities[_identityId].isActive = false;
        identities[_identityId].lastUpdatedTimestamp = block.timestamp;
        
        emit IdentityRevoked(_identityId, msg.sender, _reason, block.timestamp);
    }
    
    /**
     * @dev Gets identity information
     * @param _identityId Identity ID
     */
    function getIdentity(uint256 _identityId) 
        external 
        view 
        identityExists(_identityId) 
        returns (DigitalIdentity memory) 
    {
        require(
            identities[_identityId].touristWallet == msg.sender ||
            hasRole(TOURISM_ROLE, msg.sender) ||
            hasRole(EMERGENCY_ROLE, msg.sender) ||
            hasRole(VERIFIER_ROLE, msg.sender),
            "TouristIdentity: Unauthorized access"
        );
        
        return identities[_identityId];
    }
    
    /**
     * @dev Gets identity by wallet address
     * @param _wallet Wallet address
     */
    function getIdentityByWallet(address _wallet) 
        external 
        view 
        returns (DigitalIdentity memory) 
    {
        uint256 identityId = walletToIdentity[_wallet];
        require(identityId != 0, "TouristIdentity: No identity found for wallet");
        
        return this.getIdentity(identityId);
    }
    
    /**
     * @dev Checks if identity is verified
     * @param _identityId Identity ID
     */
    function isIdentityVerified(uint256 _identityId) 
        external 
        view 
        identityExists(_identityId) 
        returns (bool) 
    {
        return identities[_identityId].kycData.isVerified;
    }
    
    /**
     * @dev Gets total number of identities
     */
    function getTotalIdentities() external view returns (uint256) {
        return _identityIdCounter.current();
    }
    
    /**
     * @dev Emergency pause (only admin)
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause (only admin)
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Grants verifier role
     * @param _verifier Address to grant verifier role
     */
    function grantVerifierRole(address _verifier) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        _grantRole(VERIFIER_ROLE, _verifier);
    }
    
    /**
     * @dev Grants emergency role
     * @param _emergency Address to grant emergency role
     */
    function grantEmergencyRole(address _emergency) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        _grantRole(EMERGENCY_ROLE, _emergency);
    }
    
    /**
     * @dev Grants tourism role
     * @param _tourism Address to grant tourism role
     */
    function grantTourismRole(address _tourism) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        _grantRole(TOURISM_ROLE, _tourism);
    }
}
