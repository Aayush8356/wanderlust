const axios = require('axios');

const API_KEY = 'uszpEhL5G_a2njPHBC-W292kQsHVzATaaU0KXYkx9b4';

// Location-specific landmarks and keywords database
const locationKeywords = {
  'paris': ['eiffel tower', 'louvre', 'notre dame', 'champs elysees', 'arc de triomphe', 'seine river'],
  'london': ['big ben', 'tower bridge', 'london eye', 'buckingham palace', 'westminster', 'thames'],
  'new york': ['statue of liberty', 'times square', 'central park', 'brooklyn bridge', 'manhattan', 'empire state'],
  'tokyo': ['mount fuji', 'shibuya crossing', 'tokyo tower', 'cherry blossom', 'temples', 'skyscrapers'],
  'rome': ['colosseum', 'vatican', 'trevi fountain', 'pantheon', 'spanish steps', 'forum'],
  'sydney': ['opera house', 'harbour bridge', 'bondi beach', 'circular quay', 'darling harbour'],
};

const countryKeywords = {
  'france': ['french', 'château', 'provence', 'normandy', 'wine', 'countryside'],
  'italy': ['italian', 'renaissance', 'tuscany', 'amalfi coast', 'pizza', 'vatican'],
  'japan': ['japanese', 'zen', 'cherry blossoms', 'temples', 'gardens', 'traditional'],
  'greece': ['greek', 'islands', 'ancient', 'mythology', 'mediterranean', 'ruins'],
};

function extractCityAndCountry(destination) {
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

function generateSearchQueries(destination) {
  const { city, country } = extractCityAndCountry(destination);
  const normalizedCity = city.replace(/[,\-]/g, ' ').replace(/\s+/g, ' ').trim();
  const normalizedCountry = country.replace(/[,\-]/g, ' ').replace(/\s+/g, ' ').trim();
  
  const queries = [];

  // Strategy 1: Landmark-specific search
  const cityKeywords = locationKeywords[normalizedCity];
  if (cityKeywords && cityKeywords.length > 0) {
    cityKeywords.slice(0, 3).forEach(landmark => {
      queries.push(`${landmark} ${city}`);
      queries.push(`${city} ${landmark}`);
    });
  }

  // Strategy 2: Country-specific cultural keywords
  const countryKeywords_list = countryKeywords[normalizedCountry];
  if (countryKeywords_list && countryKeywords_list.length > 0) {
    countryKeywords_list.slice(0, 2).forEach(keyword => {
      queries.push(`${city} ${keyword}`);
    });
  }

  // Strategy 3: Location with travel context
  queries.push(`${city} travel photography`);
  queries.push(`${city} tourism attractions`);
  queries.push(`${city} cityscape architecture`);

  // Strategy 4: Fallback generic searches
  if (country) {
    queries.push(`${city} ${country} destination`);
    queries.push(`${country} travel`);
  }
  queries.push(`${destination} landmark`);
  queries.push(`${destination} travel`);

  return queries;
}

async function searchImages(query) {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        page: 1,
        per_page: 3,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': `Client-ID ${API_KEY}`
      }
    });
    return response.data.results;
  } catch (error) {
    console.error(`Search failed for "${query}":`, error.response?.data || error.message);
    return [];
  }
}

async function testEnhancedDestinationSearch(destination) {
  console.log(`\n🔍 Testing Enhanced Image Search for: ${destination}`);
  console.log('=' .repeat(60));
  
  const searchQueries = generateSearchQueries(destination);
  console.log(`Generated ${searchQueries.length} search strategies:`);
  searchQueries.forEach((query, index) => {
    console.log(`  ${index + 1}. "${query}"`);
  });
  
  console.log('\n🎯 Trying search strategies...');
  
  // Try each search strategy
  for (let i = 0; i < Math.min(searchQueries.length, 3); i++) {
    const query = searchQueries[i];
    console.log(`\n📸 Strategy ${i + 1}: "${query}"`);
    
    const images = await searchImages(query);
    
    if (images.length > 0) {
      console.log(`✅ SUCCESS! Found ${images.length} relevant images:`);
      images.forEach((photo, idx) => {
        console.log(`  ${idx + 1}. ${photo.alt_description || photo.description || 'No description'}`);
        console.log(`     By: ${photo.user.name}`);
      });
      return images;
    } else {
      console.log(`❌ No images found for this strategy`);
    }
  }
  
  console.log('⚠️ All strategies failed');
  return [];
}

// Test multiple destinations
async function runDemo() {
  const destinations = [
    'Paris, France',
    'Tokyo, Japan', 
    'Rome, Italy',
    'Sydney, Australia'
  ];
  
  console.log('🌍 WanderLog Enhanced Image Search Demo');
  console.log('This demonstrates how the enhanced search finds relevant images for destinations');
  
  for (const destination of destinations) {
    await testEnhancedDestinationSearch(destination);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
  }
}

runDemo();