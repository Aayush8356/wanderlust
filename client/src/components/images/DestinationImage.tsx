import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

interface DestinationImageProps {
  destination: string;
  className?: string;
}

const DestinationImage: React.FC<DestinationImageProps> = ({ 
  destination, 
  className = '' 
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);
        setImage(null);
        
        const response = await apiService.searchDestinationImages(destination, 1, 1);
        
        if (response.success && response.data.images.length > 0) {
          setImage(response.data.images[0].url);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch destination image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (destination) {
      fetchImage();
    }
  }, [destination]);

  if (loading) {
    return (
      <div className={`destination-image-loading ${className}`}>
        <div className="loading-shimmer"></div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className={`destination-image-error ${className}`}>
        <div className="error-content">
          <span className="error-icon">🌍</span>
          <span className="error-text">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={`Beautiful view of ${destination}`}
      className={`destination-image ${className}`}
      loading="lazy"
    />
  );
};

export default DestinationImage;