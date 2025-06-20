// Simple test script to verify the best time database integration
const { Pool } = require('pg');

// Database configuration (update with your actual credentials)
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'wanderlog_best_time',
  password: 'your_password',
  port: 5432,
});

async function testBestTimeService() {
  try {
    console.log('🔍 Testing Best Time Database Integration...\n');

    // Test 1: Check if tables exist
    console.log('1. Checking database tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📊 Available tables:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    // Test 2: Check sample data
    console.log('\n2. Checking sample data...');
    const sampleData = await pool.query(`
      SELECT 
        c.name as city,
        co.name as country,
        bt.best_time_summary,
        bt.weather_summary
      FROM cities c
      JOIN countries co ON c.country_id = co.id
      LEFT JOIN location_best_times bt ON c.id = bt.city_id
      WHERE bt.best_time_summary IS NOT NULL
      LIMIT 5
    `);

    console.log('🌍 Sample destinations with best time data:');
    sampleData.rows.forEach(row => {
      console.log(`   - ${row.city}, ${row.country}: ${row.best_time_summary}`);
      console.log(`     Weather: ${row.weather_summary}\n`);
    });

    // Test 3: Test coordinate search
    console.log('3. Testing coordinate-based search (Paris area)...');
    const coordSearch = await pool.query(`
      SELECT 
        c.name as city,
        co.name as country,
        bt.best_time_summary,
        (6371 * acos(cos(radians(48.8566)) * cos(radians(c.latitude)) * 
         cos(radians(c.longitude) - radians(2.3522)) + 
         sin(radians(48.8566)) * sin(radians(c.latitude)))) AS distance
      FROM cities c
      JOIN countries co ON c.country_id = co.id
      LEFT JOIN location_best_times bt ON c.id = bt.city_id
      WHERE bt.best_time_summary IS NOT NULL
      HAVING distance < 100
      ORDER BY distance ASC
      LIMIT 3
    `);

    console.log('📍 Destinations near Paris (within 100km):');
    coordSearch.rows.forEach(row => {
      console.log(`   - ${row.city}, ${row.country} (${row.distance.toFixed(1)}km away)`);
      console.log(`     Best time: ${row.best_time_summary}\n`);
    });

    console.log('✅ Database integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.log('\n💡 To fix this:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Create the database: CREATE DATABASE wanderlog_best_time;');
    console.log('3. Run the migration: psql -d wanderlog_best_time -f database/migrations/create_locations_best_time.sql');
    console.log('4. Run the seed data: psql -d wanderlog_best_time -f database/seeds/seed_locations_best_time.sql');
    console.log('5. Update database credentials in this script');
  } finally {
    await pool.end();
  }
}

// Run the test
testBestTimeService();