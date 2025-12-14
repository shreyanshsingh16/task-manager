# Task Manager App

A responsive Trello-style task management application built with React, TypeScript, and shadcn/ui components.

## Features

- **3-Column Board Layout**: To-Do, In-Progress, and Completed columns
- **Drag & Drop**: Move tasks between columns with react-beautiful-dnd
- **Task Management**: Create, edit, and delete tasks with confirmation
- **Task Properties**: Title, description, priority (Low/Medium/High), due date, and creation timestamp
- **Filtering & Sorting**: Filter by priority and status, sort by date or creation time
- **Duplicate Detection**: Automatically detects and marks duplicate tasks in the same column
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Data Persistence**: Uses localStorage to persist tasks between sessions
- **Overdue Indicators**: Visual indicators for overdue tasks

## Tech Stack

- **React 19** with TypeScript
- **shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **react-beautiful-dnd** for drag and drop functionality
- **date-fns** for date formatting
- **Lucide React** for icons

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   ├── FilterBar.tsx       # Filtering and sorting controls
│   ├── TaskCard.tsx        # Individual task card component
│   ├── TaskColumn.tsx      # Column container for tasks
│   └── TaskForm.tsx        # Modal form for creating/editing tasks
├── lib/
│   └── utils.ts           # Utility functions
├── types/
│   └── task.ts            # TypeScript type definitions
├── App.tsx                # Main application component
├── index.css              # Global styles with Tailwind
└── index.tsx              # Application entry point
public/
└── tasks.json             # Initial task data
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Usage

### Creating Tasks
1. Click the "Add Task" button in the header
2. Fill in the task details (title, description, priority, status, due date)
3. Click "Create Task" to save

### Editing Tasks
1. Click the edit icon on any task card
2. Modify the task details in the modal
3. Click "Update Task" to save changes

### Deleting Tasks
1. Click the delete icon on any task card
2. Confirm the deletion in the popup dialog

### Drag & Drop
- Simply drag any task card from one column to another
- The task status will automatically update

### Filtering & Sorting
- Use the filter bar to filter tasks by priority or status
- Sort tasks by creation date (newest/oldest first) or due date
- Click "Clear Filters" to reset all filters

## Data Management

- **Initial Data**: Loads from `public/tasks.json` on first visit
- **Persistence**: All changes are automatically saved to localStorage
- **Data Format**: Tasks are stored as JSON with the following structure:

```json
{
  "id": 101,
  "title": "Task Title",
  "description": "Task description",
  "priority": "High",
  "status": "To-Do",
  "dueDate": "2025-02-12T09:00:00Z",
  "createdAt": "2025-01-25T14:10:00Z"
}
```

## Deployment

### GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
{
  "homepage": "https://yourusername.github.io/task-manager",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `build` folder to Netlify's deploy interface, or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.