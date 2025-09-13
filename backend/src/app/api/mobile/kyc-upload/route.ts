import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const kycUploadSchema = z.object({
  tourist_id: z.string().min(1, 'Tourist ID is required'),
  document_type: z.enum(['passport', 'national_id', 'drivers_license', 'visa', 'student_id', 'other']),
  document_images: z.array(z.object({
    image_data: z.string().min(1, 'Image data is required'), // Base64 encoded
    image_type: z.enum(['front', 'back', 'selfie']),
    mime_type: z.string().regex(/^image\/(jpeg|jpg|png|webp)$/, 'Invalid image type')
  })).min(1, 'At least one image is required'),
  personal_info: z.object({
    full_name: z.string().min(1, 'Full name is required'),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    nationality: z.string().min(1, 'Nationality is required'),
    document_number: z.string().min(1, 'Document number is required'),
    expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid expiry date format'),
    place_of_birth: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional()
  }),
  trip_details: z.object({
    arrival_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid arrival date'),
    departure_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid departure date'),
    purpose: z.string().min(1, 'Trip purpose is required'),
    accommodation_address: z.string().optional(),
    emergency_contact: z.object({
      name: z.string().min(1, 'Emergency contact name required'),
      phone: z.string().min(1, 'Emergency contact phone required'),
      relationship: z.string().min(1, 'Relationship required')
    })
  }),
  device_info: z.object({
    device_id: z.string().min(1, 'Device ID required'),
    platform: z.enum(['android', 'ios']),
    app_version: z.string().min(1, 'App version required'),
    location: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      accuracy: z.number().optional()
    }).optional()
  })
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Mock OCR function - extracts text from base64 image
 */
function mockOCRExtraction(imageData: string, documentType: string): {
  success: boolean;
  extracted_text?: string;
  confidence_score?: number;
  error?: string;
} {
  try {
    // Simulate OCR processing time
    const confidenceScore = Math.random() * 0.3 + 0.7; // 70-100% confidence
    
    // Mock extracted text based on document type
    const mockTexts = {
      passport: "PASSPORT\nRepublic of India\nSURNAME/उपनाम\nSHARMA\nGiven Name(s)/दिया गया नाम\nRAHUL KUMAR\nDate of Birth/जन्म तिथि\n15/08/1995",
      national_id: "GOVERNMENT OF INDIA\nAadhaar\n1234 5678 9012\nRAHUL KUMAR SHARMA\nDOB: 15/08/1995\nMale",
      drivers_license: "DRIVING LICENCE\nRAHUL KUMAR SHARMA\nDL No: DL-1234567890123\nDOB: 15/08/1995\nValid Till: 15/08/2028",
      visa: "VISA\nType: TOURIST\nValid From: 01/01/2024\nValid Until: 31/12/2024\nRAHUL KUMAR SHARMA",
      student_id: "STUDENT IDENTITY CARD\nRAHUL KUMAR SHARMA\nStudent ID: STU123456\nValid Until: 31/05/2025",
      other: "IDENTITY DOCUMENT\nRAHUL KUMAR SHARMA\nID: DOC123456789\nIssued: 01/01/2024"
    };

    return {
      success: true,
      extracted_text: mockTexts[documentType as keyof typeof mockTexts] || mockTexts.other,
      confidence_score: Math.round(confidenceScore * 100) / 100
    };
  } catch (error) {
    return {
      success: false,
      error: 'OCR extraction failed'
    };
  }
}

/**
 * Validate document images using AI/ML simulation
 */
function validateDocumentImages(images: any[], documentType: string): {
  is_valid: boolean;
  validation_score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let validationScore = 1.0;

  // Check required image types
  const requiredTypes = documentType === 'passport' ? ['front', 'selfie'] : ['front', 'back', 'selfie'];
  const providedTypes = images.map(img => img.image_type);
  
  for (const requiredType of requiredTypes) {
    if (!providedTypes.includes(requiredType)) {
      issues.push(`Missing ${requiredType} image`);
      validationScore -= 0.3;
    }
  }

  // Simulate image quality checks
  for (const image of images) {
    // Mock quality checks
    const qualityScore = Math.random() * 0.3 + 0.7; // 70-100%
    if (qualityScore < 0.8) {
      issues.push(`Low quality ${image.image_type} image`);
      validationScore -= 0.1;
    }

    // Check image size (base64 length estimation)
    const imageSizeKB = (image.image_data.length * 0.75) / 1024;
    if (imageSizeKB < 50) {
      issues.push(`${image.image_type} image too small`);
      validationScore -= 0.1;
    }
    if (imageSizeKB > 5000) {
      issues.push(`${image.image_type} image too large`);
      validationScore -= 0.1;
    }
  }

  return {
    is_valid: validationScore >= 0.6 && issues.length < 3,
    validation_score: Math.max(0, Math.round(validationScore * 100) / 100),
    issues
  };
}

/**
 * Create blockchain digital identity hash
 */
