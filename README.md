# Gadditrust - Seller Portal

A modern, beginner-friendly second-hand vehicle marketplace seller portal built with Next.js, Tailwind CSS, and Zustand.

## Features

✅ **User Authentication** - Secure login system
✅ **Dashboard** - Overview of your selling performance
✅ **Listings Management** - Create, edit, and manage vehicle listings
✅ **Messages** - Chat with potential buyers
✅ **Analytics** - Track your performance metrics
✅ **Settings** - Manage your profile and account
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Project Structure

```
gadditrust/
├── src/
│   ├── app/
│   │   ├── login/              # Login page
│   │   ├── dashboard/          # Dashboard layout & pages
│   │   │   ├── page.js         # Main dashboard
│   │   │   ├── listings/       # My Listings page
│   │   │   ├── messages/       # Messages page
│   │   │   ├── analytics/      # Analytics page
│   │   │   └── settings/       # Settings page
│   │   ├── layout.js           # Root layout
│   │   ├── page.js             # Home (redirect)
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Sidebar.js          # Left sidebar navigation
│   │   ├── Header.js           # Top header
│   │   └── StatsCard.js        # Reusable stats card
│   └── store/
│       └── authStore.js        # Zustand auth state management
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
└── .gitignore
```

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/monku1173/gadditrust.git
cd gadditrust
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Login Credentials (Demo)

- **Email:** demo@gadditrust.com
- **Password:** demo123

You can use any email/password combination for demo purposes.

## File Explanations for Beginners

### 📁 Folder Structure

**`src/app/`** - Contains all pages and layouts
- Each folder represents a route
- `page.js` is the main file for that route
- `layout.js` wraps multiple pages with common UI

**`src/components/`** - Reusable UI components
- Sidebar, Header, StatsCard
- Can be used in multiple pages

**`src/store/`** - State management
- `authStore.js` manages login state
- Uses Zustand library (simpler than Redux)
- Persists data in localStorage

### 🎨 Styling

We use **Tailwind CSS** for styling:
- Classes like `bg-blue-600`, `text-white`, `px-4`, `py-2`
- No need to write separate CSS files
- Highly customizable and responsive

### 🔄 State Management (Zustand)

**What is Zustand?**
- A simple state management library
- Easier to learn than Redux
- Stores data that can be accessed from any component

**Example:**
```javascript
const { isLoggedIn, login, logout } = useAuthStore()
```

### 🔐 Authentication Flow

1. User enters email/password on login page
2. Click "Login" button
3. Data saved in Zustand store
4. Redirected to dashboard
5. All pages check if user is logged in
6. If not logged in, redirect to login page

## Key Pages

### Login Page (`/login`)
- Beautiful gradient background
- Email and password inputs
- Show/hide password toggle
- Demo credentials display
- Form validation

### Dashboard (`/dashboard`)
- Welcome message
- 4 stat cards (Total Listings, Active, Views, Inquiries)
- Recent listings section
- Quick action buttons

### My Listings (`/dashboard/listings`)
- Table of all vehicles
- Edit and delete buttons
- Status badges (Active/Sold)
- View count and inquiries

### Messages (`/dashboard/messages`)
- Chat list on left
- Message window on right
- Search functionality
- Unread message count

### Analytics (`/dashboard/analytics`)
- Performance metrics
- Monthly views and inquiries
- Trending indicators

### Settings (`/dashboard/settings`)
- Edit profile information
- Save changes
- Organized form sections

## Navigation (Left Sidebar)

- 🏠 Dashboard
- 📦 My Listings
- 💬 Messages
- 📊 Analytics
- ⚙️ Settings
- 🚪 Logout

## Next Steps

1. **Backend API** - Connect to a Node.js/Express backend
2. **Database** - Add MongoDB or PostgreSQL
3. **Image Upload** - Integrate Cloudinary for vehicle photos
4. **Email Notifications** - Add email alerts
5. **Payment Integration** - Add Stripe/Razorpay
6. **Organization Panel** - Create separate admin interface
7. **Advanced Filters** - Add more search options

## Technologies Used

- **Next.js** - React framework
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Lucide React** - Icons
- **JavaScript (ES6+)** - Programming language

## Best Practices

✅ Component-based architecture
✅ Clean, readable code with comments
✅ Responsive design
✅ Local state management with Zustand
✅ Protected routes (check login status)
✅ Form validation
✅ Error handling

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [React Basics](https://react.dev)

## Troubleshooting

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Build errors?
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Styles not loading?
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## License

Private - For internal use only

## Author

Created for Gadditrust seller platform

---

**Happy Coding! 🚀**
