import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import WeatherWidget from '../components/weather/WeatherWidget';
import ImageGallery from '../components/images/ImageGallery';
import DestinationImage from '../components/images/DestinationImage';
import MapView from '../components/maps/MapView';
import apiService from '../services/api';

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<{ 
    name: string; 
    city: string; 
    country?: string;
    coordinates?: { latitude: number; longitude: number };
    flag?: string;
    description?: string;
  } | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const destinationDetailsRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (showSuggestions) {
        updateSuggestionPosition();
      }
    };

    const handleScroll = () => {
      if (showSuggestions) {
        updateSuggestionPosition();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSuggestions]);

  // Auto-scroll to destination details when a destination is selected
  useEffect(() => {
    if (selectedDestination && destinationDetailsRef.current) {
      setTimeout(() => {
        destinationDetailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [selectedDestination]);

  // Infinite carousel auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarouselIndex(prev => (prev + 1) % 6); // 6 featured destinations
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Update carousel transform
  useEffect(() => {
    if (carouselRef.current) {
      const track = carouselRef.current.querySelector('.destinations-track') as HTMLElement;
      if (track) {
        // Calculate card width based on screen size
        const isMobile = window.innerWidth <= 768;
        const cardWidth = isMobile ? 280 : 350; // Actual card width
        const gap = isMobile ? 16 : 24; // Gap from CSS: 1rem = 16px mobile, 1.5rem = 24px desktop
        const totalCardWidth = cardWidth + gap;
        
        // Start from left edge without any gap
        const translateX = -(currentCarouselIndex % 6) * totalCardWidth;
        
        track.style.transform = `translateX(${translateX}px)`;
      }
    }
  }, [currentCarouselIndex]);


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setSelectedDestination(null); // Clear previous destination
      try {
        const response = await apiService.geocodeLocation(searchQuery, 1);
        if (response.success && response.data.locations.length > 0) {
          const location = response.data.locations[0];
          setSelectedDestination({
            name: location.displayName,
            city: location.name,
            country: location.context.country,
            coordinates: {
              latitude: location.coordinates.latitude,
              longitude: location.coordinates.longitude
            },
            flag: getCountryFlag(location.context.country),
            description: getDestinationDescription(location.displayName)
          });
        } else {
          const parts = searchQuery.split(',').map(part => part.trim());
          setSelectedDestination({
            name: searchQuery,
            city: parts[0],
            country: parts[1],
            flag: '🌍',
            description: `Explore the beauty of ${parts[0]}`
          });
        }
      } catch (error) {
        const parts = searchQuery.split(',').map(part => part.trim());
        setSelectedDestination({
          name: searchQuery,
          city: parts[0],
          country: parts[1],
          flag: '🌍',
          description: `Discover ${parts[0]}`
        });
      } finally {
        setIsSearching(false);
        setShowSuggestions(false);
      }
    }
  };

  const updateSuggestionPosition = () => {
    if (searchInputRef.current) {
      const rect = searchInputRef.current.getBoundingClientRect();
      setSuggestionPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleInputChange = async (value: string) => {
    setSearchQuery(value);
    if (value.length > 2) {
      updateSuggestionPosition();
      try {
        const response = await apiService.geocodeLocation(value, 5);
        if (response.success) {
          setSearchSuggestions(response.data.locations);
          setShowSuggestions(true);
        }
      } catch (error) {
        setSearchSuggestions([]);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (location: any) => {
    setSelectedDestination(null); // Clear previous destination
    setSelectedDestination({
      name: location.displayName,
      city: location.name,
      country: location.context.country,
      coordinates: {
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude
      },
      flag: getCountryFlag(location.context.country),
      description: getDestinationDescription(location.displayName)
    });
    setSearchQuery(location.displayName);
    setShowSuggestions(false);
  };

  const getCountryFlag = (country?: string): string => {
    const flags: { [key: string]: string } = {
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Australia': '🇦🇺',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Germany': '🇩🇪',
      'Greece': '🇬🇷',
      'Thailand': '🇹🇭',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Canada': '🇨🇦',
      'Mexico': '🇲🇽',
      'Netherlands': '🇳🇱',
      'Switzerland': '🇨🇭',
      'Norway': '🇳🇴',
      'Sweden': '🇸🇪',
      'Denmark': '🇩🇰',
      'Turkey': '🇹🇷'
    };
    return flags[country || ''] || '🌍';
  };

  const getDestinationDescription = (name: string): string => {
    const descriptions: { [key: string]: string } = {
      'Paris': 'The City of Light awaits with its timeless elegance and romantic charm',
      'Tokyo': 'Experience the perfect blend of ancient tradition and cutting-edge innovation',
      'New York': 'The city that never sleeps, where dreams become reality',
      'London': 'Discover centuries of history in this magnificent royal capital',
      'Sydney': 'Where stunning harbor views meet vibrant cosmopolitan culture',
      'Rome': 'Walk through history in the eternal city of ancient wonders',
    };
    
    for (const [key, desc] of Object.entries(descriptions)) {
      if (name.includes(key)) return desc;
    }
    return `Discover the wonders and beauty of ${name.split(',')[0]}`;
  };

  const featuredDestinations = [
    { 
      name: 'Paris, France', 
      city: 'Paris', 
      country: 'France',
      coordinates: { latitude: 48.8566, longitude: 2.3522 },
      flag: '🇫🇷',
      description: 'The City of Light awaits with its timeless elegance and romantic charm',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River', 'Montmartre'],
      bestTime: 'April to October',
      category: 'Romance & Culture'
    },
    { 
      name: 'Tokyo, Japan', 
      city: 'Tokyo', 
      country: 'Japan',
      coordinates: { latitude: 35.6762, longitude: 139.6503 },
      flag: '🇯🇵',
      description: 'Experience the perfect blend of ancient tradition and cutting-edge innovation',
      highlights: ['Shibuya Crossing', 'Mount Fuji', 'Senso-ji Temple', 'Tokyo Skytree'],
      bestTime: 'March to May',
      category: 'Technology & Tradition'
    },
    { 
      name: 'Santorini, Greece', 
      city: 'Santorini', 
      country: 'Greece',
      coordinates: { latitude: 36.3932, longitude: 25.4615 },
      flag: '🇬🇷',
      description: 'Stunning sunsets and white-washed buildings overlooking the Aegean Sea',
      highlights: ['Oia Village', 'Blue Domes', 'Volcanic Beaches', 'Wine Tasting'],
      bestTime: 'April to November',
      category: 'Island Paradise'
    },
    { 
      name: 'New York, USA', 
      city: 'New York', 
      country: 'United States',
      coordinates: { latitude: 40.7128, longitude: -74.0060 },
      flag: '🇺🇸',
      description: 'The city that never sleeps, where dreams become reality',
      highlights: ['Central Park', 'Times Square', 'Statue of Liberty', 'Brooklyn Bridge'],
      bestTime: 'April to June',
      category: 'Urban Adventure'
    },
    { 
      name: 'Bali, Indonesia', 
      city: 'Bali', 
      country: 'Indonesia',
      coordinates: { latitude: -8.3405, longitude: 115.0920 },
      flag: '🇮🇩',
      description: 'Tropical paradise with ancient temples and stunning rice terraces',
      highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
      bestTime: 'April to October',
      category: 'Tropical Escape'
    },
    { 
      name: 'Dubai, UAE', 
      city: 'Dubai', 
      country: 'United Arab Emirates',
      coordinates: { latitude: 25.2048, longitude: 55.2708 },
      flag: '🇦🇪',
      description: 'Futuristic metropolis where luxury meets innovation in the desert',
      highlights: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari'],
      bestTime: 'November to March',
      category: 'Luxury & Innovation'
    }
  ];

  return (
    <div className="explore-page">
      {/* Hero Section with Search */}
      <section className="explore-hero">
        <div className="explore-hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover Your Next
              <span className="text-gradient"> Adventure</span>
            </h1>
            <p className="hero-subtitle">
              Explore breathtaking destinations with live weather, interactive maps, and stunning photography
            </p>
          </div>
          
          {/* Enhanced Search */}
          <div className="premium-search-container">
            <form onSubmit={handleSearch} className="premium-search-form">
              <div className="search-input-wrapper">
                <div className="search-icon">🔍</div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Search destinations, cities, landmarks..."
                  className="premium-search-input"
                />
                <button 
                  type="submit" 
                  disabled={isSearching}
                  className="search-submit-btn"
                >
                  {isSearching ? '⏳' : '🌍'}
                </button>
              </div>
            </form>
            
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="floating-element floating-1"></div>
        <div className="floating-element floating-2"></div>
        <div className="floating-element floating-3"></div>
      </section>

      {/* Selected Destination Details */}
      {selectedDestination && (
        <section ref={destinationDetailsRef} className="destination-details">
          <div className="container">
            <div className="destination-header">
              <div className="destination-info">
                <div className="destination-flag">{selectedDestination.flag}</div>
                <div>
                  <h2 className="destination-name">{selectedDestination.name}</h2>
                  <p className="destination-description">{selectedDestination.description}</p>
                </div>
              </div>
            </div>
            
            <div className="destination-content-premium">
              {/* Top Row - Weather and Map */}
              <div className="info-row top-row">
                {/* Weather Panel */}
                <div className="info-panel-compact weather-panel-compact">
                  <div className="panel-header-compact">
                    <div className="panel-icon-compact">🌤️</div>
                    <h3 className="panel-title-compact">Current Weather</h3>
                  </div>
                  <div className="panel-content-compact">
                    <WeatherWidget 
                      city={selectedDestination.city} 
                      country={selectedDestination.country} 
                    />
                  </div>
                </div>

                {/* Map Panel */}
                <div className="info-panel-compact map-panel-compact">
                  <div className="panel-header-compact">
                    <div className="panel-icon-compact">🗺️</div>
                    <h3 className="panel-title-compact">Location & Map</h3>
                  </div>
                  <div className="panel-content-compact">
                    {selectedDestination.coordinates ? (
                      <MapView
                        latitude={selectedDestination.coordinates.latitude}
                        longitude={selectedDestination.coordinates.longitude}
                        locationName={selectedDestination.name}
                        width={360}
                        height={180}
                        zoom={12}
                      />
                    ) : (
                      <div className="map-unavailable-compact">
                        <div className="unavailable-icon">📍</div>
                        <p>Location map temporarily unavailable</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Row - Image Gallery */}
              <div className="info-row bottom-row">
                <div className="info-panel-full gallery-panel-full">
                  <div className="panel-header-full">
                    <div className="panel-icon-full">📸</div>
                    <h3 className="panel-title-full">Destination Gallery</h3>
                    <div className="panel-subtitle-full">Discover the beauty of {selectedDestination.city}</div>
                  </div>
                  <div className="panel-content-gallery">
                    <ImageGallery 
                      destination={selectedDestination.name}
                      limit={6}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Destinations */}
      <section className="featured-destinations">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Destinations</h2>
            <p className="section-subtitle">
              Handpicked destinations offering extraordinary experiences around the globe
            </p>
          </div>
          
          <div className="destinations-carousel-container" ref={carouselRef}>
            <div className="destinations-track">
              {[...featuredDestinations, ...featuredDestinations, ...featuredDestinations].map((destination, index) => (
                  <div 
                    key={`${destination.name}-${index}`}
                    className="destination-card carousel-card"
                    onClick={() => setSelectedDestination(destination)}
                  >
                    <div className="card-image">
                      <DestinationImage 
                        destination={destination.name}
                      />
                      <div className="card-overlay">
                        <div className="card-flag">{destination.flag}</div>
                        <div className="card-category">{destination.category}</div>
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <div className="card-main-content">
                        <div className="card-header">
                          <h3 className="card-title">{destination.city}</h3>
                          <div className="card-country">{destination.country}</div>
                        </div>
                        
                        <p className="card-description">{destination.description}</p>
                        
                        <div className="card-highlights">
                          {destination.highlights.slice(0, 3).map((highlight, idx) => (
                            <span key={idx} className="highlight-tag">{highlight}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="card-footer">
                        <div className="best-time">
                          <span className="time-icon">🗓️</span>
                          <span className="time-text">Best time: {destination.bestTime}</span>
                        </div>
                        <div className="card-weather">
                          <WeatherWidget 
                            city={destination.city} 
                            country={destination.country} 
                            compact={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="explore-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Plan Your Journey?</h2>
            <p className="cta-subtitle">
              Join WanderLog to create detailed itineraries, save your favorite destinations, and never miss a moment
            </p>
            <div className="cta-buttons">
              <a href="/register" className="btn-primary-large">
                🚀 Start Planning Free
              </a>
              <a href="/login" className="btn-secondary-large">
                🔑 Sign In
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Portal-based Search Suggestions */}
      {showSuggestions && searchSuggestions.length > 0 && suggestionPosition && createPortal(
        <div 
          className="search-suggestions-portal"
          style={{
            position: 'absolute',
            top: suggestionPosition.top,
            left: suggestionPosition.left,
            width: suggestionPosition.width,
            zIndex: 999999
          }}
        >
          {searchSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => selectSuggestion(suggestion)}
            >
              <div className="suggestion-icon">{getCountryFlag(suggestion.context.country)}</div>
              <div className="suggestion-content">
                <div className="suggestion-name">{suggestion.displayName}</div>
                <div className="suggestion-type">{suggestion.placeType.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ExplorePage;