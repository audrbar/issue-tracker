# Issue Tracker Application

A full-featured issue tracking system built with Next.js 14, featuring real-time updates, role-based access control, and comprehensive issue management capabilities.

## 🚀 Features

### Core Functionality
- **Issue Management**: Create, read, update, and delete issues
- **Rich Text Editor**: Markdown support for issue descriptions with live preview
- **User Authentication**: Secure Google OAuth integration via NextAuth
- **Issue Assignment**: Assign issues to team members
- **Status Workflow**: Track issues through OPEN → IN_PROGRESS → CLOSED states
- **Priority Management**: Set issue priorities (LOW, MEDIUM, HIGH)

### Advanced Features
- **Comments System**: Markdown-supported comments with user attribution
- **Activity Timeline**: Complete audit trail of all issue changes
- **Advanced Search**: Debounced search across issue titles and descriptions
- **Smart Filtering**: Filter by status, assignee, and priority
- **Role-Based Access Control (RBAC)**: Three-tier permission system (ADMIN, USER, VIEWER)
- **Pagination**: Efficient data loading with customizable page sizes
- **Responsive Design**: Mobile-friendly interface using Radix UI

### Data Visualization
- **Dashboard Analytics**: Visual representation of issue statistics
- **Status Distribution Charts**: Interactive charts using Recharts
- **Issue Trends**: Track open vs closed issues over time

## 🛠️ Tech Stack

- **Framework**: [Next.js 14.2.23](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.7.2](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM 5.22.0](https://www.prisma.io/)
- **Authentication**: [NextAuth 4.24.13](https://next-auth.js.org/) with Google Provider
- **UI Components**: [Radix UI Themes 3.2.1](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS 3.4.18](https://tailwindcss.com/)
- **Forms**: [React Hook Form 7.69.0](https://react-hook-form.com/) + [Zod 3.25.76](https://zod.dev/)
- **State Management**: [TanStack Query 5.70.1](https://tanstack.com/query)
- **Charts**: [Recharts 2.15.0](https://recharts.org/)
- **Markdown**: [React Markdown 9.0.4](https://github.com/remarkjs/react-markdown)
- **Editor**: [SimpleMDE 1.32.1](https://simplemde.com/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **PostgreSQL** database (local or hosted)
- **Google Cloud Console** account for OAuth credentials

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd issue-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```env
   # Environment
   NODE_ENV=development

   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"

   # NextAuth Configuration
   NEXTAUTH_SECRET="your-secret-key-here"

   # Application URL (automatically switches based on environment)
   # Development: http://localhost:3000
   # Production: https://your-production-domain.com
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth Credentials
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Generate NextAuth Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

5. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret to your `.env` file

6. **Initialize the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses the following main models:

- **User**: Authentication and role management
- **Issue**: Core issue tracking with status, priority, and assignments
- **Comment**: User comments on issues with markdown support
- **ActivityLog**: Audit trail of all issue changes
- **Label**: Categorization tags for issues

## 📁 Project Structure

```
issue-tracker/
├── app/
│   ├── api/                    # API routes
│   │   ├── issues/            # Issue CRUD operations
│   │   ├── users/             # User management
│   │   └── auth/              # NextAuth configuration
│   ├── auth/                   # Authentication utilities
│   │   ├── authOptions.ts     # NextAuth config
│   │   ├── Provider.tsx       # Session provider
│   │   └── authorization.ts   # RBAC helpers
│   ├── components/             # Shared components
│   ├── issues/                 # Issue-related pages
│   │   ├── [id]/              # Issue detail pages
│   │   ├── list/              # Issue list with filters
│   │   ├── new/               # Create issue
│   │   └── _components/       # Issue components
│   ├── lib/                    # Utility functions
│   │   └── activityLogger.ts  # Activity logging
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Dashboard
│   └── validationSchemas.ts    # Zod schemas
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── client.ts               # Prisma client
├── public/                     # Static assets
└── types/                      # TypeScript declarations

```

## 🎯 Key Features in Detail

### 1. Status Workflow
Issues progress through three states:
- **OPEN**: Newly created issues
- **IN_PROGRESS**: Issues being worked on
- **CLOSED**: Completed issues

### 2. Role-Based Access Control
Three user roles with different permissions:
- **ADMIN**: Full access to all operations
- **USER**: Can create and edit own issues, comment on any issue
- **VIEWER**: Read-only access

### 3. Comments System
- Markdown support with live rendering
- User attribution with timestamps
- Real-time updates via React Query
- Cascade deletion when issue is removed

### 4. Activity Timeline
Tracks all changes including:
- Issue creation
- Status changes
- Priority updates
- Assignment changes
- Description modifications

### 5. Advanced Filtering
- **Search**: Debounced search across titles and descriptions
- **Status Filter**: Filter by issue status
- **Assignee Filter**: View issues by assignee or unassigned
- **Combined Filters**: All filters work together seamlessly

### 6. Priority Management
Three priority levels:
- 🔴 **HIGH**: Urgent issues requiring immediate attention
- 🟡 **MEDIUM**: Standard priority (default)
- 🟢 **LOW**: Non-urgent issues

## 🚦 API Endpoints

### Issues
- `GET /api/issues` - List all issues with filters
- `POST /api/issues` - Create new issue
- `GET /api/issues/[id]` - Get issue details
- `PATCH /api/issues/[id]` - Update issue
- `DELETE /api/issues/[id]` - Delete issue

### Comments
- `GET /api/issues/[id]/comments` - Get issue comments
- `POST /api/issues/[id]/comments` - Add comment

### Activities
- `GET /api/issues/[id]/activities` - Get issue activity log

### Users
- `GET /api/users` - List all users

## 🔐 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|----------|
| `NODE_ENV` | Environment mode | ✅ | `development` or `production` |
| `DATABASE_URL` | PostgreSQL connection string | ✅ | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Secret for JWT signing (32+ chars) | ✅ | Generate with crypto |
| `NEXTAUTH_URL` | Application URL (environment-specific) | ✅ | `http://localhost:3000` (dev)<br>`https://app.com` (prod) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ | From Google Cloud Console |

## 🧪 Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Prisma commands
npx prisma studio              # Open Prisma Studio
npx prisma migrate dev          # Create migration
npx prisma generate            # Generate Prisma Client
npx prisma db push             # Push schema changes
```

## 📦 Building for Production

1. **Update environment variables for production**

   Update your `.env` file or hosting platform's environment variables:
   ```env
   NODE_ENV=production
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="https://your-production-domain.com"  # ⚠️ Important: Update this!
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

   **Important**: Don't forget to update the authorized redirect URI in Google Cloud Console:
   - Add: `https://your-production-domain.com/api/auth/callback/google`

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Test the production build locally (optional)**
   ```bash
   npm start
   ```

4. **Deploy**

   The application can be deployed to:
   - **Vercel** (recommended for Next.js) - Auto-detects environment
   - **AWS** (Amplify, EC2, or ECS)
   - **Google Cloud Platform** (Cloud Run or App Engine)
   - **Railway** or **Render**
   - Any Node.js hosting platform

   **Note**: Most hosting platforms allow you to set environment variables directly in their dashboard.

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL server is running
- Check firewall settings for database port

### Authentication Errors
- Verify Google OAuth credentials
- Check redirect URIs match in Google Console
- Ensure `NEXTAUTH_SECRET` is set

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Regenerate Prisma Client: `npx prisma generate`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Radix UI](https://www.radix-ui.com/)
- [NextAuth.js](https://next-auth.js.org/)
