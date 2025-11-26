-- Migration: Hash existing plain text passwords
-- WARNING: This is a one-time migration script
-- Run this ONLY ONCE after deploying password hashing update

-- Note: Since we can't hash passwords in SQL, this script will:
-- 1. Mark all existing users as needing password reset
-- 2. In production, you should send password reset emails to all users

-- Option 1: Flag users for password reset (recommended)
-- ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "requiresPasswordReset" BOOLEAN DEFAULT false;
-- UPDATE "User" SET "requiresPasswordReset" = true;

-- Option 2: For development/testing - Delete all existing users and start fresh
-- WARNING: This will delete all user data!
-- DELETE FROM "WaitlistEntry";
-- DELETE FROM "Booking";
-- DELETE FROM "Servico";
-- DELETE FROM "HorarioAtendimento";
-- DELETE FROM "Business";
-- DELETE FROM "User";

-- For production migration, you should:
-- 1. Deploy the new code with password hashing
-- 2. Create a password reset flow
-- 3. Send password reset emails to all existing users
-- 4. Users will set new passwords which will be properly hashed

-- This comment serves as documentation for the migration process
SELECT 'Password hashing migration notes:' as info,
       'Existing users will need to reset their passwords' as action,
       'New registrations will use bcrypt hashing' as status;
