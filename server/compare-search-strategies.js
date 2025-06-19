const axios = require('axios');

const API_KEY = 'uszpEhL5G_a2njPHBC-W292kQsHVzATaaU0KXYkx9b4';

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

async function compareSearchStrategies() {
  console.log('🔍 Comparing Search Strategies for Jaipur');
  console.log('=' .repeat(60));
  
  // Old strategy (what might be causing the issue)
  const oldQuery = 'Jaipur travel destination landscape architecture';
  console.log(`\n❌ OLD STRATEGY: "${oldQuery}"`);
  const oldResults = await searchImages(oldQuery);
  
  if (oldResults.length > 0) {
    console.log(`Found ${oldResults.length} images:`);
    oldResults.forEach((photo, idx) => {
      console.log(`  ${idx + 1}. ${photo.alt_description || photo.description || 'No description'}`);
    });
  } else {
    console.log('No images found');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // New enhanced strategy
  const newQuery = 'amber fort jaipur';
  console.log(`\n✅ NEW STRATEGY: "${newQuery}"`);
  const newResults = await searchImages(newQuery);
  
  if (newResults.length > 0) {
    console.log(`Found ${newResults.length} images:`);
    newResults.forEach((photo, idx) => {
      console.log(`  ${idx + 1}. ${photo.alt_description || photo.description || 'No description'}`);
    });
  } else {
    console.log('No images found');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test what the user might have seen (manual search)
  const manualQuery = 'jaipur india';
  console.log(`\n🔍 SIMPLE SEARCH: "${manualQuery}"`);
  const manualResults = await searchImages(manualQuery);
  
  if (manualResults.length > 0) {
    console.log(`Found ${manualResults.length} images:`);
    manualResults.forEach((photo, idx) => {
      console.log(`  ${idx + 1}. ${photo.alt_description || photo.description || 'No description'}`);
    });
  } else {
    console.log('No images found');
  }
  
  // Test the exact search that might be happening in the broken UI
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const uiQuery = 'Jaipur, Rajasthan, India travel destination landscape';
  console.log(`\n⚠️ CURRENT UI SEARCH: "${uiQuery}"`);
  const uiResults = await searchImages(uiQuery);
  
  if (uiResults.length > 0) {
    console.log(`Found ${uiResults.length} images:`);
    uiResults.forEach((photo, idx) => {
      console.log(`  ${idx + 1}. ${photo.alt_description || photo.description || 'No description'}`);
    });
  } else {
    console.log('No images found');
  }
}

compareSearchStrategies();