# Changelog

All notable changes to the Tem_vaga project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-24

### Added

#### Features
- **Google Calendar Integration**
  - OAuth 2.0 authentication flow
  - Automatic booking synchronization to Google Calendar
  - Real-time availability checking against Google Calendar
  - Conflict prevention for double-booking
  - Token refresh mechanism for long-term access

- **WhatsApp Auto-Reply Bot**
  - Webhook handler for incoming messages
  - Keyword-based auto-reply system
  - Configurable script templates (greeting, menu, address, human handoff)
  - Configuration UI in dashboard
  - WhatsApp message testing interface

- **Smart Availability System**
  - API endpoint for calculating available time slots
  - Integration with business hours from database
  - Google Calendar busy time checking
  - Booking conflict detection
  - Real-time slot availability updates

- **Public Booking Flow**
  - Multi-step booking process (service → date/time → form → confirmation)
  - Service selection with pricing and duration
  - Date picker with next 5 days
  - Dynamic time slot loading
  - Client information form
  - Booking confirmation screen
  - Waitlist option

#### Design System
- **Complete UI Redesign**
  - Clean, accessible design system
  - Consistent color palette (Primary Blue #58A6FF, Accent Mint #7CFAC2)
  - Typography scale with proper hierarchy
  - Spacing system (4px base grid)
  - Border radius standards (xl, 2xl)
  - Shadow system for elevation
  - Component library (buttons, inputs, cards, badges)

- **Accessibility Improvements**
  - WCAG AA compliant contrast ratios
  - Visible focus states on all interactive elements
  - Larger touch targets (minimum 44x44px)
  - Semantic HTML structure
  - Clear error messaging
  - Loading states for async actions

- **Responsive Design**
  - Mobile-first approach
  - Flexible grid layouts
  - Touch-friendly interface
  - Breakpoint system (sm, md, lg, xl)

#### Pages Updated
- **Landing Page** (`/`)
  - Hero section with clear value proposition
  - Feature cards grid
  - Modern, professional layout
  - Clear CTAs

- **Login Page** (`/auth/login`)
  - Centered card layout
  - Brand logo
  - Clean form design
  - Error state handling
  - "Back to home" link

- **Dashboard/Agenda** (`/app/agenda`)
  - Personalized greeting
  - Today's bookings list
  - Empty state with helpful message
  - Booking cards with status badges
  - Action buttons (remind, cancel)

- **Settings Page** (`/app/configuracoes`)
  - Integration cards (WhatsApp, Google Calendar)
  - Status indicators
  - Clear CTAs for connections
  - WhatsApp tester component

- **Public Booking Page** (`/b/[slug]`)
  - Clean, modern booking flow
  - Progress indicator
  - Back button navigation
  - Service cards with pricing
  - Date picker with visual feedback
  - Time slot grid
  - Form with validation
  - Booking summary

#### Infrastructure
- **Database**
  - Migrated from Prisma to Supabase JavaScript client
  - Added Google Calendar columns to Business table
  - Added Google Event ID to Booking table
  - Created HorarioAtendimento table for business hours
  - Test data insertion scripts

- **API Routes**
  - `/api/auth/google/connect` - Initiate Google OAuth
  - `/api/auth/google/callback` - Handle OAuth callback
  - `/api/availability` - Get available time slots
  - `/api/bookings/create` - Create booking with Google sync
  - `/api/webhooks/whatsapp` - Handle WhatsApp messages
  - `/api/whatsapp/test` - Test WhatsApp messaging

#### Documentation
- **Design System** (`docs/DESIGN_SYSTEM.md`)
  - Complete color palette
  - Typography guidelines
  - Spacing and layout patterns
  - Component specifications
  - Accessibility standards
  - Code examples

- **Environment Variables**
  - `GOOGLE_CLIENT_ID` - Google OAuth client ID
  - `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
  - `WHATSAPP_ACCESS_TOKEN` - Meta Graph API token
  - `WHATSAPP_PHONE_NUMBER_ID` - WhatsApp Business phone number ID
  - `WHATSAPP_VERIFY_TOKEN` - Webhook verification token

### Changed

- **Tailwind Configuration**
  - Added custom color palette
  - Added custom shadow utilities
  - Added custom border radius values
  - Removed Claymorphism complex shadows (simplified for accessibility)

- **Booking Flow**
  - Replaced client-side slot generation with API call
  - Added loading states
  - Improved error handling
  - Enhanced visual feedback

- **Authentication**
  - Extended NextAuth session types
  - Added user ID to session

### Fixed

- **Public Booking Page**
  - Fixed PostgREST relation errors by fetching data separately
  - Fixed Next.js 15+ params handling (await params promise)
  - Added missing `useEffect` import
  - Fixed object mutation issues

- **Agenda Page**
  - Removed non-existent "Ver agenda completa" link

- **Landing Page**
  - Fixed "Entrar no App" button to redirect to login instead of /app

- **Google Calendar**
  - Added better error logging
  - Fixed token saving issues
  - Added refresh token handling

### Security

⚠️ **Known Security Issues (For Development Only)**
- Passwords stored in plain text (needs bcrypt for production)
- No rate limiting on API routes
- No input validation/sanitization
- OAuth tokens stored without encryption

### Technical Debt

- Password hashing needs to be implemented
- API rate limiting should be added
- Input validation library should be integrated
- Error boundaries should be added to React components
- Loading skeletons should replace spinners
- Toast notification system should replace alert()

### Testing

- Manual testing completed for:
  - User registration and login
  - Google Calendar connection
  - Booking creation with Google sync
  - Availability checking
  - Public booking flow

### Performance

- Optimized component rendering
- Reduced CSS complexity
- Simplified shadow calculations
- Improved perceived performance with loading states

---

## [0.1.0] - 2024-11-22

### Added
- Initial project scaffolding
- Next.js 15 setup with App Router
- Prisma ORM configuration
- Basic authentication with NextAuth.js
- Initial database schema
- Landing page
- Login/Register pages

---

## Upcoming Features

### Planned for v1.1.0
- [ ] Booking cancellation flow
- [ ] Booking rescheduling
- [ ] Email notifications
- [ ] Service management UI
- [ ] Business hours management UI
- [ ] Password hashing (bcrypt)
- [ ] Input validation
- [ ] Rate limiting

### Planned for v1.2.0
- [ ] Multi-business support
- [ ] Analytics dashboard
- [ ] Payment integration
- [ ] SMS notifications
- [ ] Calendar view (week/month)
- [ ] Booking reminders automation

### Planned for v2.0.0
- [ ] Mobile app (React Native)
- [ ] Team management
- [ ] Advanced reporting
- [ ] Custom branding
- [ ] API for third-party integrations
- [ ] Multi-language support

---

## Migration Guide

### From v0.1.0 to v1.0.0

1. **Update Environment Variables**
   ```bash
   # Add to .env
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

2. **Run Database Migrations**
   ```sql
   -- Run in Supabase SQL Editor
   -- See prisma/add_google_calendar_columns.sql
   ```

3. **Update Dependencies**
   ```bash
   npm install googleapis
   ```

4. **Clear Browser Cache**
   - New CSS may require cache clear for proper display

---

## Contributors

- Development Team
- Design Team
- QA Team

---

## License

Proprietary - All rights reserved
