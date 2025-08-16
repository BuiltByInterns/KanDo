<h1 align="center">KanDo Kanban Board</h1>

An open source, self-hosted management tool that can serve as an alternative to services such as Trello and Notion

# Dependencies

Here are all the dependencies used in the platform along with installation commands.

## Frontend Dependencies

```bash
# Navigate to the frontend directory
cd client

# Install all frontend dependencies
npm install 
```

This will install all dependencies as defined in the `client/package.json` file.

### Frontend Dependencies Breakdown

- **Core Nextjs:**
    - next: 15.4.1
    - react: 19.1.0
    - react-dom: 19.1.0
    - @types/node: ^20
    - @types/react: ^19
    - @types/react-dom: ^19
    
- **Firebase:**
    - firebase: ^12.0.0
    - react-firebase-hooks: ^5.1.1

- **UI Components:**
    - tailwindcss: ^4
    - @tailwindcss/postcss: ^4

## Backend Dependencies

```bash
# Navigate to the backend directory
cd server

# Install all backend dependencies
npm install 
```

This will install all dependencies as defined in the `client/package.json` file.

### Backend Dependencies Breakdown

- dotenv: ^17.2.0
- firebase: ^12.0.0

# Installation

## Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

1. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Set environment variables from firebase project

5. Run the front end in development mode:
```bash
npm run dev
```

## License

[MIT](https://choosealicense.com/licenses/mit/)