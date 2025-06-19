import axios from 'axios';

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

export interface ImageSearchResult {
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

class ImageService {
  private accessKey: string;
  private baseUrl = 'https://api.unsplash.com';

  // Location-specific landmarks and keywords database
  private locationKeywords: Record<string, string[]> = {
    // Major cities with famous landmarks
    'paris': ['eiffel tower', 'louvre', 'notre dame', 'champs elysees', 'arc de triomphe', 'seine river'],
    'london': ['big ben', 'tower bridge', 'london eye', 'buckingham palace', 'westminster', 'thames'],
    'new york': ['statue of liberty', 'times square', 'central park', 'brooklyn bridge', 'manhattan', 'empire state'],
    'tokyo': ['mount fuji', 'shibuya crossing', 'tokyo tower', 'cherry blossom', 'temples', 'skyscrapers'],
    'rome': ['colosseum', 'vatican', 'trevi fountain', 'pantheon', 'spanish steps', 'forum'],
    'sydney': ['opera house', 'harbour bridge', 'bondi beach', 'circular quay', 'darling harbour'],
    'barcelona': ['sagrada familia', 'park guell', 'gothic quarter', 'las ramblas', 'gaudi'],
    'amsterdam': ['canals', 'tulips', 'windmills', 'bicycles', 'anne frank house', 'vondelpark'],
    'dubai': ['burj khalifa', 'palm jumeirah', 'desert', 'gold souk', 'marina', 'burj al arab'],
    'istanbul': ['hagia sophia', 'blue mosque', 'bosphorus', 'grand bazaar', 'galata tower'],
    'bangkok': ['temples', 'grand palace', 'floating market', 'tuk tuk', 'street food', 'wat arun'],
    'cairo': ['pyramids', 'sphinx', 'nile river', 'egyptian museum', 'islamic cairo'],
    'mumbai': ['gateway of india', 'marine drive', 'bollywood', 'chhatrapati shivaji', 'colaba'],
    'delhi': ['red fort', 'india gate', 'lotus temple', 'qutub minar', 'chandni chowk'],
    'singapore': ['marina bay sands', 'gardens by the bay', 'merlion', 'chinatown', 'sentosa'],
    'hong kong': ['victoria harbour', 'peak tram', 'dim sum', 'temple street', 'tsim sha tsui'],
    'beijing': ['great wall', 'forbidden city', 'tiananmen square', 'temple of heaven', 'hutongs'],
    'shanghai': ['the bund', 'oriental pearl tower', 'yu garden', 'french concession', 'pudong'],
    'rio de janeiro': ['christ the redeemer', 'copacabana', 'sugarloaf mountain', 'ipanema', 'carnival'],
    'buenos aires': ['tango', 'la boca', 'recoleta', 'palermo', 'puerto madero', 'eva peron'],
    'cape town': ['table mountain', 'waterfront', 'penguins', 'wine lands', 'robben island'],
    'marrakech': ['medina', 'souks', 'djemaa el fna', 'atlas mountains', 'riads', 'tagine'],
    'venice': ['grand canal', 'st marks square', 'gondolas', 'rialto bridge', 'murano', 'burano'],
    'santorini': ['blue domes', 'white buildings', 'sunset', 'volcanic cliffs', 'windmills', 'oia'],
    'bali': ['rice terraces', 'temples', 'beaches', 'uluwatu', 'ubud', 'volcanic mountains'],
    'machu picchu': ['inca ruins', 'andes mountains', 'llamas', 'ancient civilization', 'hiking'],
    'petra': ['rose city', 'treasury', 'monastery', 'desert', 'jordan', 'archaeological'],
    'angkor wat': ['cambodia', 'temples', 'jungle', 'sunrise', 'khmer architecture', 'siem reap'],
    'taj mahal': ['agra', 'white marble', 'mausoleum', 'love story', 'unesco', 'india'],
    
    // Indian cities - IMPORTANT for the Jaipur fix!
    'jaipur': ['amber fort', 'city palace', 'hawa mahal', 'pink city', 'jantar mantar', 'rajasthani architecture'],
    'agra': ['taj mahal', 'red fort', 'fatehpur sikri', 'mehtab bagh', 'marble', 'mughal architecture'],
    'varanasi': ['ganges river', 'ghats', 'golden temple', 'banaras', 'spiritual', 'hindu temples'],
    'goa': ['beaches', 'portuguese architecture', 'churches', 'coconut palm', 'seafood', 'carnival'],
    'kerala': ['backwaters', 'houseboat', 'spices', 'elephant', 'ayurveda', 'tea plantation'],
    'kolkata': ['victoria memorial', 'howrah bridge', 'durga puja', 'tram', 'bengali culture', 'park street'],
    'chennai': ['marina beach', 'kapaleeshwar temple', 'fort st george', 'tamil culture', 'south indian'],
    'hyderabad': ['charminar', 'golconda fort', 'biryani', 'hussain sagar', 'nizami architecture'],
    'pune': ['shaniwar wada', 'aga khan palace', 'sinhagad fort', 'university', 'maharashtrian culture'],
    'kochi': ['chinese fishing nets', 'fort kochi', 'spice market', 'backwaters', 'kerala culture'],
    'udaipur': ['city palace', 'lake pichola', 'jagmandir', 'city of lakes', 'rajasthani palaces'],
    'jodhpur': ['mehrangarh fort', 'blue city', 'umaid bhawan', 'rajasthani desert', 'camel'],
    'pushkar': ['brahma temple', 'pushkar lake', 'camel fair', 'rajasthani culture', 'desert'],
    'rishikesh': ['ganges river', 'yoga', 'adventure sports', 'temples', 'spiritual', 'himalayas'],
    'manali': ['manali himalayas', 'manali snow mountains', 'manali valley', 'solang valley', 'rohtang pass', 'himachal mountains'],
    'shimla': ['shimla himalayas', 'shimla mountains', 'shimla hill station', 'mall road shimla', 'shimla snow', 'himachal pradesh mountains'],
    
    // More international destinations
    'athens': ['acropolis', 'parthenon', 'ancient agora', 'plaka', 'olympic stadium', 'greek ruins'],
    'florence': ['duomo', 'uffizi gallery', 'ponte vecchio', 'renaissance art', 'tuscany', 'michelangelo'],
    'prague': ['charles bridge', 'prague castle', 'old town square', 'astronomical clock', 'bohemian'],
    'vienna': ['schonbrunn palace', 'st stephens cathedral', 'mozart', 'classical music', 'austrian'],
    'berlin': ['brandenburg gate', 'berlin wall', 'reichstag', 'museum island', 'german history'],
    'moscow': ['red square', 'kremlin', 'st basils cathedral', 'bolshoi theatre', 'russian architecture'],
    'st petersburg': ['hermitage museum', 'peterhof palace', 'church of spilled blood', 'russian imperial'],
    'edinburgh': ['edinburgh castle', 'royal mile', 'arthur seat', 'scottish highlands', 'bagpipes'],
    'dublin': ['trinity college', 'temple bar', 'guinness storehouse', 'irish culture', 'cliffs of moher'],
    'lisbon': ['belem tower', 'tram 28', 'portuguese tiles', 'fado music', 'pasteis de nata'],
    'madrid': ['prado museum', 'retiro park', 'royal palace', 'flamenco', 'spanish culture'],
    'stockholm': ['gamla stan', 'vasa museum', 'archipelago', 'nobel museum', 'scandinavian design'],
    'copenhagen': ['nyhavn', 'little mermaid', 'tivoli gardens', 'danish design', 'hygge'],
    'oslo': ['viking ship museum', 'opera house', 'fjords', 'northern lights', 'norwegian culture'],
    'reykjavik': ['blue lagoon', 'northern lights', 'geysir', 'iceland', 'volcanic landscape'],
    'zurich': ['swiss alps', 'lake zurich', 'chocolate', 'watches', 'banking'],
    'brussels': ['grand place', 'atomium', 'belgian waffles', 'chocolate', 'european union'],
    'budapest': ['parliament building', 'thermal baths', 'danube river', 'hungarian culture', 'buda castle'],
    'warsaw': ['old town', 'palace of culture', 'chopin', 'polish culture', 'solidarity'],
    'krakow': ['wawel castle', 'main market square', 'auschwitz', 'polish architecture', 'pierogi'],
  };