function createBlockchainIdentity(personalInfo: any, tripDetails: any): {
  identity_hash: string;
  kyc_hash: string;
  trip_hash: string;
  blockchain_address: string;
} {
  // Create deterministic hashes for blockchain
  const identityString = `${personalInfo.full_name}:${personalInfo.document_number}:${personalInfo.nationality}`;
  const kycString = `${personalInfo.document_number}:${personalInfo.expiry_date}:${Date.now()}`;
  const tripString = `${tripDetails.arrival_date}:${tripDetails.departure_date}:${tripDetails.purpose}`;

  return {
    identity_hash: createHash('sha256').update(identityString).digest('hex'),
    kyc_hash: createHash('sha256').update(kycString).digest('hex'),
    trip_hash: createHash('sha256').update(tripString).digest('hex'),
    blockchain_address: `0x${createHash('sha256').update(identityString + Date.now()).digest('hex').slice(0, 40)}`
  };
}

// ============================================================================
// API ROUTES
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🔐 Processing KYC document upload...');
    
    // Parse and validate request
    const body = await request.json();
    const validatedData = kycUploadSchema.parse(body);

    const { tourist_id, document_type, document_images, personal_info, trip_details, device_info } = validatedData;

    // 1. Validate document images
    console.log('📸 Validating document images...');
    const imageValidation = validateDocumentImages(document_images, document_type);
    
    if (!imageValidation.is_valid) {
      return NextResponse.json({
        success: false,
        error: 'Document validation failed',
        details: {
          validation_score: imageValidation.validation_score,
          issues: imageValidation.issues
        }
      }, { status: 400 });
    }

    // 2. Extract text using OCR (mock implementation)
    console.log('🔍 Extracting text from documents...');
    const ocrResults = [];
    
    for (const image of document_images) {
      const ocrResult = mockOCRExtraction(image.image_data, document_type);
      ocrResults.push({
        image_type: image.image_type,
        ...ocrResult
      });
    }

    // 3. Create blockchain identity
    console.log('⛓️ Creating blockchain digital identity...');
    const blockchainIdentity = createBlockchainIdentity(personal_info, trip_details);

    // 4. Generate digital ID card data
    const digitalIdCard = {
      id: `DID-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      tourist_id,
      blockchain_address: blockchainIdentity.blockchain_address,
      identity_hash: blockchainIdentity.identity_hash,
      document_type,
      personal_info: {
        ...personal_info,
        photo_hash: createHash('sha256').update(document_images.find(img => img.image_type === 'selfie')?.image_data || '').digest('hex')
      },
      trip_details,
      verification_status: 'verified',
      issued_at: new Date().toISOString(),
      expires_at: trip_details.departure_date,
      qr_code_data: {
        tourist_id,
        identity_hash: blockchainIdentity.identity_hash,
        verification_url: `https://tourist-safety.gov.in/verify/${blockchainIdentity.identity_hash}`
      }
    };

    // 5. Store KYC audit trail
    const auditRecord = {
      id: `AUDIT-${Date.now()}`,
      tourist_id,
      action: 'kyc_upload',
      timestamp: new Date().toISOString(),
      device_info,
      validation_results: {
        image_validation: imageValidation,
        ocr_results: ocrResults,
        blockchain_identity: blockchainIdentity
      },
      status: 'completed'
    };

    // 6. Calculate initial safety score
    const initialSafetyScore = {
      score: 85, // Base score for verified KYC
      factors: {
        kyc_verified: 85,
        document_quality: Math.round(imageValidation.validation_score * 100),
        trip_planning: trip_details.accommodation_address ? 10 : 5,
        emergency_contact: 15
      },
      last_updated: new Date().toISOString()
    };

    console.log('✅ KYC upload completed successfully');

    return NextResponse.json({
      success: true,
      message: 'KYC documents uploaded and verified successfully',
      data: {
        digital_id_card: digitalIdCard,
        verification_status: 'verified',
        safety_score: initialSafetyScore,
        blockchain_identity: {
          address: blockchainIdentity.blockchain_address,
          identity_hash: blockchainIdentity.identity_hash,
          transaction_hash: `0x${createHash('sha256').update(blockchainIdentity.identity_hash + Date.now()).digest('hex')}`
        },
        next_steps: [
          'Digital ID card has been generated',
          'Blockchain identity created successfully',
          'You can now use emergency features',
          'Location tracking is now enabled'
        ]
      },
      audit_id: auditRecord.id
    });

  } catch (error) {
    console.error('❌ KYC upload error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process KYC upload'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const touristId = searchParams.get('tourist_id');

    if (!touristId) {
      return NextResponse.json({
        success: false,
        error: 'Tourist ID is required'
      }, { status: 400 });
    }

    // Mock KYC status check
    const kycStatus = {
      tourist_id: touristId,
      verification_status: 'verified',
      digital_id_exists: true,
      blockchain_verified: true,
      documents_uploaded: true,
      last_verification: new Date().toISOString(),
      expiry_date: '2024-12-31',
      verification_score: 95
    };

    return NextResponse.json({
      success: true,
      data: kycStatus
    });

  } catch (error) {
    console.error('❌ KYC status check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check KYC status'
    }, { status: 500 });
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
