# DejaBooom - Surprise Trip Booking Platform

A modern, interactive travel booking platform that specializes in surprise trips. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Surprise Trip Booking**: Complete booking flow for surprise travel experiences
- **Multi-language Support**: English and Spanish translations
- **Currency Conversion**: USD and MXN support with real-time conversion
- **Dynamic Pricing**: Seasonal pricing with visual indicators
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Mode**: Theme switching capability
- **Interactive Calendar**: Date selection with dynamic pricing
- **Traveler Management**: Dynamic forms based on number of travelers
- **Payment Integration Ready**: Prepared for Stripe integration

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Internationalization**: Custom translation system

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── surprise-trip/     # Surprise trip booking flow
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── landing/           # Landing page components
│   ├── surprise-trip/     # Booking flow components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── types.ts              # TypeScript type definitions
└── lib/                  # Utility functions
```

## 🎯 Booking Flow

1. **Trip Setup**: Select trip type, departure city, and number of travelers
2. **Surprise Selection**: Choose from Canada, USA, Mexico, or Caribbean surprises
3. **Date Selection**: Interactive calendar with seasonal pricing
4. **Personalization**: Customize interests and travel preferences
5. **Payment**: Complete booking with traveler information

## 🌟 Key Components

### Landing Page
- Hero section with animated shapes
- Search form with tabbed interface (Surprise Trip / Classic Trip)
- Dynamic traveler selector
- Country and city dropdowns
- "How it works" section

### Surprise Trip Flow
- **Selection Page**: Choose surprise destination with pricing
- **Dates Page**: Calendar with seasonal pricing and duration selection
- **Personalization Page**: Customize travel preferences
- **Payment Page**: Complete booking with dynamic forms

### Features
- **Timeline Progress**: Step-by-step booking progress
- **Currency Conversion**: Real-time USD/MXN conversion
- **Seasonal Pricing**: Dynamic pricing with color-coded indicators
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dejabooom.git
cd dejabooom
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design Features

- **Modern UI**: Clean, professional design with smooth animations
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Performance**: Optimized images and lazy loading

## 🌍 Internationalization

The platform supports multiple languages:
- English (default)
- Spanish

Language switching is available in the navigation bar.

## 💰 Currency Support

- **USD**: Base currency
- **MXN**: Mexican Peso with real-time conversion (rate: 17.5)

## 📱 Responsive Design

- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with hamburger menu

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

- **Components**: Modular, reusable React components
- **Hooks**: Custom hooks for state management and utilities
- **Types**: Comprehensive TypeScript definitions
- **Styling**: Utility-first CSS with Tailwind

## 🚀 Deployment

The project is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting platform**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first styling
- Framer Motion for smooth animations
- Lucide React for beautiful icons

---

**DejaBooom** - Where surprise meets adventure! 🌟✈️