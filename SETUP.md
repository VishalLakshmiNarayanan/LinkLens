# LinkLens Setup Guide

This guide will help you set up authentication and database for LinkLens.

## Prerequisites

- Node.js 18+ installed
- A Google Cloud account (for OAuth)
- A Supabase account (for database) - *optional for demo mode*

## Quick Start (Demo Mode)

The app works without any configuration for testing:

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to see the app. In demo mode:
- Chat messages are stored in browser localStorage
- Authentication is required but won't work until Google OAuth is configured

## Full Setup

### 1. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Select **Web application**
6. Add authorized origins:
   - `http://localhost:3000`
   - `http://localhost:3001` (backup port)
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3001/api/auth/callback/google`
8. Copy your **Client ID** and **Client Secret**

### 2. Supabase Configuration (Optional)

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Settings > API** and copy:
   - Project URL
   - anon/public key

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_SECRET=generate_a_random_32_char_string
NEXTAUTH_URL=http://localhost:3000

# Supabase (optional - app works without this)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Generate a NextAuth secret:
```bash
openssl rand -base64 32
```

### 4. Run the App

```bash
npm run dev
```

Visit http://localhost:3000

## Features

- **Home Page** (`/`) - Landing page with event link analyzer demo
- **Login** (`/login`) - Google OAuth sign-in
- **Chat** (`/chat`) - Protected chat interface with event link detection

## Architecture

```
app/
├── api/auth/[...nextauth]/  # NextAuth API routes
├── chat/                     # Chat page (protected)
├── login/                    # Login page
├── components/
│   ├── AuthProvider.tsx      # Session provider
│   ├── ChatInterface.tsx     # Main chat container
│   ├── ChatMessage.tsx       # Message with event detection
│   ├── ChatInput.tsx         # Message input
│   ├── EventPreviewCard.tsx  # Event preview display
│   └── EventLinkInput.tsx    # Event URL input
lib/
├── supabase.ts              # Database client & helpers
└── event/                   # Event parsing logic
```

