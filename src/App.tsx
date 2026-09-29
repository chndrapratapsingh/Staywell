/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  MapPin, 
  Phone, 
  Plus, 
  DollarSign, 
  Search, 
  Image as ImageIcon, 
  FileText, 
  LogOut, 
  LayoutDashboard, 
  ChevronRight, 
  Home, 
  Info,
  Layers,
  Sparkles,
  Map as MapIcon,
  PhoneCall,
  CheckCircle2,
  Trash2,
  Lock,
  Filter,
  SlidersHorizontal,
  PlusCircle,
  Eye
} from 'lucide-react';

// Import local image assets from src/ directory for Vite bundling optimization
import img1 from './1.jpg';
import img2 from './2.jpg';
import img3 from './3.jpg';
import img3Png from './3.png';
import img4 from './4.jpg';
import img5 from './5.jpg';
import img6 from './6.jpg';
import img7 from './7.jpg';
import img8 from './8.jpg';

// Interfaces
interface RoomListing {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  photoUrl: string;
  landlordName: string;
  landlordPhone: string;
  createdAt: string;
  coordinates: { x: number; y: number }; // Simulated map coordinates (0-100% of container)
}

interface StudentUser {
  name: string;
  location: string;
  phone: string;
}

interface LandlordUser {
  name: string;
  phone: string;
  agencyName?: string;
}

// Initial mockup listings for student dashboard
const INITIAL_LISTINGS: RoomListing[] = [
  {
    id: 'listing-1',
    title: 'Cozy Sunny Studio near University Campus',
    location: 'Civil Lines, Jabalpur',
    price: 2450,
    description: 'A beautiful sunny private room with a study desk, high-speed Wi-Fi, and utilities included. Just a 5-minute walk to the main campus gates. Accessible kitchen and shared laundry facilities.',
    photoUrl: img1,
    landlordName: 'Marcus Aurelius',
    landlordPhone: '+1 (555) 321-4567',
    createdAt: '2026-09-28',
    coordinates: { x: 35, y: 42 }
  },
  {
    id: 'listing-2',
    title: 'Modern Master Room with Private Balcony',
    location: 'Vijay Nagar, Jabalpur',
    price: 2950,
    description: 'Premium master bedroom with ensuite private bathroom and custom balcony. Perfect for students who want a premium, quiet workspace. High floor with spectacular city sunset views.',
    photoUrl: img2,
    landlordName: 'Elena Rostova',
    landlordPhone: '+1 (555) 789-1024',
    createdAt: '2026-09-27',
    coordinates: { x: 65, y: 30 }
  },
  {
    id: 'listing-3',
    title: 'Minimalist Student Pod near Subway Station',
    location: 'Wright Town, Jabalpur',
    price: 2100,
    description: 'Fully furnished minimalist room featuring optimal storage spaces, smart desk, and climate control. Shared with 3 other respectful student tenants. Weekly cleaning service for public spaces is free!',
    photoUrl: img3,
    landlordName: 'David Chen',
    landlordPhone: '+1 (555) 456-7890',
    createdAt: '2026-09-26',
    coordinates: { x: 20, y: 58 }
  },
  {
    id: 'listing-4',
    title: 'Lakeside Shared Dorm Suite with Great Amenities',
    location: 'Adhartal, Jabalpur',
    price: 2600,
    description: 'Stunning room with immediate lakeside park access. Shared modern kitchen with dishwasher and a spacious student living area. Bike parking included in the gated building.',
    photoUrl: img4,
    landlordName: 'Marcus Aurelius',
    landlordPhone: '+1 (555) 321-4567',
    createdAt: '2026-09-25',
    coordinates: { x: 80, y: 75 }
  },
  {
    id: 'listing-5',
    title: 'Peaceful Attic Bedroom in Quiet Safe Suburb',
    location: 'Gorakhpur, Jabalpur',
    price: 2200,
    description: 'Extremely spacious and serene top-floor attic room with views of the hills. Includes private desk, small sofa, and shared bathroom. Perfect for focused studying and absolute privacy.',
    photoUrl: img5,
    landlordName: 'Sarah Jenkins',
    landlordPhone: '+1 (555) 901-2345',
    createdAt: '2026-09-24',
    coordinates: { x: 48, y: 15 }
  },
  {
    id: 'listing-6',
    title: 'Spacious Semi-Furnished Room in Ranji',
    location: 'Ranji, Jabalpur',
    price: 2300,
    description: 'Comfortable and airy room in a friendly Ranji student community. Features a spacious wardrobe, study table, and common dining. Safe environment for young academics.',
    photoUrl: img6,
    landlordName: 'Rajesh Sharma',
    landlordPhone: '+91 98260 12345',
    createdAt: '2026-09-29',
    coordinates: { x: 25, y: 35 }
  },
  {
    id: 'listing-7',
    title: 'Charming Student Flatlet near Gokalpur Lake',
    location: 'Gokalpur, Jabalpur',
    price: 2800,
    description: 'Charming flatlet with gorgeous morning light and excellent ventilation. Walking distance to shops and public transport. Includes high-speed fiber internet and power backup.',
    photoUrl: img7,
    landlordName: 'Anil Verma',
    landlordPhone: '+91 94251 67890',
    createdAt: '2026-09-29',
    coordinates: { x: 75, y: 55 }
  }
];

