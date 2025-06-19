# 🌍 WanderLog - Travel Planner & Explorer

A modern, full-stack travel planning and journaling application built with the MERN stack. Plan your perfect trips, discover amazing destinations, and capture your travel memories with WanderLog.

![WanderLog Demo](https://via.placeholder.com/1200x400/6366f1/ffffff?text=WanderLog+-+Your+Travel+Companion)

## ✨ Features

### 🗺️ **Destination Discovery**
- Interactive destination explorer with stunning carousel
- Real-time weather information for any location
- High-quality destination photography from Unsplash
- Detailed location maps and coordinates
- Best time to visit recommendations

### 📝 **Trip Planning**
- Smart itinerary creation with AI-powered suggestions
- Collaborative planning tools
- Custom packing lists
- Budget tracking and expense management

### 📖 **Travel Journal**
- Rich media journal entries with photos and videos
- Mood tracking and location tagging
- Timeline view of your travel experiences
- Share memories with friends and family

### 🎨 **Premium UI/UX**
- Modern glassmorphism design with purple gradients
- Responsive layout for all devices
- Smooth animations and transitions
- Premium carousel with 3-card layout

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing

### External APIs
- **Unsplash API** - High-quality destination images
- **OpenWeatherMap** - Real-time weather data
- **MapBox API** - Interactive maps and geocoding

## 📦 Project Structure

```
wanderlog/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── images/     # Image gallery & sliders
│   │   │   ├── layout/     # Layout components (Navbar, etc.)
│   │   │   ├── maps/       # Map integration components
│   │   │   └── weather/    # Weather widget components
│   │   ├── pages/         # Application pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── ExplorePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── ...
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript type definitions
│   │   └── styles/        # Global styles and themes
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Express backend API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wanderlog.git
   cd wanderlog
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   Create `.env` file in the `server` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/wanderlog
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # External APIs
   UNSPLASH_ACCESS_KEY=your-unsplash-access-key
   OPENWEATHER_API_KEY=your-openweather-api-key
   MAPBOX_API_KEY=your-mapbox-api-key
   
   # Server
   PORT=5002
   NODE_ENV=development
   ```

   Create `.env` file in the `client` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5002/api
   VITE_MAPBOX_TOKEN=your-mapbox-token-here
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5002`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the dist folder
```

### Backend (Railway/Heroku)
```bash
cd server
npm run build
npm start
```

### Environment Variables for Production
Make sure to set all environment variables in your deployment platform.

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Trip Endpoints
- `GET /api/trips` - Get user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get specific trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Weather Endpoints
- `GET /api/weather/:location` - Get weather data for location

### Image Endpoints
- `GET /api/images/search/:query` - Search destination images

### Map Endpoints
- `GET /api/maps/geocode/:location` - Get coordinates for location

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#8b5cf6 to #7c3aed)
- **Secondary**: Blue gradient (#3b82f6 to #1d4ed8)
- **Accent**: Pink (#ec4899)
- **Neutral**: Gray scale (#f9fafb to #111827)

### Typography
- **Display**: Playfair Display (serif)
- **Headings**: Poppins (sans-serif)
- **Body**: Inter (sans-serif)

### Components
- **Glassmorphism Cards**: Translucent backgrounds with blur effects
- **Premium Carousel**: 3-card layout with smooth animations
- **Weather Widgets**: Real-time weather display
- **Interactive Maps**: MapBox integration with custom styling

## 🎯 Current Status

### ✅ Completed Features
- ✅ Modern UI with glassmorphism design
- ✅ User authentication system
- ✅ Destination explorer with carousel
- ✅ Real-time weather integration
- ✅ Image gallery with Unsplash API
- ✅ Interactive maps with geocoding
- ✅ Responsive design for all devices
- ✅ Premium card layouts with proper spacing
- ✅ Smooth carousel animations without gaps

### 🚧 In Development
- Trip management system
- Journal entry creation
- User dashboard with statistics
- Advanced search functionality

### 📋 Planned Features
- Social sharing capabilities
- Offline mode support
- Mobile app (React Native)
- AI-powered trip recommendations

## 🔧 Development

### Available Scripts

**Root directory:**
- `npm run dev` - Start both client and server
- `npm run server` - Start backend server only
- `npm run client` - Start frontend client only
- `npm run build` - Build client for production
- `npm run install:all` - Install all dependencies

**Server directory:**
- `npm run dev` - Start server with nodemon
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm test` - Run tests

**Client directory:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code style and conventions
- Write unit tests for new features
- Update documentation as needed
- Test on multiple screen sizes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash** for beautiful destination photography
- **OpenWeatherMap** for reliable weather data
- **MapBox** for interactive mapping services
- **React & Node.js communities** for amazing tools and libraries

## 📞 Support & Contact

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/wanderlog/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/wanderlog/discussions)
- 📧 **Email**: support@wanderlog.com

## 🔗 Links

- [Live Demo](https://wanderlog-demo.vercel.app)
- [API Documentation](https://documenter.getpostman.com/view/wanderlog-api)
- [Design System](https://www.figma.com/wanderlog-design-system)

---

<div align="center">
  <p>Made with ❤️ and ☕ by the WanderLog Team</p>
  <p>
    <a href="#-wanderlog---travel-planner--explorer">⬆️ Back to Top</a>
  </p>
</div>