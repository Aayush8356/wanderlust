-- =====================================================
-- WanderLog Location Best Time Database Schema
-- =====================================================

-- Table: countries
-- Stores country information
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code_alpha2 CHAR(2) NOT NULL UNIQUE, -- US, FR, JP
    code_alpha3 CHAR(3) NOT NULL UNIQUE, -- USA, FRA, JPN
    continent VARCHAR(50) NOT NULL,
    timezone_primary VARCHAR(50),
    currency_code CHAR(3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: regions
-- Stores state/province/region information
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    region_type VARCHAR(20), -- state, province, region, prefecture
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, country_id)
);

-- Table: cities
-- Stores city/location information
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    region_id INTEGER REFERENCES regions(id) ON DELETE SET NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    elevation_meters INTEGER,
    population INTEGER,
    timezone VARCHAR(50),
    is_capital BOOLEAN DEFAULT FALSE,
    is_tourist_destination BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: climate_zones
-- Stores climate classification
CREATE TABLE climate_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- Tropical, Temperate, Desert, etc.
    koppen_code VARCHAR(10), -- Köppen climate classification
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: location_climate_data
-- Stores monthly climate averages for each location
CREATE TABLE location_climate_data (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
    climate_zone_id INTEGER REFERENCES climate_zones(id),
    month INTEGER CHECK (month >= 1 AND month <= 12),
    avg_temp_celsius DECIMAL(4, 1),
    avg_high_celsius DECIMAL(4, 1),
    avg_low_celsius DECIMAL(4, 1),
    avg_rainfall_mm DECIMAL(6, 2),
    avg_humidity_percent INTEGER,
    avg_wind_speed_kmh DECIMAL(4, 1),
    avg_sunshine_hours DECIMAL(4, 1),
    avg_rainy_days INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(city_id, month)
);

-- Table: tourism_seasons
-- Stores tourism season classifications
CREATE TABLE tourism_seasons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE, -- Peak, High, Shoulder, Low, Off
    description TEXT,
    price_multiplier DECIMAL(3, 2) DEFAULT 1.00, -- 1.5 = 50% more expensive
    crowd_level INTEGER CHECK (crowd_level >= 1 AND crowd_level <= 5) -- 1=very low, 5=very high
);

-- Table: location_best_times
-- Main table storing best time recommendations
CREATE TABLE location_best_times (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
    
    -- Best time periods
    best_months INTEGER[] NOT NULL, -- Array: [4,5,6,9,10] for Apr,May,Jun,Sep,Oct
    peak_months INTEGER[], -- Busiest tourist months
    avoid_months INTEGER[], -- Months to avoid
    
    -- Seasonal descriptions
    best_time_summary VARCHAR(100), -- "April to October"
    weather_summary TEXT, -- "Mild temperatures, low rainfall"
    tourist_summary TEXT, -- "Moderate crowds, good prices"
    
    -- Specific recommendations
    best_for_weather INTEGER[], -- Months with best weather
    best_for_crowds INTEGER[], -- Months with fewer crowds  
    best_for_prices INTEGER[], -- Months with better prices
    
    -- Special considerations
    monsoon_months INTEGER[],
    hurricane_season INTEGER[],
    winter_months INTEGER[],
    festival_months INTEGER[],
    
    -- Additional info
    ideal_trip_duration_days INTEGER, -- Recommended stay duration
    notes TEXT,
    data_confidence DECIMAL(3, 2) DEFAULT 0.80, -- Confidence score 0-1
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(city_id)
);