export default function App() {
  // Navigation / screen routing state: 
  // 'home' | 'register-landlord' | 'register-student' | 'landlord-dashboard' | 'student-dashboard'
  const [screen, setScreen] = useState<string>('home');
  
  // Custom State stored in localStorage with automatic price-healing to 2000-3000 INR range and Jabalpur geolocation transition
  const [listings, setListings] = useState<RoomListing[]>(() => {
    const saved = localStorage.getItem('renter_listings');
    let loaded: RoomListing[] = saved ? JSON.parse(saved) : INITIAL_LISTINGS;
    
    // Self-healing check: Upgrade prices and location text to Jabalpur instantly
    let modified = false;
    loaded = loaded.map(item => {
      let updated = { ...item };
      
      // Currency bound upgrades
      if (updated.price < 2000) {
        modified = true;
        let newIPrice = 2400;
        if (updated.price <= 300) newIPrice = 2200;
        else if (updated.price <= 400) newIPrice = 2500;
        else if (updated.price <= 500) newIPrice = 2750;
        else newIPrice = 2950;
        updated.price = newIPrice;
      }
      
      // Location updates
      if (updated.location === 'University Heights' || updated.location === 'Downtown Core' || updated.location === 'Westside Campus District' || updated.location === 'Lakeside District' || updated.location === 'Northside Hills') {
        modified = true;
        if (updated.location === 'University Heights') updated.location = 'Civil Lines, Jabalpur';
        else if (updated.location === 'Downtown Core') updated.location = 'Vijay Nagar, Jabalpur';
        else if (updated.location === 'Westside Campus District') updated.location = 'Wright Town, Jabalpur';
        else if (updated.location === 'Lakeside District') updated.location = 'Adhartal, Jabalpur';
        else updated.location = 'Gorakhpur, Jabalpur';
      }

      // Real user-image photo migration for premium realism
      if (updated.photoUrl.includes('unsplash.com') || updated.photoUrl.startsWith('http') || updated.photoUrl.startsWith('/')) {
        modified = true;
        if (updated.id === 'listing-1') updated.photoUrl = img1;
        else if (updated.id === 'listing-2') updated.photoUrl = img2;
        else if (updated.id === 'listing-3') updated.photoUrl = img3;
        else if (updated.id === 'listing-4') updated.photoUrl = img4;
        else if (updated.id === 'listing-5') updated.photoUrl = img5;
        else if (updated.id === 'listing-6') updated.photoUrl = img6;
        else if (updated.id === 'listing-7') updated.photoUrl = img7;
        else updated.photoUrl = img8;
      }
      
      return updated;
    });

    if (modified) {
      localStorage.setItem('renter_listings', JSON.stringify(loaded));
    }

    // Ultimate persistent database fallback: Ensure all 7 Jabalpur listings are strictly preserved in local storage
    let updatedNeeded = false;
    for (let i = 1; i <= 7; i++) {
      const targetId = `listing-${i}`;
      if (!loaded.some(item => item.id === targetId)) {
        const original = INITIAL_LISTINGS.find(x => x.id === targetId);
        if (original) {
          loaded.push(original);
          updatedNeeded = true;
        }
      }
    }

    if (updatedNeeded) {
      localStorage.setItem('renter_listings', JSON.stringify(loaded));
    }

    return loaded;
  });

  const [studentUser, setStudentUser] = useState<StudentUser | null>(() => {
    const saved = localStorage.getItem('renter_student_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [landlordUser, setLandlordUser] = useState<LandlordUser | null>(() => {
    const saved = localStorage.getItem('renter_landlord_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentUserRole, setCurrentUserRole] = useState<'landlord' | 'student' | null>(() => {
    const saved = localStorage.getItem('renter_current_role');
    return saved ? (saved as 'landlord' | 'student') : null;
  });

  // Filter & Search states
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(3000);
  const [selectedListing, setSelectedListing] = useState<RoomListing | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'free-view'>('all'); // Show premium full interactive style vs free price-focused minimalist view
  
  // Landlord Add Room Form states
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('Civil Lines, Jabalpur');
  const [newPrice, setNewPrice] = useState<number>(2400);
  const [newDescription, setNewDescription] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register Form states
  const [regStudentName, setRegStudentName] = useState('');
  const [regStudentLocation, setRegStudentLocation] = useState('');
  const [regStudentPhone, setRegStudentPhone] = useState('');

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem('renter_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    if (studentUser) {
      localStorage.setItem('renter_student_user', JSON.stringify(studentUser));
    } else {
      localStorage.removeItem('renter_student_user');
    }
  }, [studentUser]);

  useEffect(() => {
    if (landlordUser) {
      localStorage.setItem('renter_landlord_user', JSON.stringify(landlordUser));
    } else {
      localStorage.removeItem('renter_landlord_user');
    }
  }, [landlordUser]);

  useEffect(() => {
    if (currentUserRole) {
      localStorage.setItem('renter_current_role', currentUserRole);
    } else {
      localStorage.removeItem('renter_current_role');
    }
  }, [currentUserRole]);

  // Demo presets for room images
  const ROOM_IMAGE_PRESETS = [
    { name: 'Cozy Room Alpha', url: '/1.jpg' },
    { name: 'Elegant Study Room', url: '/2.jpg' },
    { name: 'Bright Student Pod', url: '/3.jpg' },
    { name: 'Dorm Suite', url: '/4.jpg' },
    { name: 'Focus Study Spot', url: '/5.jpg' },
    { name: 'Charming Bedroom', url: '/6.jpg' },
    { name: 'Spacious Local Room', url: '/7.jpg' },
    { name: 'Elite Budget Living', url: '/8.jpg' },
    { name: 'Comfort Corner', url: '/3.png' }
  ];

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newPrice) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    const currentLandlordName = landlordUser?.name || 'Authorized Landlord';
    const currentLandlordPhone = landlordUser?.phone || '+1 (555) 999-8888';

    const newRoom: RoomListing = {
      id: `listing-${Date.now()}`,
      title: newTitle,
      location: newLocation,
      price: Number(newPrice),
      description: newDescription,
      photoUrl: newPhotoUrl || ROOM_IMAGE_PRESETS[Math.floor(Math.random() * ROOM_IMAGE_PRESETS.length)].url,
      landlordName: currentLandlordName,
      landlordPhone: currentLandlordPhone,
      createdAt: new Date().toISOString().split('T')[0],
      coordinates: { 
        x: Math.floor(Math.random() * 70) + 15, 
        y: Math.floor(Math.random() * 70) + 15 
      }
    };

    setListings([newRoom, ...listings]);
    setSuccessMsg('✨ Room listed successfully!');
    
    // Clear form inputs
    setNewTitle('');
    setNewDescription('');
    setNewPrice(350);
    setNewPhotoUrl('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  const handleDeleteListing = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setListings(listings.filter(listing => listing.id !== id));
    }
  };

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regStudentName || !regStudentLocation || !regStudentPhone) {
      alert('Please fill in Name, Location, and Phone Number.');
      return;
    }
    
    const sUser: StudentUser = {
      name: regStudentName,
      location: regStudentLocation,
      phone: regStudentPhone
    };

    setStudentUser(sUser);
    setCurrentUserRole('student');
    setScreen('student-dashboard');
  };

  const handleQuickLoginAsLandlord = () => {
    // If not registered, create standard template
    if (!landlordUser) {
      const defaultLandlord: LandlordUser = {
        name: 'John Miller',
        phone: '+1 (555) 883-2211',
        agencyName: 'Miller & Co. Housing'
      };
      setLandlordUser(defaultLandlord);
    }
    setCurrentUserRole('landlord');
    setScreen('landlord-dashboard');
  };

  const handleQuickLoginAsStudent = () => {
    if (!studentUser) {
      const defaultStudent: StudentUser = {
        name: 'Sarah Smith',
        location: 'Downtown Core',
        phone: '+1 (555) 441-2399'
      };
      setStudentUser(defaultStudent);
    }
    setCurrentUserRole('student');
    setScreen('student-dashboard');
  };

  const handleSignOut = () => {
    setCurrentUserRole(null);
    setScreen('home');
  };

  // Reset all listings to defaults to refresh mock data
  const handleResetData = () => {
    if (confirm('Reset default listings and clear local storage?')) {
      setListings(INITIAL_LISTINGS);
      localStorage.setItem('renter_listings', JSON.stringify(INITIAL_LISTINGS));
    }
  };

  // Filter listings based on Student Location Input
  const filteredListings = listings.filter(item => {
    const matchesLocation = item.location.toLowerCase().includes(filterLocation.toLowerCase()) ||
                            item.title.toLowerCase().includes(filterLocation.toLowerCase()) ||
                            item.description.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesPrice = item.price <= filterMaxPrice;
    return matchesLocation && matchesPrice;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      
      {/* BRAND HEADER BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-150 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div 
          onClick={() => setScreen('home')} 
          className="flex items-center gap-2 cursor-pointer group font-['Space_Grotesk']"
        >
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Stay<span className="bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 bg-clip-text text-transparent">well</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Quick Room Finder</span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {currentUserRole === 'landlord' && (
            <button 
              onClick={() => setScreen('landlord-dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${screen === 'landlord-dashboard' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">My Listings</span>
            </button>
          )}

          {currentUserRole === 'student' && (
            <button 
              onClick={() => setScreen('student-dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${screen === 'student-dashboard' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Rooms Feed</span>
            </button>
          )}

          {/* Quick Simulation Indicator */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-1.5">Simulation:</span>
            <button 
              onClick={handleQuickLoginAsLandlord} 
              className={`text-xs font-semibold px-2 py-1 rounded-md transition-all ${currentUserRole === 'landlord' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              Landlord
            </button>
            <button 
              onClick={handleQuickLoginAsStudent} 
              className={`text-xs font-semibold px-2 py-1 rounded-md transition-all ${currentUserRole === 'student' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              Student Seeker
            </button>
          </div>

          {currentUserRole ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-slate-400 font-medium">Logged in as</span>
                <span className="text-xs font-bold text-indigo-950 truncate max-w-[120px]">
                  {currentUserRole === 'landlord' ? (landlordUser?.name || 'Landlord') : (studentUser?.name || 'Student')}
                </span>
              </div>
              <button 
                onClick={handleSignOut}
                title="Sign Out"
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  // Simulate immediate quick login
                  handleQuickLoginAsStudent();
                }}
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-all cursor-pointer"
              >
                Log In
              </button>
              <button 
                onClick={() => setScreen('register-student')}
                className="text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>

      {/* VIEWPORT AREA */}
      <main className="flex-1 flex flex-col">

        {/* 1. FIRST PAGE: HOME HERO SCREEN */}
        {screen === 'home' && (
          <div className="relative flex-1 flex flex-col justify-center min-h-[calc(100vh-73px)]">
            {/* Background of room with dark high-fidelity premium overlay */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1920&q=85')` 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-950/60" />
            </div>

            {/* Main Interactive Grid */}
            <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Column 1: Title, Paragraph, quick stats */}
              <div className="lg:col-span-7 flex flex-col gap-6 text-white text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider self-start">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  Fastest growing rental network
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight font-['Space_Grotesk']">
                  College is hard enough, <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Finding a room shouldn't Be.</span>
                </h1>

                <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-xl font-normal leading-relaxed">
                  Welcome to <strong className="text-white font-semibold">Staywell</strong>, the premier hub connecting smart students with reliable room owners. Browse modern, verified rooms with instant photos, full prices, accurate descriptions, and interactive location filter maps. Secure your space in minutes!
                </p>

                {/* Micro Stats Counter Cards */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 max-w-md">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">450+</div>
                    <div className="text-xs text-slate-400">Verified Rooms</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">12 mins</div>
                    <div className="text-xs text-slate-400">Avg. Find Time</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">0%</div>
                    <div className="text-xs text-slate-400">Agent Fees</div>
                  </div>
                </div>
              </div>

              {/* Column 2: Role Selection Portal Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
                  <div className="mb-6 text-center lg:text-left">
                    <h3 className="text-xl font-bold tracking-tight">Which side are you on?</h3>
                    <p className="text-sm text-slate-300 mt-1">Select your profile option to navigate listings or add rooms immediately.</p>
                  </div>

                  {/* Two Main Requested Buttons */}
                  <div className="flex flex-col gap-4">
                    {/* Room Owner selection button */}
                    <button 
                      onClick={() => setScreen('register-landlord')}
                      className="group relative flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border border-indigo-500/50 shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-white/15 flex items-center justify-center text-white font-bold group-hover:bg-white/20 transition-all">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-bold text-base">Room Owner Portal</div>
                          <div className="text-xs text-indigo-200 mt-0.5">List rooms, set pricing, write descriptions</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-indigo-200 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Student/room finder selection button */}
                    <button 
                      onClick={() => setScreen('register-student')}
                      className="group relative flex items-center justify-between p-5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold group-hover:bg-indigo-500/30 transition-all">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-bold text-base">Student Seeker</div>
                          <div className="text-xs text-slate-400 mt-0.5">Find rooms, view pricing, filter map location</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Need immediate help?</span>
                    <button 
                      onClick={() => {
                        setScreen('student-dashboard');
                        setCurrentUserRole('student');
                      }} 
                      className="text-indigo-400 hover:text-indigo-300 font-bold underline"
                    >
                      Browse without account
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2A. SECOND PAGE: REGISTER AS LANDLORD & LIST YOUR FIRST ROOM */}
        {screen === 'register-landlord' && (
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 flex-1 flex flex-col justify-center">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
              
              {/* Left Column Accent Panel */}
              <div className="md:col-span-4 bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 text-white flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/30">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">Landlord Sign-Up</h3>
                  <p className="text-xs text-indigo-200 mt-2 leading-relaxed">
                    Instantly register your landlord account profile and customize pricing, photos, and descriptions for students to find you quick.
                  </p>
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    Unlimited room updates
                  </div>
                  <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium mt-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    Direct phone call inquiries
                  </div>
                  <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium mt-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    100% Free - No agency charges
                  </div>
                </div>
              </div>

              {/* Right Column Form (Registers + immediately lists first room!) */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  // Save simulated landlord profile
                  const nameEl = (e.currentTarget.elements.namedItem('landlord_name') as HTMLInputElement).value;
                  const phoneEl = (e.currentTarget.elements.namedItem('landlord_phone') as HTMLInputElement).value;
                  const agencyEl = (e.currentTarget.elements.namedItem('landlord_agency') as HTMLInputElement).value;
                  
                  if (!nameEl || !phoneEl) {
                    alert('Please enter your name and phone number to list rooms.');
                    return;
                  }

                  const lUser: LandlordUser = {
                    name: nameEl,
                    phone: phoneEl,
                    agencyName: agencyEl
                  };

                  setLandlordUser(lUser);
                  setCurrentUserRole('landlord');

                  // Now add their first room
                  const firstRoom: RoomListing = {
                    id: `listing-${Date.now()}`,
                    title: newTitle || 'Bright Spacious Room near Campus',
                    location: newLocation,
                    price: Number(newPrice),
                    description: newDescription || 'Excellent room available for smart student looking for comfortable studying space. Secure neighborhood, fully equipped kitchen.',
                    photoUrl: newPhotoUrl || ROOM_IMAGE_PRESETS[0].url,
                    landlordName: nameEl,
                    landlordPhone: phoneEl,
                    createdAt: new Date().toISOString().split('T')[0],
                    coordinates: { x: Math.floor(Math.random() * 60) + 20, y: Math.floor(Math.random() * 60) + 20 }
                  };

                  setListings([firstRoom, ...listings]);
                  setScreen('landlord-dashboard');

                  // Clear form inputs
                  setNewTitle('');
                  setNewDescription('');
                  setNewPrice(350);
                  setNewPhotoUrl('');
                }}
                className="md:col-span-8 p-6 sm:p-8 flex flex-col gap-5 text-left"
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Register &amp; Add First Room</h2>
                  <p className="text-sm text-slate-500 mt-1">To register as a Landlord, fill out your details and listing profile info below.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Landlord Personal Details */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Your Full Name <span className="text-rose-500">*</span></label>
                    <input 
                      name="landlord_name"
                      type="text" 
                      required 
                      defaultValue={landlordUser?.name || ""}
                      placeholder="e.g. Richard Hendricks"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 bg-slate-50 font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Your Phone Number <span className="text-rose-500">*</span></label>
                    <input 
                      name="landlord_phone"
                      type="tel" 
                      required 
                      defaultValue={landlordUser?.phone || ""}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 bg-slate-50 font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Agency or Property Group Name <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input 
                    name="landlord_agency"
                    type="text" 
                    defaultValue={landlordUser?.agencyName || ""}
                    placeholder="e.g. Tech Valley Rentals"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 bg-slate-50 font-medium"
                  />
                </div>

                {/* Landlord First Room Details section */}
                <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
                  <span className="text-sm font-extrabold text-indigo-950 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs">First Room Listing Details</span>
                  </span>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Room Title</label>
                    <input 
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Premium Quiet Loft Bedroom with High Ceiling"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Room Location Neighborhood</label>
                      <select 
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 font-semibold text-slate-700 bg-white"
                      >
                        <option value="Civil Lines, Jabalpur">Civil Lines, Jabalpur</option>
                        <option value="Vijay Nagar, Jabalpur">Vijay Nagar, Jabalpur</option>
                        <option value="Wright Town, Jabalpur">Wright Town, Jabalpur</option>
                        <option value="Adhartal, Jabalpur">Adhartal, Jabalpur</option>
                        <option value="Gorakhpur, Jabalpur">Gorakhpur, Jabalpur</option>
                        <option value="Ranji, Jabalpur">Ranji, Jabalpur</option>
                        <option value="Gokalpur, Jabalpur">Gokalpur, Jabalpur</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Price per Month (₹) <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-sm font-bold text-slate-400">₹</span>
                        <input 
                          type="number"
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(Number(e.target.value))}
                          placeholder="2400"
                          min="500"
                          className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 font-bold bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Describe the Room</label>
                    <textarea 
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Mention access to kitchen, washing machine, study desks, distance to university campus and transit link stations."
                      rows={3}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 font-medium"
                    ></textarea>
                  </div>

                  {/* Choice of Photos */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Select room photo template or insert URL</label>
                    <div className="grid grid-cols-5 gap-2">
                      {ROOM_IMAGE_PRESETS.map((preset, index) => (
                        <div 
                          key={index} 
                          onClick={() => setNewPhotoUrl(preset.url)}
                          className={`cursor-pointer group relative rounded-lg overflow-hidden border-2 h-14 transition-all ${newPhotoUrl === preset.url ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                          <span className="absolute bottom-0.5 left-0.5 right-0.5 text-[8px] text-white bg-black/60 font-bold text-center px-0.5 truncate rounded-xs">
                            {preset.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <input 
                      type="url"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Or paste a custom Unsplash image URL here"
                      className="mt-2 w-full px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-indigo-600 font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button 
                    type="submit"
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg shadow-md shadow-indigo-100 transition-all text-sm text-center cursor-pointer"
                  >
                    Finish Registration &amp; List First Room
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setScreen('home')}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* 2B. SECOND PAGE: REGISTER AS STUDENT/ROOM SEEKER */}
        {screen === 'register-student' && (
          <div className="max-w-xl mx-auto w-full px-4 sm:px-8 py-12 flex-1 flex flex-col justify-center">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-left">
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-400" />
                    <span className="font-bold text-sm tracking-wide uppercase text-indigo-200">Student Profile Setup</span>
                  </div>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-0.5 rounded-full border border-indigo-400/30">Free Seeker</span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight mt-2 text-white">Find Room Fast</h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Join hundreds of students finding rooms in seconds. Enter your custom profile details to contact landlords and customize dashboard location filter recommendations.
                </p>
              </div>

              <form onSubmit={handleRegisterStudent} className="p-6 sm:p-8 flex flex-col gap-4">
                
                {/* 1. Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={regStudentName}
                    onChange={(e) => setRegStudentName(e.target.value)}
                    placeholder="Sarah Smith"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>

                {/* 2. Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> Location / Preferred Area <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={regStudentLocation}
                    onChange={(e) => setRegStudentLocation(e.target.value)}
                    placeholder="e.g. University Heights, Downtown"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>

                {/* 3. Phone number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={regStudentPhone}
                    onChange={(e) => setRegStudentPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 304-9182"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 bg-slate-50 font-semibold text-slate-800"
                  />
                </div>

                <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 flex gap-3 text-xs text-indigo-800 mt-2">
                  <Info className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Privacy Note:</span> Your phone number is only shared with landlords when you choose to connect directly regarding an active room listing. Your data is kept 100% locally.
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg shadow-md shadow-indigo-100 transition-all text-sm mt-3 cursor-pointer text-center"
                >
                  Confirm Registration &amp; Open Dashboard
                </button>

                <div className="text-center mt-2">
                  <button 
                    type="button" 
                    onClick={() => setScreen('home')}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 hover:underline"
                  >
                    Back to Selection
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* 3. THIRD PAGE: LANDLORD WORKSPACE / ROOM ADD & LISTINGS DASHBOARD */}
        {screen === 'landlord-dashboard' && (
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 flex flex-col gap-8 text-left">
            
            {/* Header section with landlord status info */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">Landlord Control Room</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">Manage Your Rooms</h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Add custom photos, description details, location specifications, and pricing for students. Track live listings updates instantly.
                </p>
              </div>

              {/* Profile card summary */}
              <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center gap-3 max-w-xs shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {landlordUser?.name ? landlordUser.name.charAt(0) : 'L'}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-white truncate">{landlordUser?.name || 'Authorized Landlord'}</div>
                  <div className="text-[10px] text-indigo-200 truncate">{landlordUser?.phone || '+1 (555) 123-4567'}</div>
                  {landlordUser?.agencyName && <div className="text-[10px] text-emerald-400 font-bold truncate">{landlordUser.agencyName}</div>}
                </div>
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">My Active Rooms</span>
                <div className="text-2xl font-black text-slate-950 mt-1">
                  {listings.filter(l => l.landlordPhone === (landlordUser?.phone || '+1 (555) 123-4567') || l.landlordName === (landlordUser?.name || 'Marcus Aurelius')).length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total System Listings</span>
                <div className="text-2xl font-black text-indigo-600 mt-1">{listings.length}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Student Views</span>
                <div className="text-2xl font-black text-slate-950 mt-1">1,283</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Preset Reset</span>
                <div className="mt-1">
                  <button 
                    onClick={handleResetData}
                    className="text-xs font-extrabold text-rose-600 hover:text-rose-800 underline bg-rose-50 px-2 py-1 rounded"
                  >
                    Clear Custom Rooms
                  </button>
                </div>
              </div>
            </div>

            {/* Live split-screen workspace: Left: Add New Room, Right: Active listings manager */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Section: Add room, photos, pricing, descriptions easily */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-lg font-extrabold text-indigo-950 tracking-tight">Add Rent Room</h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">Direct List</span>
                </div>

                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleAddListing} className="flex flex-col gap-4 text-left">
                  
                  {/* Title */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Room Title <span className="text-rose-500">*</span></label>
                    <input 
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Spacious Double Room Near Engineering Dept"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 font-semibold"
                    />
                  </div>

                  {/* Location & Pricing Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Neighborhood <span className="text-rose-500">*</span></label>
                      <select 
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-indigo-600 bg-white font-bold text-slate-700"
                      >
                        <option value="Civil Lines, Jabalpur">Civil Lines, Jabalpur</option>
                        <option value="Vijay Nagar, Jabalpur">Vijay Nagar, Jabalpur</option>
                        <option value="Wright Town, Jabalpur">Wright Town, Jabalpur</option>
                        <option value="Adhartal, Jabalpur">Adhartal, Jabalpur</option>
                        <option value="Gorakhpur, Jabalpur">Gorakhpur, Jabalpur</option>
                        <option value="Ranji, Jabalpur">Ranji, Jabalpur</option>
                        <option value="Gokalpur, Jabalpur">Gokalpur, Jabalpur</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Price / Mo (₹) <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-sm font-bold text-slate-400">₹</span>
                        <input 
                          type="number"
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(Number(e.target.value))}
                          placeholder="2400"
                          min="500"
                          className="w-full pl-8 pr-3.5 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-indigo-600 font-extrabold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Room Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Room Description <span className="text-rose-500">*</span></label>
                    <textarea 
                      required
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Describe security features, private workspace, shared assets, or landlord expectations here."
                      rows={4}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-indigo-600 font-medium"
                    ></textarea>
                  </div>

                  {/* Photo Preset Selector */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Select room photo template</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {ROOM_IMAGE_PRESETS.map((preset, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setNewPhotoUrl(preset.url)}
                          className={`cursor-pointer rounded overflow-hidden border-2 h-12 relative group ${newPhotoUrl === preset.url ? 'border-indigo-600 ring-1 ring-indigo-200' : 'border-slate-200'}`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      <span>Preset previews will update the active photo card layout instantly.</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm cursor-pointer text-center"
                  >
                    🚀 Publish This Room Listing
                  </button>

                </form>
              </div>

              {/* listings list of active landlord */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-indigo-950">Active Listings Directory</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-full border border-slate-200">
                    Live Dashboard
                  </span>
                </div>

                {listings.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
                    <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-600">No rooms listed yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Use the left form to quickly list your first rental room!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {listings.map((item) => {
                      // Check if it belongs to current landlord or is preset (show all for absolute ease of testing)
                      const isOwner = true; // Let them manage all listings in the dashboard sandbox so they can try editing/deleting any!

                      return (
                        <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col sm:flex-row">
                          <div className="sm:w-44 h-32 shrink-0 relative bg-slate-100">
                            <img src={item.photoUrl} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-extrabold px-2 py-0.5 rounded-md">
                              ₹{item.price}/mo
                            </div>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between text-left min-w-0">
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                  <MapPin className="h-3 w-3" />
                                  {item.location}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold">Listed {item.createdAt}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-950 mt-1.5 truncate">{item.title}</h4>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                              <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 uppercase font-bold">Landlord Contact</span>
                                <span className="text-xs font-semibold text-slate-700">{item.landlordName} • {item.landlordPhone}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button 
                                  onClick={() => {
                                    setSelectedListing(item);
                                    setScreen('student-dashboard'); // Jump to browse with highlighted card
                                  }}
                                  title="View Live in Student Dashboard"
                                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg hover:border-indigo-100 transition-all cursor-pointer"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                {isOwner && (
                                  <button 
                                    onClick={() => handleDeleteListing(item.id)}
                                    title="Delete Room Listing"
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg hover:border-rose-100 transition-all cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 4. FOURTH PAGE: STUDENT DASHBOARD & FEED */}
        {screen === 'student-dashboard' && (
          <div className="flex-1 flex flex-col">
            
            {/* Top Minimal Dashboard Banner */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-5">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Brand / Student profile title */}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Student Seeker Mode</span>
                    {studentUser && (
                      <span className="text-xs font-medium text-slate-400">Welcome, <strong className="text-slate-800 font-bold">{studentUser.name}</strong></span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 mt-1 tracking-tight">Browse Student Dorms &amp; Rooms</h1>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  
                  {/* Location Search Input Filter */}
                  <div className="relative flex-1 sm:flex-initial min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      placeholder="Search location neighborhood..."
                      className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-indigo-600 font-semibold"
                    />
                    {filterLocation && (
                      <button 
                        onClick={() => setFilterLocation('')}
                        className="absolute right-2.5 top-2.5 text-xs font-bold text-slate-400 hover:text-slate-600"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Price Slider Filter */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-slate-500 font-semibold">Max Price:</span>
                    <span className="text-xs font-extrabold text-indigo-700">₹{filterMaxPrice}</span>
                    <input 
                      type="range" 
                      min="2000" 
                      max="3000" 
                      step="100"
                      value={filterMaxPrice}
                      onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                      className="h-1.5 rounded-lg bg-slate-200 appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Free vs Premium View Mode Switcher */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button 
                      onClick={() => setActiveTab('all')}
                      className={`text-xs font-bold px-2.5 py-1 rounded-md transition-all ${activeTab === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Premium Feed
                    </button>
                    <button 
                      onClick={() => setActiveTab('free-view')}
                      className={`text-xs font-bold px-2.5 py-1 rounded-md transition-all ${activeTab === 'free-view' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      title="Shows rooms with one photo only in free with prices"
                    >
                      🎁 Free Access View
                    </button>
                  </div>

                </div>

              </div>
            </div>

            {/* Split Screen Panel: Left Feed (Cards), Right Interactive Map */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 bg-slate-100">
              
              {/* Left Column: Listings Grid (takes 7 columns) */}
              <div className="lg:col-span-7 overflow-y-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
                
                {/* Active Filter Info alert */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Showing {filteredListings.length} rooms matching location filter</span>
                  {(filterLocation || filterMaxPrice < 1000) && (
                    <button 
                      onClick={() => { setFilterLocation(''); setFilterMaxPrice(1000); }} 
                      className="text-indigo-600 hover:underline"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {filteredListings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-4 text-left">
                    <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-800 text-center">No rooms found for "{filterLocation || 'selected filters'}"</p>
                    <p className="text-xs text-slate-400 text-center mt-1">Try expanding your price range or searching different districts like "Downtown Core" or "UniversityHeights".</p>
                    <div className="flex justify-center gap-2 mt-4">
                      <button 
                        onClick={() => setFilterLocation('University Heights')} 
                        className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded border border-indigo-100"
                      >
                        University Heights
                      </button>
                      <button 
                        onClick={() => setFilterLocation('Downtown Core')} 
                        className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded border border-indigo-100"
                      >
                        Downtown Core
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredListings.map((item) => {
                      const isSelected = selectedListing?.id === item.id;
                      
                      // FOURTH PAGE REQUIREMENT: "show student rooms one photo only in free with prices"
                      // Under 'free-view' mode, we specifically design a minimalist price card with exactly ONE PHOTO, title and price, hiding secondary elements.
                      if (activeTab === 'free-view') {
                        return (
                          <div 
                            key={item.id}
                            onClick={() => setSelectedListing(item)}
                            className={`group cursor-pointer bg-white rounded-xl border transition-all overflow-hidden relative flex flex-col text-left ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
                          >
                            {/* EXACTLY ONE PHOTO ONLY */}
                            <div className="h-44 bg-slate-100 relative overflow-hidden shrink-0">
                              <img 
                                src={item.photoUrl} 
                                alt={item.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                              <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-sm">
                                ₹{item.price} / mo
                              </div>
                              <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-[9px] text-emerald-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-500/30">
                                Free Access View
                              </div>
                            </div>

                            {/* PRICE-FOCUSED CARD CONTENT */}
                            <div className="p-3.5 flex-1 flex flex-col justify-between">
                              <div>
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                  <MapPin className="h-2.5 w-2.5 text-slate-400" />
                                  {item.location}
                                </span>
                                <h3 className="text-sm font-extrabold text-slate-900 mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                  {item.title}
                                </h3>
                              </div>

                              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                <span className="text-slate-400 font-bold">Price Included</span>
                                <span className="text-indigo-600 font-extrabold underline hover:text-indigo-700">Quick Contact</span>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // PREMIUM FEED: Full interactive detailed card layout
                      return (
                        <div 
                          key={item.id}
                          onClick={() => setSelectedListing(item)}
                          className={`group cursor-pointer bg-white rounded-xl border transition-all overflow-hidden flex flex-col text-left ${isSelected ? 'border-indigo-600 ring-4 ring-indigo-100 scale-[1.01]' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
                        >
                          <div className="h-48 bg-slate-100 relative overflow-hidden">
                            <img 
                              src={item.photoUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            <div className="absolute top-3 left-3 bg-slate-950/90 text-white text-xs font-black px-3 py-1 rounded-lg border border-white/10 shadow-lg flex items-center gap-1">
                              <span className="text-sm text-emerald-400 font-bold">₹</span>
                              <span className="text-sm">{item.price}</span>
                              <span className="text-[10px] text-slate-400 font-normal ml-0.5">/mo</span>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-xs p-2 rounded-lg text-white border border-white/10">
                              <span className="text-[9px] text-indigo-300 font-extrabold uppercase tracking-wide flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5" />
                                {item.location}
                              </span>
                              <h3 className="text-xs font-extrabold mt-0.5 truncate">{item.title}</h3>
                            </div>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                {item.description}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-indigo-700 border border-slate-200">
                                  {item.landlordName.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Renter Partner</div>
                                  <div className="text-xs font-bold text-slate-800">{item.landlordName}</div>
                                </div>
                              </div>
                              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
                                View Details
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Interactive Map & Detail Sidebar (takes 5 columns) */}
              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col">
                
                {/* 1. Interactive map element container */}
                <div className="flex-1 min-h-[300px] lg:min-h-0 bg-slate-200 relative flex flex-col justify-between p-4">
                  
                  {/* Map Header Overlay */}
                  <div className="absolute top-4 left-4 right-4 z-10 bg-slate-900/90 backdrop-blur-xs p-2.5 rounded-lg text-white border border-slate-800 shadow-md flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold">
                      <MapIcon className="h-4 w-4 text-indigo-400 animate-pulse" />
                      <span>Interactive Listings Map</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded font-extrabold">
                      Live Pins
                    </span>
                  </div>

                  {/* CUSTOM VECTOR MAP BOX GRAPHIC representing listing coordinates */}
                  <div className="absolute inset-0 z-0 bg-slate-50 overflow-hidden flex flex-col items-center justify-center">
                    
                    {/* Simulated Map Grid Overlay and Landmarks */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
                    
                    {/* Animated Landmark Tags */}
                    <span className="absolute top-8 left-[10%] text-[10px] text-slate-400 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-full font-extrabold pointer-events-none shadow-xs">
                      📍 Gorakhpur, Jabalpur
                    </span>
                    <span className="absolute top-[40%] left-[38%] text-[10px] text-slate-400 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-full font-extrabold pointer-events-none shadow-xs">
                      🎓 RDVV University Campus
                    </span>
                    <span className="absolute top-[52%] left-[12%] text-[10px] text-slate-400 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-full font-extrabold pointer-events-none shadow-xs">
                      🚇 Jabalpur Junction Railway Station
                    </span>
                    <span className="absolute top-[32%] right-[15%] text-[10px] text-slate-400 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-full font-extrabold pointer-events-none shadow-xs">
                      🏢 Vijay Nagar Commercial Hub
                    </span>
                    <span className="absolute bottom-16 right-[25%] text-[10px] text-slate-400 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-full font-extrabold pointer-events-none shadow-xs">
                      🌊 Bhedaghat Marble Rocks Walkway
                    </span>

                    {/* Vector Road lines for ultra premium look */}
                    <svg className="absolute inset-0 w-full h-full text-slate-200 opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="4" />
                      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="4" />
                      <line x1="0" y1="20%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="20%" y1="0" x2="80%" y2="100%" stroke="currentColor" strokeWidth="2" />
                    </svg>

                    {/* Interactive Active Pins on Map */}
                    {filteredListings.map((item) => {
                      const isSelected = selectedListing?.id === item.id;
                      return (
                        <div 
                          key={item.id}
                          className="absolute transition-all duration-300"
                          style={{ left: `${item.coordinates.x}%`, top: `${item.coordinates.y}%` }}
                        >
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedListing(item);
                            }}
                            className={`group relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-transform ${isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20'}`}
                          >
                            <div className={`p-1.5 rounded-full shadow-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-white text-white scale-110 ring-4 ring-indigo-200' : 'bg-white border-indigo-600 text-indigo-600 hover:bg-indigo-50'}`}>
                              <Building2 className="h-4.5 w-4.5" />
                            </div>

                            {/* Hover tooltip */}
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 text-white font-extrabold text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap shadow-md pointer-events-none z-50">
                              ₹{item.price} - {item.location}
                            </span>
                          </button>
                        </div>
                      );
                    })}

                    {/* Google Maps Embed Error / Warning Safe Mode Fallback Indicator */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs p-2 rounded-md text-[10px] text-slate-500 font-bold border border-slate-200 shadow-sm flex items-center gap-1.5 pointer-events-none">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>Custom API Sandbox Render (Active)</span>
                    </div>

                  </div>

                </div>

                {/* 2. Listing Details sidebar / Drawer panel (Always shows details of currently clicked room listing!) */}
                <div className="bg-white border-t border-slate-200 p-5 text-left flex flex-col gap-3 min-h-[220px]">
                  {selectedListing ? (
                    <div className="flex flex-col gap-3">
                      
                      {/* Details Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 uppercase">
                            <MapPin className="h-3 w-3" />
                            {selectedListing.location}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-tight">{selectedListing.title}</h3>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Rental</span>
                          <span className="text-xl font-black text-emerald-600">₹{selectedListing.price}</span>
                        </div>
                      </div>

                      {/* Description snippet */}
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedListing.description}
                      </p>

                      {/* Contact landlord section */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/60 mt-1">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-indigo-600 font-bold block">Listed by Landlord Partner</span>
                          <span className="text-xs font-extrabold text-slate-800">{selectedListing.landlordName}</span>
                          <span className="text-[11px] text-slate-500 block">Member since September 2026</span>
                        </div>

                        <a 
                          href={`tel:${selectedListing.landlordPhone}`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg shadow-sm transition-all text-center"
                        >
                          <PhoneCall className="h-3.5 w-3.5" />
                          <span>Call {selectedListing.landlordPhone}</span>
                        </a>
                      </div>

                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-6">
                      <Info className="h-8 w-8 text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-600">No Room Highlighted</p>
                      <p className="text-xs text-slate-400 mt-0.5 max-w-xs">
                        Click on any room card on the left feed or select a custom location marker pin on the map to display pricing details and direct call phone links!
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-center py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 font-['Space_Grotesk']">
            <span className="text-white font-bold text-sm">Staywell Inc.</span>
            <span>- College is hard enough, Finding a room shouldn't Be.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setScreen('home')} className="hover:text-white transition-colors">Home</button>
            <span>•</span>
            <button onClick={() => { setScreen('student-dashboard'); }} className="hover:text-white transition-colors">Find Rooms</button>
            <span>•</span>
            <button onClick={() => setScreen('register-landlord')} className="hover:text-white transition-colors">Room Owner Portal</button>
          </div>
          <div>
            <span>© 2026 Staywell. Built for Workspace students &amp; families.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
