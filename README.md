# Argent - Finance Management Application

A comprehensive finance management platform for businesses and personal finance. Built with Next.js 16, Firebase, and Tailwind CSS.

## Features

### Business Account
- **Budget Management**: Monthly recurring, one-time expenses, and one-time income budgets
- **Transaction Tracking**: Record income, expenses, savings, investments, credit, and debit
- **Team Collaboration**: Invite team members with role-based access (Admin, Member, Viewer)
- **Budget Summary**: Annual overview with monthly breakdown and performance analysis
- **Feature Toggles**: Enable/disable features like budget alerts, reports, invoices, and more

### Personal Account
- **Current Account System**: Real-time balance tracking that integrates with all features
  - Income adds to current balance
  - Expenses/savings deduct from balance (cannot exceed available)
  - Borrowing (debts owed to you) adds to balance
- **Financial Goals**: Set and track savings goals with progress indicators
- **Planned Expenses**: Monthly budget items that automatically create expense transactions when completed
  - Marking complete: Creates expense transaction, deducts from balance
  - Restoring: Archives the transaction, restores balance
- **Income/Expense Tracking**: Categorized transactions with real-time filtering
- **Debts & Receivables**: Track money owed to/from others with balance integration
- **Savings Accounts**: Multiple savings accounts with targets that deduct from balance

### General
- **Custom 404 Page**: Branded error page with navigation options
- **Dark/Light/System Mode**: Theme toggle with system preference support
- **Toast Notifications**: User-friendly feedback for all actions
- **Confirm Modals**: Safe delete confirmations with custom UI
- **Real-time Updates**: All data synchronized in real-time via Firebase
- **Secure Authentication**: Firebase Auth with email/password
- **Document Upload**: Cloudinary integration for receipts and documents
- **Email Notifications**: Nodemailer for team invitations and password reset
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Email**: Nodemailer
- **File Storage**: Cloudinary
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase account
- Cloudinary account (for document uploads)
- SMTP server (for emails)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/argent.git
cd argent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Config
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=argent-documents

# SMTP Email Config
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Argent <noreply@argent.app>

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up Firebase:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication (Email/Password provider)
   - Copy your config to `.env.local`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── business/         # Business account pages
│   └── personal/          # Personal account pages
├── components/
│   └── ui/               # Reusable UI components (Button, Card, Modal, Toast, etc.)
├── context/               # React context providers (Auth, Toast, Theme)
├── lib/                   # Utility functions
│   ├── firebase.ts      # Firebase config
│   ├── cloudinary.ts    # Cloudinary config
│   ├── email.ts         # Email utilities
│   └── schemas.ts      # Zod validation schemas
└── types/                # TypeScript type definitions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run linter |
| `npm run format` | Format code |

## Firebase Security Rules

Add these rules to your Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Business data
    match /businessTransactions/{docId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'business';
    }
    
    match /businessBudgets/{docId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'business';
    }
    
    // Personal data - includes currentAccounts, personalBudgetItems, personalGoals, personalSavings, debts
    match /personalTransactions/{docId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'personal';
    }
    
    match /personalGoals/{docId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'personal';
    }
    
    match /personalBudgetItems/{docId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'personal';
    }
    
    match /personalSavings/{docId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'personal';
    }
    
    match /debts/{docId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'personal';
    }
    
    match /currentAccounts/{docId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'personal';
    }
    
    // Team management
    match /teamMembers/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/teamMembers/$(docId)).data.businessId == request.auth.uid;
    }
  }
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE for details.

## Support

- Open an issue: https://github.com/your-repo/argent/issues
- Email: support@argent.app