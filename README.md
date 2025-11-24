# Tem_vaga

> Agendamentos automáticos para profissionais do Brasil 🇧🇷

A modern, accessible booking and appointment automation platform for Brazilian service providers. Built with Next.js, TypeScript, and Supabase.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

---

## ✨ Features

### 🗓️ **Smart Booking System**
- Public booking pages with custom URLs (`/b/your-business`)
- Multi-step booking flow (service → date/time → confirmation)
- Real-time availability checking
- Automatic conflict detection
- Waitlist functionality

### 📅 **Google Calendar Integration**
- OAuth 2.0 authentication
- Automatic booking synchronization
- Two-way availability checking
- Prevents double-booking
- Real-time updates

### 💬 **WhatsApp Auto-Reply Bot**
- Keyword-based automatic responses
- Customizable script templates
- Webhook integration with Meta Graph API
- Client communication automation
- Testing interface

### 🎨 **Modern Design System**
- Clean, accessible interface
- WCAG AA compliant
- Mobile-first responsive design
- Consistent component library
- Professional aesthetics

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- Supabase account
- Google Cloud Platform account (for Calendar API)
- Meta Business account (for WhatsApp)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tem_vaga.git
   cd tem_vaga
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```env
   # Database
   DATABASE_URL="your-supabase-connection-string"
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

   # NextAuth
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Google Calendar
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # WhatsApp
   WHATSAPP_ACCESS_TOKEN="your-meta-access-token"
   WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
   WHATSAPP_VERIFY_TOKEN="your-verify-token"
   ```

4. **Run database migrations**
   ```bash
   # In Supabase SQL Editor, run:
   # 1. prisma/init_schema.sql
   # 2. prisma/add_google_calendar_columns.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
tem_vaga/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── app/               # Protected dashboard pages
│   │   │   ├── agenda/        # Bookings dashboard
│   │   │   ├── atendimento/   # WhatsApp bot config
│   │   │   └── configuracoes/ # Settings
│   │   ├── b/[slug]/          # Public booking pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication & OAuth
│   │   │   ├── bookings/      # Booking management
│   │   │   ├── availability/  # Slot calculation
│   │   │   └── webhooks/      # WhatsApp webhook
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── lib/                   # Utilities and configs
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── supabase.ts       # Supabase client
│   │   ├── supabase-admin.ts # Supabase admin client
│   │   └── whatsapp.ts       # WhatsApp API wrapper
│   └── components/            # Reusable components
├── prisma/                    # Database schema and migrations
│   ├── schema.prisma
│   ├── init_schema.sql
│   └── add_google_calendar_columns.sql
├── docs/                      # Documentation
│   └── DESIGN_SYSTEM.md      # Design system guide
├── public/                    # Static assets
├── tailwind.config.ts        # Tailwind CSS configuration
├── CHANGELOG.md              # Version history
└── README.md                 # This file
```

---

## 🎨 Design System

See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for complete design guidelines.

### Quick Reference

**Colors:**
- Primary: `#58A6FF` (Blue)
- Accent: `#7CFAC2` (Mint Green)
- Neutral: Gray scale

**Typography:**
- Headings: Bold, 2xl-6xl
- Body: Regular, base-lg
- Labels: Semibold, sm

**Components:**
- Buttons: `rounded-xl`, `px-6 py-3`
- Cards: `rounded-2xl`, `border-2`
- Inputs: `rounded-xl`, `px-4 py-3`

---

## 🔧 Configuration

### Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials (Web application)
6. Add redirect URI: `http://localhost:3000/api/auth/google/callback`
7. Copy Client ID and Secret to `.env`

### WhatsApp Setup

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a Business App
3. Add WhatsApp product
4. Get your Phone Number ID and Access Token
5. Set up webhook URL (use ngrok for local development)
6. Add credentials to `.env`

---

## 📚 API Documentation

### Booking Creation

```typescript
POST /api/bookings/create
Content-Type: application/json

{
  "businessId": "uuid",
  "servicoId": "uuid",
  "dataHora": "2024-11-25T10:00:00.000Z",
  "clienteNome": "Maria Silva",
  "clienteWhats": "11999999999",
  "joinWaitlist": false
}
```

### Availability Check

```typescript
GET /api/availability?businessId=uuid&date=2024-11-25&duration=30

Response:
{
  "slots": ["09:00", "09:30", "10:00", ...]
}
```

### WhatsApp Webhook

```typescript
GET /api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=token&hub.challenge=challenge

POST /api/webhooks/whatsapp
Content-Type: application/json

{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "5511999999999",
          "text": { "body": "agendar" }
        }]
      }
    }]
  }]
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration
- [ ] User login
- [ ] Google Calendar connection
- [ ] Create booking (public page)
- [ ] Verify Google Calendar sync
- [ ] Check availability API
- [ ] WhatsApp bot responses
- [ ] Dashboard booking list
- [ ] Settings page

### Test Data

```sql
-- Run in Supabase SQL Editor
-- See prisma/insert_test_data.sql
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL="production-connection-string"
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
# ... other vars
```

### Post-Deployment

1. Update Google OAuth redirect URI to production URL
2. Update WhatsApp webhook URL
3. Test all integrations
4. Monitor error logs

---

## 🔒 Security

### Current Status (v1.0.0)

⚠️ **For Development Only**

- Passwords stored in plain text
- No rate limiting
- No input validation
- Tokens not encrypted

### Production Checklist

- [ ] Implement bcrypt password hashing
- [ ] Add rate limiting (express-rate-limit)
- [ ] Add input validation (zod)
- [ ] Encrypt sensitive tokens
- [ ] Add CSRF protection
- [ ] Implement proper error handling
- [ ] Add security headers
- [ ] Set up monitoring

---

## 📊 Performance

- Lighthouse Score: 90+ (Performance, Accessibility, Best Practices)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Mobile-optimized

---

## 🤝 Contributing

This is a proprietary project. For internal contributors:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request
5. Wait for code review

### Code Style

- Use TypeScript
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Document complex logic

---

## 📝 License

Proprietary - All rights reserved

---

## 🆘 Support

For issues or questions:
- Check [CHANGELOG.md](CHANGELOG.md) for recent changes
- Review [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for design guidelines
- Contact the development team

---

## 🗺️ Roadmap

### v1.1.0 (Next Release)
- Booking cancellation/rescheduling
- Email notifications
- Service management UI
- Password hashing

### v1.2.0
- Analytics dashboard
- Payment integration
- Calendar view
- SMS notifications

### v2.0.0
- Mobile app
- Team management
- Advanced reporting
- API for integrations

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Tailwind CSS for the styling system
- Meta for WhatsApp Business API
- Google for Calendar API

---

**Made with ❤️ for Brazilian service providers**
