import axios from 'axios';

interface MapboxGeocodingFeature {
  id: string;
  type: string;
  place_name: string;
  relevance: number;
  properties: Record<string, any>;
  text: string;
  place_type: string[];
  center: [number, number]; // [longitude, latitude]
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  address?: string;
  context?: Array<{
    id: string;
    short_code?: string;
    wikidata?: string;
    text: string;
  }>;
}

interface MapboxGeocodingResponse {
  type: string;
  query: string[];
  features: MapboxGeocodingFeature[];
  attribution: string;
}

export interface LocationResult {
  id: string;
  name: string;
  displayName: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  placeType: string[];
  relevance: number;
  address?: string;
  context: {
    country?: string;
    region?: string;
    district?: string;
    locality?: string;
  };
}

export interface RouteOptions {
  coordinates: Array<[number, number]>; // [longitude, latitude] pairs
  profile?: 'driving' | 'walking' | 'cycling';
  geometries?: 'geojson' | 'polyline' | 'polyline6';
  overview?: 'full' | 'simplified' | 'false';
}

export interface RouteResponse {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: any; // GeoJSON LineString
  legs: Array<{
    distance: number;
    duration: number;
    steps: Array<{
      distance: number;
      duration: number;
      geometry: any;
      name: string;
      mode: string;
    }>;
  }>;
}

class MapService {
  private accessToken: string;
  private baseUrl = 'https://api.mapbox.com';

  constructor() {
    this.accessToken = process.env.MAPBOX_ACCESS_TOKEN || '';
    if (!this.accessToken) {
      console.warn('Mapbox access token not configured');
    }
  }

  async geocodeLocation(query: string, limit: number = 5): Promise<LocationResult[]> {
    try {
      const response = await axios.get<MapboxGeocodingResponse>(
        `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
        {
          params: {
            access_token: this.accessToken,
            limit,
            types: 'country,region,district,postcode,locality,place,poi',
          },
        }
      );

      return response.data.features.map((feature) => {
        const context: LocationResult['context'] = {};
        
        if (feature.context) {
          feature.context.forEach((ctx) => {
            if (ctx.id.startsWith('country')) {
              context.country = ctx.text;
            } else if (ctx.id.startsWith('region')) {
              context.region = ctx.text;
            } else if (ctx.id.startsWith('district')) {
              context.district = ctx.text;
            } else if (ctx.id.startsWith('locality')) {
              context.locality = ctx.text;
            }
          });
        }

        return {
          id: feature.id,
          name: feature.text,
          displayName: feature.place_name,
          coordinates: {
            longitude: feature.center[0],
            latitude: feature.center[1],
          },
          placeType: feature.place_type,
          relevance: feature.relevance,
          address: feature.address,
          context,
        };
      });
    } catch (error: any) {
      console.error('Mapbox geocoding error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to geocode location'
      );
    }
  }

  async reverseGeocode(longitude: number, latitude: number): Promise<LocationResult | null> {
    try {
      const response = await axios.get<MapboxGeocodingResponse>(
        `${this.baseUrl}/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
        {
          params: {
            access_token: this.accessToken,
            types: 'country,region,district,postcode,locality,place,poi',
          },
        }
      );

      if (response.data.features.length === 0) {
        return null;
      }

      const feature = response.data.features[0];
      const context: LocationResult['context'] = {};
      
      if (feature.context) {
        feature.context.forEach((ctx) => {
          if (ctx.id.startsWith('country')) {
            context.country = ctx.text;
          } else if (ctx.id.startsWith('region')) {
            context.region = ctx.text;
          } else if (ctx.id.startsWith('district')) {
            context.district = ctx.text;
          } else if (ctx.id.startsWith('locality')) {
            context.locality = ctx.text;
          }
        });
      }

      return {
        id: feature.id,
        name: feature.text,
        displayName: feature.place_name,
        coordinates: {
          longitude: feature.center[0],
          latitude: feature.center[1],
        },
        placeType: feature.place_type,
        relevance: feature.relevance,
        address: feature.address,
        context,
      };
    } catch (error: any) {
      console.error('Mapbox reverse geocoding error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to reverse geocode location'
      );
    }
  }

  async getDirections(options: RouteOptions): Promise<RouteResponse> {
    try {
      const { coordinates, profile = 'driving', geometries = 'geojson', overview = 'full' } = options;
      
      if (coordinates.length < 2) {
        throw new Error('At least 2 coordinates are required for routing');
      }

      const coordinatesString = coordinates
        .map(coord => `${coord[0]},${coord[1]}`)
        .join(';');

      const response = await axios.get(
        `${this.baseUrl}/directions/v5/mapbox/${profile}/${coordinatesString}`,
        {
          params: {
            access_token: this.accessToken,
            geometries,
            overview,
            steps: true,
          },
        }
      );

      const route = response.data.routes[0];
      
      if (!route) {
        throw new Error('No route found');
      }

      return {
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry,
        legs: route.legs,
      };
    } catch (error: any) {
      console.error('Mapbox directions error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to get directions'
      );
    }
  }

  generateStaticMapUrl(
    longitude: number,
    latitude: number,
    zoom: number = 12,
    width: number = 600,
    height: number = 400,
    style: string = 'streets-v11'
  ): string {
    return `${this.baseUrl}/styles/v1/mapbox/${style}/static/pin-s+ff0000(${longitude},${latitude})/${longitude},${latitude},${zoom}/${width}x${height}?access_token=${this.accessToken}`;
  }

  generateStaticMapWithMultiplePoints(
    points: Array<{ longitude: number; latitude: number; color?: string; size?: 's' | 'm' | 'l' }>,
    zoom: number = 10,
    width: number = 600,
    height: number = 400,
    style: string = 'streets-v11'
  ): string {
    const markers = points
      .map(point => {
        const size = point.size || 's';
        const color = point.color || 'ff0000';
        return `pin-${size}+${color}(${point.longitude},${point.latitude})`;
      })
      .join(',');

    // Calculate center point
    const centerLon = points.reduce((sum, p) => sum + p.longitude, 0) / points.length;
    const centerLat = points.reduce((sum, p) => sum + p.latitude, 0) / points.length;

    return `${this.baseUrl}/styles/v1/mapbox/${style}/static/${markers}/${centerLon},${centerLat},${zoom}/${width}x${height}?access_token=${this.accessToken}`;
  }
}

export default new MapService();