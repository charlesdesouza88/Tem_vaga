-- Add Google Calendar columns to Business table

ALTER TABLE "Business" 
ADD COLUMN IF NOT EXISTS "googleAccessToken" TEXT,
ADD COLUMN IF NOT EXISTS "googleRefreshToken" TEXT,
ADD COLUMN IF NOT EXISTS "googleCalendarId" TEXT DEFAULT 'primary',
ADD COLUMN IF NOT EXISTS "googleTokenExpiry" BIGINT;

-- Add googleEventId to Booking table
ALTER TABLE "Booking"
ADD COLUMN IF NOT EXISTS "googleEventId" TEXT;
