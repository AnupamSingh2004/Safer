# Google Sign-In Implementation Guide

## What Has Been Implemented

### 1. NextAuth.js Setup
- ✅ Installed NextAuth.js package
- ✅ Created authentication configuration in `/src/lib/auth.ts`
- ✅ Set up Google OAuth provider with your existing credentials
- ✅ Created NextAuth API route at `/src/app/api/auth/[...nextauth]/route.ts`
- ✅ Extended NextAuth types for custom user properties

### 2. Google Sign-In Button
- ✅ Added Google Sign-In button to login form
- ✅ Implemented `handleGoogleSignIn` function
- ✅ Added loading states and error handling
- ✅ Beautiful Google-styled button with proper icons

### 3. Backend Integration
- ✅ Created `/src/app/api/auth/google-signin/route.ts` for handling Google users
- ✅ Set up user creation/validation logic (placeholder for your database)
- ✅ JWT token generation integration

### 4. Session Management
- ✅ Created providers wrapper with SessionProvider
- ✅ Updated app layout to include authentication providers
- ✅ Integrated with existing Zustand auth store

### 5. Error Handling
- ✅ Created authentication error page (`/auth/error`)
- ✅ Created logout page (`/auth/logout`)
- ✅ Proper error messages for different scenarios

## Files Created/Modified

### New Files:
1. `/src/lib/auth.ts` - NextAuth configuration
2. `/src/types/next-auth.d.ts` - Type extensions
3. `/src/app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
4. `/src/app/api/auth/google-signin/route.ts` - Google sign-in handler
5. `/src/components/providers/providers.tsx` - Providers wrapper
6. `/src/app/auth/error/page.tsx` - Error page
7. `/src/app/auth/logout/page.tsx` - Logout page

### Modified Files:
1. `/src/components/auth/login-form.tsx` - Added Google Sign-In button
2. `/src/app/layout.tsx` - Added providers
3. `/src/lib/validations.ts` - Updated login schema
4. `package.json` - Added next-auth dependency

## How It Works

### Google Sign-In Flow:
1. User clicks "Continue with Google" button
2. NextAuth redirects to Google OAuth
3. Google handles authentication
4. User is redirected back with OAuth tokens
5. NextAuth calls your `/api/auth/google-signin` endpoint
6. Your backend validates/creates user account
7. User is signed in with proper session

### Integration with Existing Auth:
- NextAuth session works alongside your Zustand store
- Google users get basic permissions by default
- Existing email/password login still works
- Session data includes custom user properties (role, permissions, department)

## Next Steps - What You Need to Do

### 1. Database Integration
Update `/src/app/api/auth/google-signin/route.ts`:
```typescript
// Replace mock functions with your actual database queries
async function checkUserExists(email: string) {
  // Your database query to find user by email
  return await db.user.findUnique({ where: { email } });
}

async function createGoogleUser(userData) {
  // Your database query to create new user
  return await db.user.create({ data: userData });
}
```

### 2. JWT Token Generation
Replace placeholder JWT functions with your actual implementation:
```typescript
async function generateJWT(user: any) {
  // Use your existing JWT generation logic
  return yourJWTFunction(user);
}
```

### 3. Environment Variables
Your `.env` file already has the correct Google OAuth credentials:
- `GOOGLE_CLIENT_ID` - ✅ Already set
- `GOOGLE_CLIENT_SECRET` - ✅ Already set
- `NEXTAUTH_URL` - ✅ Already set
- `NEXTAUTH_SECRET` - ✅ Already set

### 4. Test the Implementation
1. Start your development server
2. Go to `/auth/login`
3. You should see the "Continue with Google" button
4. Click it to test the Google OAuth flow

### 5. Customize User Roles
You may want to modify the default role for Google users in `/src/app/api/auth/google-signin/route.ts`:
```typescript
// Currently set to 'viewer' - change as needed
role: 'viewer', // or 'operator', 'tourism_admin', etc.
```

## Security Considerations

1. **Google Domain Restriction**: Consider restricting to specific domains in Google Cloud Console
2. **User Approval**: You might want admin approval for new Google sign-ups
3. **Role Assignment**: Consider how to assign proper roles to Google users
4. **Account Linking**: Handle cases where email already exists with password

## Testing Checklist

- [ ] Google Sign-In button appears on login page
- [ ] Clicking button redirects to Google OAuth
- [ ] After Google auth, user is redirected back to your app
- [ ] New Google users are created in your database
- [ ] Existing Google users can sign in
- [ ] Error handling works for various scenarios
- [ ] Logout functionality works properly

Your Google Sign-In implementation is now complete and ready for testing!
