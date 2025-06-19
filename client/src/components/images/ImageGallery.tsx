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

interface ImageGalleryProps {
  destination: string;
  searchQuery?: string;
  limit?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  destination, 
  searchQuery, 
  limit = 6 
}) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        setImages([]); // Clear previous images immediately
        setCurrentStartIndex(0); // Reset carousel position
        
        let response;
        if (searchQuery) {
          // Use regular search for custom queries
          response = await apiService.searchImages(searchQuery, 1, limit);
        } else {
          // Use enhanced destination search for better location relevance
          console.log(`Fetching enhanced images for destination: ${destination}`);
          response = await apiService.searchDestinationImages(destination, 1, limit);
        }
        
        if (response.success) {
          const imageData = response.data.images;
          console.log(`Successfully loaded ${imageData.length} images for ${destination || searchQuery}`);
          if (response.data.searchStrategy) {
            console.log(`Used search strategy: ${response.data.searchStrategy}`);
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
            console.log(`Enhanced search failed, trying fallback for: ${destination}`);
            const fallbackResponse = await apiService.getDestinationImages(destination, limit);
            if (fallbackResponse.success) {
              setImages(fallbackResponse.data.images);
              return;
            }
          } catch (fallbackErr) {
            console.error('Fallback search also failed:', fallbackErr);
          }
        }
        
        // Don't show detailed error messages for auth issues to prevent info exposure
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

  // Auto-carousel effect - infinite loop through images
  useEffect(() => {
    if (images.length > 2) {
      const interval = setInterval(() => {
        setCurrentStartIndex(prev => (prev + 1) % images.length);
      }, 3000); // Change every 3 seconds

      return () => clearInterval(interval);
    }
  }, [images.length]);

  // Get 2 images to display (with wraparound)
  const getDisplayedImages = () => {
    if (images.length <= 2) {
      return images;
    }
    
    const displayed = [];
    for (let i = 0; i < 2; i++) {
      const index = (currentStartIndex + i) % images.length;
      displayed.push(images[index]);
    }
    return displayed;
  };

  if (loading) {
    return (
      <div className="image-gallery">
        <div className="gallery-grid-carousel">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="image-placeholder-carousel">
              <div className="loading-shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="image-gallery error">
        <div className="error-message">
          <span className="error-icon">🖼️</span>
          <p>Unable to load images</p>
          <small>{error}</small>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="image-gallery empty">
        <div className="empty-message">
          <span className="empty-icon">📸</span>
          <p>No images found</p>
        </div>
      </div>
    );
  }

  const displayedImages = getDisplayedImages();

  return (
    <div className="image-gallery">
      {images.length > 2 && (
        <div className="carousel-indicator">
          <span className="indicator-text">
            Showing {currentStartIndex + 1}-{Math.min(currentStartIndex + 2, images.length)} of {images.length}
          </span>
          <div className="indicator-dots">
            {Array.from({ length: images.length }).map((_, index) => (
              <div
                key={index}
                className={`dot ${index >= currentStartIndex && index < currentStartIndex + 2 ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="gallery-grid-carousel">
        {displayedImages.map((image, index) => (
          <div key={`${image.id}-${currentStartIndex}-${index}`} className="gallery-item-carousel">
            <div className="image-container-carousel">
              <img
                src={image.url}
                alt={image.altText}
                className="gallery-image-carousel"
                loading="lazy"
              />
              <div className="image-overlay-carousel">
                <div className="image-info-carousel">
                  <p className="image-description-carousel">{image.description || image.altText}</p>
                  <div className="photographer-credit-carousel">
                    <span>Photo by </span>
                    <a 
                      href={image.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="photographer-link-carousel"
                    >
                      {image.photographer.name}
                    </a>
                  </div>
                </div>
                <div className="image-actions-carousel">
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-full-btn-carousel"
                    title="View full size"
                  >
                    🔍
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;