# Kanban Board Application

A full-stack Kanban board application built with React, TypeScript, and Express. Features include user authentication, ticket management, and real-time updates.

## Features

- User Authentication (JWT)
- Create, Read, Update, Delete tickets
- Drag-and-drop ticket management
- Sort tickets by name or date
- Search functionality
- Responsive design

### Authentication Flow

- User enters credentials in Login.tsx
- authAPI.tsx makes login request
- On success, token stored via auth.ts
- useAuth.ts hook manages navigation
- ProtectedRoute.tsx enforces authentication

### Session Management

- Token expiration checked every minute
- Automatic logout on token expiration
- Navigation to login on authentication failure

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- Modern CSS

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL

## Development Setup

1. Clone the repository:
\`\`\`bash
git clone https://github.com/jrakestr/kanban.git
cd kanban
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
cd client && npm install
cd ../server && npm install
\`\`\`

3. Set up environment variables:
   - Copy \`.env.EXAMPLE\` to \`.env\`
   - Update the values as needed

4. Start the development servers:
\`\`\`bash
npm run dev
\`\`\`

## Deployment

The application is configured for deployment on Render.com.

### Build Instructions

- **Server:** Navigate to the \`server\` directory and run \`npm run build\`
- **Client:** Navigate to the \`client\` directory and run \`npm run build\`

### Environment Variables

Required environment variables:
- \`NODE_ENV\`: Set to \`production\` in deployment
- \`DATABASE_URL\`: PostgreSQL connection string
- \`JWT_SECRET\`: Secret key for JWT authentication
- \`PORT\`: Application port number

**Important:** Never commit sensitive environment variables to version control.

## License

MIT