  // Country-specific keywords
  private countryKeywords: Record<string, string[]> = {
    'france': ['french', 'château', 'provence', 'normandy', 'wine', 'countryside'],
    'italy': ['italian', 'renaissance', 'tuscany', 'amalfi coast', 'pizza', 'vatican'],
    'spain': ['spanish', 'flamenco', 'andalusia', 'paella', 'moorish', 'costa del sol'],
    'japan': ['japanese', 'zen', 'cherry blossoms', 'temples', 'gardens', 'traditional'],
    'greece': ['greek', 'islands', 'ancient', 'mythology', 'mediterranean', 'ruins'],
    'egypt': ['ancient egypt', 'pharaohs', 'desert', 'archaeology', 'hieroglyphs'],
    'india': ['indian', 'spices', 'colors', 'spirituality', 'curry', 'monsoon', 'temples', 'palaces', 'forts', 'maharaja'],
    'china': ['chinese', 'dragons', 'silk road', 'tea', 'calligraphy', 'pagoda'],
    'thailand': ['thai', 'buddhist', 'tropical', 'elephants', 'golden', 'exotic'],
    'mexico': ['mexican', 'maya', 'aztec', 'tequila', 'colonial', 'vibrant'],
    'united kingdom': ['british', 'royal', 'castles', 'countryside', 'tea', 'red buses'],
    'germany': ['german', 'beer', 'oktoberfest', 'castles', 'christmas markets', 'architecture'],
    'netherlands': ['dutch', 'tulips', 'windmills', 'canals', 'bicycles', 'cheese'],
    'australia': ['australian', 'outback', 'kangaroos', 'beaches', 'coral reef', 'sydney'],
    'brazil': ['brazilian', 'samba', 'carnival', 'beaches', 'rainforest', 'football'],
    'russia': ['russian', 'orthodox', 'imperial', 'snow', 'vodka', 'ballet'],
    'canada': ['canadian', 'maple leaf', 'mountains', 'lakes', 'wildlife', 'snow'],
    'usa': ['american', 'skyscrapers', 'national parks', 'highways', 'landmarks', 'cities'],
    'turkey': ['turkish', 'ottoman', 'bazaars', 'carpets', 'minarets', 'bosphorus'],
    'morocco': ['moroccan', 'souks', 'tagine', 'desert', 'riads', 'atlas mountains'],
    'south africa': ['african', 'safari', 'wine', 'mountains', 'penguins', 'townships'],
    'argentina': ['argentinian', 'tango', 'wine', 'beef', 'pampas', 'andes'],
    'peru': ['peruvian', 'inca', 'llamas', 'andes', 'ruins', 'colorful'],
    'cambodia': ['cambodian', 'khmer', 'temples', 'jungle', 'monks', 'ancient'],
    'vietnam': ['vietnamese', 'rice paddies', 'boats', 'lanterns', 'street food', 'conical hats'],
    'indonesia': ['indonesian', 'tropical', 'temples', 'rice terraces', 'beaches', 'volcanoes'],
    'jordan': ['jordanian', 'desert', 'petra', 'ancient', 'bedouin', 'middle eastern'],
    'nepal': ['nepalese', 'himalayas', 'everest', 'monasteries', 'prayer flags', 'sherpa'],
    'sri lanka': ['sri lankan', 'tea plantations', 'elephants', 'buddhist', 'beaches', 'spices'],
    'myanmar': ['burmese', 'pagodas', 'temples', 'golden', 'monks', 'traditional'],
    'bhutan': ['bhutanese', 'himalayas', 'monasteries', 'gross national happiness', 'traditional', 'mountains'],
  };