-- Table: monthly_tourism_data
-- Stores monthly tourism statistics for locations
CREATE TABLE monthly_tourism_data (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
    month INTEGER CHECK (month >= 1 AND month <= 12),
    tourism_season_id INTEGER REFERENCES tourism_seasons(id),
    visitor_volume_score INTEGER CHECK (visitor_volume_score >= 1 AND visitor_volume_score <= 10),
    price_index DECIMAL(4, 2), -- Relative price index (100 = baseline)
    hotel_occupancy_percent INTEGER,
    flight_price_index DECIMAL(4, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(city_id, month)
);

-- Table: location_activities
-- Stores seasonal activities for locations
CREATE TABLE location_activities (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
    activity_name VARCHAR(100) NOT NULL,
    activity_type VARCHAR(50), -- sightseeing, outdoor, cultural, beach, skiing
    best_months INTEGER[], -- When this activity is best
    available_months INTEGER[], -- When this activity is available
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: weather_events
-- Stores information about weather events/seasons
CREATE TABLE weather_events (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- typhoon, monsoon, dry_season, etc.
    start_month INTEGER CHECK (start_month >= 1 AND start_month <= 12),
    end_month INTEGER CHECK (end_month >= 1 AND end_month <= 12),
    intensity VARCHAR(20), -- light, moderate, heavy, severe
    impact_on_tourism VARCHAR(20), -- minimal, moderate, significant, severe
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================

-- Location indexes
CREATE INDEX idx_cities_country ON cities(country_id);
CREATE INDEX idx_cities_region ON cities(region_id);
CREATE INDEX idx_cities_coordinates ON cities(latitude, longitude);
CREATE INDEX idx_cities_tourist ON cities(is_tourist_destination);

-- Climate data indexes
CREATE INDEX idx_climate_data_city ON location_climate_data(city_id);
CREATE INDEX idx_climate_data_month ON location_climate_data(month);
CREATE INDEX idx_climate_data_city_month ON location_climate_data(city_id, month);

-- Best time indexes
CREATE INDEX idx_best_times_city ON location_best_times(city_id);
CREATE INDEX idx_best_times_months ON location_best_times USING GIN(best_months);

-- Tourism data indexes
CREATE INDEX idx_tourism_data_city ON monthly_tourism_data(city_id);
CREATE INDEX idx_tourism_data_month ON monthly_tourism_data(month);

-- Activities indexes
CREATE INDEX idx_activities_city ON location_activities(city_id);
CREATE INDEX idx_activities_type ON location_activities(activity_type);
CREATE INDEX idx_activities_months ON location_activities USING GIN(best_months);

-- Weather events indexes
CREATE INDEX idx_weather_events_city ON weather_events(city_id);
CREATE INDEX idx_weather_events_type ON weather_events(event_type);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON cities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_best_times_updated_at BEFORE UPDATE ON location_best_times
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS for easier querying
-- =====================================================

-- View: complete_location_info
-- Combines location and best time information
CREATE VIEW complete_location_info AS
SELECT 
    c.id as city_id,
    c.name as city_name,
    c.latitude,
    c.longitude,
    r.name as region_name,
    co.name as country_name,
    co.code_alpha2 as country_code,
    co.continent,
    bt.best_months,
    bt.best_time_summary,
    bt.weather_summary,
    bt.tourist_summary,
    bt.ideal_trip_duration_days,
    bt.data_confidence
FROM cities c
LEFT JOIN regions r ON c.region_id = r.id
LEFT JOIN countries co ON c.country_id = co.id
LEFT JOIN location_best_times bt ON c.id = bt.city_id;

-- View: monthly_location_data
-- Combines climate and tourism data by month
CREATE VIEW monthly_location_data AS
SELECT 
    c.id as city_id,
    c.name as city_name,
    co.name as country_name,
    lcd.month,
    lcd.avg_temp_celsius,
    lcd.avg_rainfall_mm,
    lcd.avg_humidity_percent,
    mtd.visitor_volume_score,
    mtd.price_index,
    ts.name as tourism_season
FROM cities c
LEFT JOIN countries co ON c.country_id = co.id
LEFT JOIN location_climate_data lcd ON c.id = lcd.city_id
LEFT JOIN monthly_tourism_data mtd ON c.id = mtd.city_id AND lcd.month = mtd.month
LEFT JOIN tourism_seasons ts ON mtd.tourism_season_id = ts.id;