import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

interface ImageData {
  id: string;
  url: string;
  thumbnailUrl: string;
  altText: string;
  description: string;
  photographer: {
    name: string;
    username: string;
  };
  sourceUrl: string;
}

interface ImageSliderProps {
  destination: string;
  searchQuery?: string;
  limit?: number;
  height?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  destination, 
  searchQuery, 
  limit = 8,
  height = 300
}) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (searchQuery) {
          // Use regular search for custom queries
          response = await apiService.searchImages(searchQuery, 1, limit);
        } else {
          // Use enhanced destination search for better location relevance
          console.log(`Fetching enhanced slider images for destination: ${destination}`);
          response = await apiService.searchDestinationImages(destination, 1, limit);
        }
        
        if (response.success) {
          const imageData = response.data.images;
          console.log(`Successfully loaded ${imageData.length} slider images for ${destination || searchQuery}`);
          if (response.data.searchStrategy) {
            console.log(`Slider used search strategy: ${response.data.searchStrategy}`);
          }
          setImages(imageData.slice(0, limit));
        } else {
          setError('Failed to fetch images');
        }
      } catch (err: any) {
        console.error('Image fetch error:', err);
        // Fallback to original method if enhanced search fails
        if (!searchQuery) {
          try {
            console.log(`Enhanced slider search failed, trying fallback for: ${destination}`);
            const fallbackResponse = await apiService.getDestinationImages(destination, limit);
            if (fallbackResponse.success) {
              setImages(fallbackResponse.data.images);
              return;
            }
          } catch (fallbackErr) {
            console.error('Fallback slider search also failed:', fallbackErr);
          }
        }

        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Images temporarily unavailable');
        } else {
          setError(err.message || 'Unable to fetch images');
        }
      } finally {
        setLoading(false);
      }
    };

    if (destination || searchQuery) {
      fetchImages();
    }
  }, [destination, searchQuery, limit]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval);
    }
  }, [images.length, isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
  };

  const resumeAutoPlay = () => {
    setIsAutoPlaying(true);
  };

  if (loading) {
    return (
      <div className="image-slider" style={{ height }}>
        <div className="slider-loading">
          <div className="loading-shimmer"></div>
          <div className="loading-overlay">
            <div className="loading-spinner">🖼️</div>
            <p>Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="image-slider error" style={{ height }}>
        <div className="slider-error">
          <span className="error-icon">🖼️</span>
          <p>Gallery temporarily unavailable</p>
          <small>{error}</small>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="image-slider empty" style={{ height }}>
        <div className="slider-empty">
          <span className="empty-icon">📸</span>
          <p>No images found</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div 
      className="image-slider"
      style={{ height }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={resumeAutoPlay}
    >
      {/* Main Image Display */}
      <div className="slider-main">
        <div className="slider-image-container">
          <img
            src={currentImage.url}
            alt={currentImage.altText}
            className="slider-image"
          />
          
          {/* Image Overlay with Info */}
          <div className="slider-overlay">
            <div className="image-info">
              <div className="image-title">{currentImage.description || currentImage.altText}</div>
              <div className="photographer-credit">
                <span>📷 </span>
                <a 
                  href={currentImage.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="photographer-link"
                >
                  {currentImage.photographer.name}
                </a>
              </div>
            </div>
            
            {/* View Full Button */}
            <div className="image-actions">
              <a
                href={currentImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="view-full-btn"
                title="View full size"
              >
                🔍 View Full
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              className="slider-nav slider-nav-prev"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              &#8249;
            </button>
            <button 
              className="slider-nav slider-nav-next"
              onClick={goToNext}
              aria-label="Next image"
            >
              &#8250;
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="slider-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              style={{
                backgroundImage: `url(${image.thumbnailUrl})`,
              }}
              aria-label={`View image ${index + 1}`}
            >
              {index === currentIndex && <div className="thumbnail-overlay"></div>}
            </button>
          ))}
        </div>
      )}

      {/* Progress Indicator */}
      {images.length > 1 && (
        <div className="slider-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${((currentIndex + 1) / images.length) * 100}%` 
              }}
            ></div>
          </div>
          <div className="progress-text">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Auto-play Indicator */}
      {isAutoPlaying && images.length > 1 && (
        <div className="autoplay-indicator">
          <div className="autoplay-icon">▶️</div>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;