  constructor() {
    this.accessKey = process.env.UNSPLASH_ACCESS_KEY || '';
    if (!this.accessKey) {
      console.warn('Unsplash access key not configured');
    }
  }

  private normalizeLocationName(location: string): string {
    return location
      .toLowerCase()
      .replace(/[,\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractCityAndCountry(destination: string): { city: string; country: string } {
    const parts = destination.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      return {
        city: parts[0].toLowerCase(),
        country: parts[parts.length - 1].toLowerCase()
      };
    }
    return {
      city: destination.toLowerCase(),
      country: ''
    };
  }

  private generateSearchQueries(destination: string): string[] {
    const { city, country } = this.extractCityAndCountry(destination);
    const normalizedCity = this.normalizeLocationName(city);
    const normalizedCountry = this.normalizeLocationName(country);
    
    const queries: string[] = [];

    // Strategy 1: Landmark-specific search (for known cities)
    const cityKeywords = this.locationKeywords[normalizedCity];
    if (cityKeywords && cityKeywords.length > 0) {
      cityKeywords.slice(0, 3).forEach(landmark => {
        queries.push(`${landmark} ${city}`);
        queries.push(`${city} ${landmark}`);
      });
    }

    // Strategy 2: Country-specific cultural keywords (for known countries)
    const countryKeywords = this.countryKeywords[normalizedCountry];
    if (countryKeywords && countryKeywords.length > 0) {
      const selectedKeywords = countryKeywords.slice(0, 2);
      selectedKeywords.forEach(keyword => {
        queries.push(`${city} ${keyword}`);
      });
    }

    // Strategy 3: Universal high-quality searches (works for ANY destination)
    queries.push(`${city} skyline view`);
    queries.push(`${city} famous landmarks`);
    queries.push(`${city} main attractions`);
    queries.push(`${city} historic center`);
    queries.push(`${city} downtown area`);
    queries.push(`${city} old town`);
    
    // Strategy 4: Geographic context searches
    if (country) {
      queries.push(`${city} ${country} landmarks`);
      queries.push(`${city} ${country} attractions`);
      queries.push(`${city} ${country} tourism`);
      queries.push(`${country} ${city} scenic`);
    }
    
    // Strategy 5: High-quality travel photography terms
    queries.push(`${city} travel destination`);
    queries.push(`${city} tourist spots`);
    queries.push(`${city} must visit places`);
    queries.push(`${city} scenic views`);
    queries.push(`${city} beautiful places`);
    
    // Strategy 6: Architecture and urban planning
    queries.push(`${city} architecture`);
    queries.push(`${city} buildings`);
    queries.push(`${city} street view`);
    queries.push(`${city} city center`);

    // Strategy 7: Simple but effective fallbacks
    queries.push(`${destination} photography`);
    queries.push(`${destination} travel`);
    queries.push(`${city} photos`);

    return queries;
  }

  private async searchWithFallback(queries: string[], perPage: number = 6): Promise<ImageSearchResult[]> {
    for (const query of queries) {
      try {
        console.log(`Trying search query: "${query}"`);
        const result = await this.searchImages(query, 1, perPage);
        
        // Check if we got meaningful results
        if (result.images.length > 0) {
          console.log(`Found ${result.images.length} images for query: "${query}"`);
          return result.images;
        }
      } catch (error) {
        console.warn(`Search failed for query "${query}":`, error);
        continue;
      }
    }
    
    // If all searches fail, return empty array
    console.warn('All search queries failed');
    return [];
  }

  async searchImages(
    query: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<{
    images: ImageSearchResult[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await axios.get<UnsplashSearchResponse>(
        `${this.baseUrl}/search/photos`,
        {
          params: {
            query,
            page,
            per_page: perPage,
            orientation: 'landscape',
          },
          headers: {
            Authorization: `Client-ID ${this.accessKey}`,
          },
        }
      );

      const images: ImageSearchResult[] = response.data.results.map((photo) => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnailUrl: photo.urls.small,
        altText: photo.alt_description || photo.description || query,
        description: photo.description || photo.alt_description || '',
        photographer: {
          name: photo.user.name,
          username: photo.user.username,
        },
        sourceUrl: photo.links.html,
      }));

      return {
        images,
        total: response.data.total,
        totalPages: response.data.total_pages,
      };
    } catch (error: any) {
      console.error('Unsplash API error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.errors?.[0] || 'Failed to search images'
      );
    }
  }

  async getDestinationImages(destination: string, limit: number = 6): Promise<ImageSearchResult[]> {
    try {
      console.log(`Getting destination images for: ${destination} (limit: ${limit})`);
      
      // Generate multiple search strategies
      const searchQueries = this.generateSearchQueries(destination);
      
      // Try searches with fallback mechanism
      const images = await this.searchWithFallback(searchQueries, limit);
      
      console.log(`Successfully retrieved ${images.length} images for ${destination}`);
      return images;
    } catch (error) {
      console.error(`Failed to get images for ${destination}:`, error);
      return [];
    }
  }

  async searchDestinationImages(
    destination: string, 
    page: number = 1, 
    perPage: number = 6
  ): Promise<{
    images: ImageSearchResult[];
    total: number;
    totalPages: number;
    searchStrategy: string;
  }> {
    try {
      console.log(`Searching destination images for: ${destination} (page ${page})`);
      
      const searchQueries = this.generateSearchQueries(destination);
      
      // Try each search strategy and return the first successful one
      for (let i = 0; i < searchQueries.length; i++) {
        const query = searchQueries[i];
        try {
          console.log(`Trying search strategy ${i + 1}: "${query}"`);
          const result = await this.searchImages(query, page, perPage);
          
          if (result.images.length > 0) {
            console.log(`Success with strategy ${i + 1}: Found ${result.images.length} images`);
            return {
              ...result,
              searchStrategy: query
            };
          }
        } catch (error) {
          console.warn(`Strategy ${i + 1} failed for "${query}":`, error);
          continue;
        }
      }
      
      // If all strategies fail, return empty result
      console.warn(`All search strategies failed for ${destination}`);
      return {
        images: [],
        total: 0,
        totalPages: 0,
        searchStrategy: 'none'
      };
    } catch (error) {
      console.error(`Failed to search destination images for ${destination}:`, error);
      throw error;
    }
  }

  async getRandomPhoto(query?: string): Promise<ImageSearchResult | null> {
    try {
      const response = await axios.get<UnsplashPhoto>(
        `${this.baseUrl}/photos/random`,
        {
          params: {
            query: query || 'travel',
            orientation: 'landscape',
          },
          headers: {
            Authorization: `Client-ID ${this.accessKey}`,
          },
        }
      );

      return {
        id: response.data.id,
        url: response.data.urls.regular,
        thumbnailUrl: response.data.urls.small,
        altText: response.data.alt_description || response.data.description || 'Travel photo',
        description: response.data.description || response.data.alt_description || '',
        photographer: {
          name: response.data.user.name,
          username: response.data.user.username,
        },
        sourceUrl: response.data.links.html,
      };
    } catch (error: any) {
      console.error('Unsplash random photo error:', error.response?.data || error.message);
      return null;
    }
  }
}

export default new ImageService();