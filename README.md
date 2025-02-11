# Kanban Board Application
![Kanban_board_task_management_interface](https://github.com/user-attachments/assets/fff9c5ec-8fa9-4fa1-81e3-e7400b4ff364)

A full-stack Kanban board application built with React, TypeScript, and Express. Features include user authentication, ticket management, and real-time updates.

## Features

- User Authentication (JWT)
- Create, Read, Update, Delete tickets
- Drag-and-drop ticket management
- Sort tickets by name or date
- Search functionality
- Responsive design

### Authentication Flow
![Login_screen_with_username_input](https://github.com/user-attachments/assets/2b074f9a-c795-410d-aa01-92ec72166752)

- User enters credentials in Login.tsx
- authAPI.tsx makes login request
- On success, token stored via auth.ts
- useAuth.ts hook manages navigation
- ProtectedRoute.tsx enforces authentication
  
![Kanban_board_with_tasks_1](https://github.com/user-attachments/assets/4e9ac8a1-b746-4248-bb4e-713063e74465)
![Ticket_creation_form_interface](https://github.com/user-attachments/assets/9f7e58b4-d7a3-4d3a-a0a3-a3143b325f76)
![Kanban_board_with_tasks](https://github.com/user-attachments/assets/753a1714-160c-443c-bc1f-5d7392b2a265)
![Edit_ticket_form_interface](https://github.com/user-attachments/assets/6a0934ad-a4e2-47f8-87d6-383a08b5a872)

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
