#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * Run this before deployment to ensure all required variables are set
 */

const requiredEnvVars = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL',
    example: 'https://xxxxx.supabase.co',
    public: true,
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous/public key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    public: true,
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'Supabase service role key (KEEP SECRET)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    public: false,
    secret: true,
  },
  {
    name: 'GEMINI_API_KEY',
    description: 'Google Gemini API key (KEEP SECRET)',
    example: 'AIzaSyD...',
    public: false,
    secret: true,
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    description: 'Application base URL',
    example: 'http://localhost:3000 or https://your-domain.com',
    public: true,
  },
];

function verifyEnvironment() {
  console.log('🔍 Verifying Environment Variables...\n');

  let hasErrors = false;
  let hasWarnings = false;
  const missing = [];
  const present = [];

  requiredEnvVars.forEach((envVar) => {
    const value = process.env[envVar.name];
    
    if (!value) {
      missing.push(envVar);
      hasErrors = true;
    } else {
      present.push(envVar);
      
      // Basic validation
      if (envVar.name.includes('SUPABASE_URL') && !value.includes('supabase.co')) {
        console.log(`⚠️  ${envVar.name}: Value doesn't look like a Supabase URL`);
        hasWarnings = true;
      }
      
      if (envVar.name.includes('KEY') && value.length < 20) {
        console.log(`⚠️  ${envVar.name}: Value seems too short for an API key`);
        hasWarnings = true;
      }
      
      if (envVar.name === 'NEXT_PUBLIC_APP_URL' && !value.startsWith('http')) {
        console.log(`⚠️  ${envVar.name}: Should start with http:// or https://`);
        hasWarnings = true;
      }
    }
  });

  // Report present variables
  if (present.length > 0) {
    console.log('✅ Found Variables:\n');
    present.forEach((envVar) => {
      const value = process.env[envVar.name];
      const displayValue = envVar.secret 
        ? `${value.substring(0, 10)}...` 
        : value;
      const visibility = envVar.public ? '(public)' : '(secret)';
      console.log(`   ${envVar.name} ${visibility}`);
      console.log(`   └─ ${displayValue}\n`);
    });
  }

  // Report missing variables
  if (missing.length > 0) {
    console.log('❌ Missing Variables:\n');
    missing.forEach((envVar) => {
      console.log(`   ${envVar.name}`);
      console.log(`   └─ ${envVar.description}`);
      console.log(`   └─ Example: ${envVar.example}\n`);
    });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  ✅ Present: ${present.length}/${requiredEnvVars.length}`);
  console.log(`  ❌ Missing: ${missing.length}/${requiredEnvVars.length}`);
  
  if (hasWarnings) {
    console.log(`  ⚠️  Warnings detected - please review`);
  }
  
  console.log('='.repeat(60) + '\n');

  if (hasErrors) {
    console.log('❌ Environment verification FAILED');
    console.log('\nTo fix:');
    console.log('1. Copy .env.local.example to .env.local');
    console.log('2. Fill in all required values');
    console.log('3. Run this script again\n');
    console.log('See ENVIRONMENT_VARIABLES.md for detailed instructions.\n');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('⚠️  Environment verification PASSED with warnings');
    console.log('Please review warnings above before deploying.\n');
    process.exit(0);
  } else {
    console.log('✅ Environment verification PASSED');
    console.log('All required variables are set!\n');
    process.exit(0);
  }
}

// Run verification
try {
  verifyEnvironment();
} catch (error) {
  console.error('❌ Error during verification:', error.message);
  process.exit(1);
}
