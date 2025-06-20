-- =====================================================
-- WanderLog Location Best Time Database - Seed Data
-- =====================================================

-- Insert Tourism Seasons
INSERT INTO tourism_seasons (name, description, price_multiplier, crowd_level) VALUES
('Peak', 'Highest tourist activity, best weather, most expensive', 1.50, 5),
('High', 'High tourist activity, good weather, expensive', 1.25, 4),
('Shoulder', 'Moderate tourist activity, decent weather, reasonable prices', 1.00, 3),
('Low', 'Lower tourist activity, variable weather, good prices', 0.80, 2),
('Off', 'Lowest tourist activity, challenging weather, best prices', 0.60, 1);

-- Insert Climate Zones
INSERT INTO climate_zones (name, koppen_code, description) VALUES
('Tropical', 'A', 'Hot and humid year-round with wet and dry seasons'),
('Mediterranean', 'Csa', 'Hot dry summers, mild wet winters'),
('Temperate Oceanic', 'Cfb', 'Mild temperatures, rainfall throughout year'),
('Continental', 'Dfa', 'Hot summers, cold winters, moderate rainfall'),
('Subtropical', 'Cfa', 'Hot humid summers, mild winters'),
('Desert', 'BWh', 'Very hot and dry with minimal rainfall'),
('Semi-Arid', 'BSh', 'Hot and dry with some seasonal rainfall'),
('Alpine', 'ET', 'Cold temperatures, short summers'),
('Monsoon', 'Am', 'Tropical with distinct wet and dry seasons');

-- Insert Countries
INSERT INTO countries (name, code_alpha2, code_alpha3, continent, timezone_primary, currency_code) VALUES
('France', 'FR', 'FRA', 'Europe', 'Europe/Paris', 'EUR'),
('Japan', 'JP', 'JPN', 'Asia', 'Asia/Tokyo', 'JPY'),
('Greece', 'GR', 'GRC', 'Europe', 'Europe/Athens', 'EUR'),
('United States', 'US', 'USA', 'North America', 'America/New_York', 'USD'),
('Indonesia', 'ID', 'IDN', 'Asia', 'Asia/Jakarta', 'IDR'),
('United Arab Emirates', 'AE', 'ARE', 'Asia', 'Asia/Dubai', 'AED'),
('Italy', 'IT', 'ITA', 'Europe', 'Europe/Rome', 'EUR'),
('Thailand', 'TH', 'THA', 'Asia', 'Asia/Bangkok', 'THB'),
('United Kingdom', 'GB', 'GBR', 'Europe', 'Europe/London', 'GBP'),
('India', 'IN', 'IND', 'Asia', 'Asia/Kolkata', 'INR'),
('Nepal', 'NP', 'NPL', 'Asia', 'Asia/Kathmandu', 'NPR'),
('Turkey', 'TR', 'TUR', 'Europe', 'Europe/Istanbul', 'TRY'),
('Egypt', 'EG', 'EGY', 'Africa', 'Africa/Cairo', 'EGP'),
('Brazil', 'BR', 'BRA', 'South America', 'America/Sao_Paulo', 'BRL'),
('Australia', 'AU', 'AUS', 'Oceania', 'Australia/Sydney', 'AUD'),
('Canada', 'CA', 'CAN', 'North America', 'America/Toronto', 'CAD'),
('Mexico', 'MX', 'MEX', 'North America', 'America/Mexico_City', 'MXN'),
('Spain', 'ES', 'ESP', 'Europe', 'Europe/Madrid', 'EUR'),
('Portugal', 'PT', 'PRT', 'Europe', 'Europe/Lisbon', 'EUR'),
('Morocco', 'MA', 'MAR', 'Africa', 'Africa/Casablanca', 'MAD');

-- Insert Regions
INSERT INTO regions (name, country_id, region_type) VALUES
('Île-de-France', 1, 'region'),
('Tokyo Prefecture', 2, 'prefecture'),
('Attica', 3, 'region'),
('New York', 4, 'state'),
('Bali', 5, 'province'),
('Dubai', 6, 'emirate'),
('Lazio', 7, 'region'),
('Bangkok', 8, 'province'),
('England', 9, 'country'),
('Delhi', 10, 'territory'),
('Bagmati', 11, 'province'),
('Istanbul', 12, 'province'),
('Cairo', 13, 'governorate'),
('São Paulo', 14, 'state'),
('New South Wales', 15, 'state'),
('Ontario', 16, 'province'),
('Mexico City', 17, 'federal_district'),
('Madrid', 18, 'community'),
('Lisbon', 19, 'district'),
('Casablanca-Settat', 20, 'region');

-- Insert Cities
INSERT INTO cities (name, country_id, region_id, latitude, longitude, elevation_meters, population, timezone, is_capital, is_tourist_destination) VALUES
('Paris', 1, 1, 48.8566, 2.3522, 35, 2165000, 'Europe/Paris', TRUE, TRUE),
('Tokyo', 2, 2, 35.6762, 139.6503, 40, 13960000, 'Asia/Tokyo', TRUE, TRUE),
('Santorini', 3, 3, 36.3932, 25.4615, 250, 15500, 'Europe/Athens', FALSE, TRUE),
('New York', 4, 4, 40.7128, -74.0060, 10, 8336000, 'America/New_York', FALSE, TRUE),
('Bali', 5, 5, -8.3405, 115.0920, 500, 4300000, 'Asia/Makassar', FALSE, TRUE),
('Dubai', 6, 6, 25.2048, 55.2708, 5, 3400000, 'Asia/Dubai', FALSE, TRUE),
('Rome', 7, 7, 41.9028, 12.4964, 21, 2870000, 'Europe/Rome', TRUE, TRUE),
('Bangkok', 8, 8, 13.7563, 100.5018, 2, 10500000, 'Asia/Bangkok', TRUE, TRUE),
('London', 9, 9, 51.5074, -0.1278, 35, 9000000, 'Europe/London', TRUE, TRUE),
('Mumbai', 10, 10, 19.0760, 72.8777, 14, 20400000, 'Asia/Kolkata', FALSE, TRUE),
('Kathmandu', 11, 11, 27.7172, 85.3240, 1400, 1000000, 'Asia/Kathmandu', TRUE, TRUE),
('Istanbul', 12, 12, 41.0082, 28.9784, 39, 15460000, 'Europe/Istanbul', FALSE, TRUE),
('Cairo', 13, 13, 30.0444, 31.2357, 74, 20900000, 'Africa/Cairo', TRUE, TRUE),
('Rio de Janeiro', 14, 14, -22.9068, -43.1729, 2, 6700000, 'America/Sao_Paulo', FALSE, TRUE),
('Sydney', 15, 15, -33.8688, 151.2093, 58, 5300000, 'Australia/Sydney', FALSE, TRUE),
('Toronto', 16, 16, 43.6532, -79.3832, 76, 2930000, 'America/Toronto', FALSE, TRUE),
('Mexico City', 17, 17, 19.4326, -99.1332, 2240, 21600000, 'America/Mexico_City', TRUE, TRUE),
('Barcelona', 18, 18, 41.3851, 2.1734, 12, 1620000, 'Europe/Madrid', FALSE, TRUE),
('Lisbon', 19, 19, 38.7223, -9.1393, 2, 547000, 'Europe/Lisbon', TRUE, TRUE),
('Marrakech', 20, 20, 31.6295, -7.9811, 466, 930000, 'Africa/Casablanca', FALSE, TRUE);

-- Insert Climate Data for each city (12 months each)
-- Paris Climate Data
INSERT INTO location_climate_data (city_id, climate_zone_id, month, avg_temp_celsius, avg_high_celsius, avg_low_celsius, avg_rainfall_mm, avg_humidity_percent, avg_wind_speed_kmh, avg_sunshine_hours, avg_rainy_days) VALUES
(1, 3, 1, 4.2, 7.0, 1.4, 51, 81, 15, 2.1, 10),
(1, 3, 2, 5.3, 8.8, 1.8, 41, 78, 16, 3.0, 9),
(1, 3, 3, 8.2, 12.8, 3.6, 48, 73, 17, 4.2, 10),
(1, 3, 4, 11.1, 16.2, 6.0, 53, 70, 16, 5.4, 9),
(1, 3, 5, 15.2, 20.1, 10.3, 65, 69, 15, 6.6, 10),
(1, 3, 6, 18.4, 23.2, 13.6, 54, 68, 14, 7.1, 8),
(1, 3, 7, 20.5, 25.2, 15.8, 63, 68, 14, 7.2, 8),
(1, 3, 8, 20.3, 25.0, 15.6, 54, 69, 14, 6.5, 7),
(1, 3, 9, 16.8, 21.4, 12.2, 54, 73, 15, 5.2, 8),
(1, 3, 10, 12.7, 16.8, 8.6, 60, 78, 16, 3.7, 10),
(1, 3, 11, 7.8, 11.1, 4.5, 52, 81, 16, 2.3, 10),
(1, 3, 12, 5.1, 8.2, 2.0, 59, 82, 16, 1.8, 11);

-- Tokyo Climate Data
INSERT INTO location_climate_data (city_id, climate_zone_id, month, avg_temp_celsius, avg_high_celsius, avg_low_celsius, avg_rainfall_mm, avg_humidity_percent, avg_wind_speed_kmh, avg_sunshine_hours, avg_rainy_days) VALUES
(2, 5, 1, 5.2, 9.9, 0.9, 52, 51, 16, 6.1, 5),
(2, 5, 2, 5.7, 10.4, 1.7, 56, 53, 16, 6.0, 6),
(2, 5, 3, 8.7, 13.6, 4.4, 118, 56, 16, 5.5, 10),
(2, 5, 4, 14.6, 19.0, 10.9, 125, 62, 15, 5.6, 10),
(2, 5, 5, 19.0, 23.4, 15.4, 138, 67, 14, 5.4, 10),
(2, 5, 6, 22.0, 25.9, 19.1, 168, 75, 13, 4.2, 12),
(2, 5, 7, 25.8, 29.2, 23.0, 154, 78, 13, 4.8, 10),
(2, 5, 8, 27.4, 30.8, 24.5, 168, 77, 13, 5.8, 8),
(2, 5, 9, 23.8, 27.2, 21.1, 210, 74, 14, 4.4, 11),
(2, 5, 10, 18.5, 22.5, 15.4, 198, 65, 14, 4.8, 10),
(2, 5, 11, 12.6, 17.1, 8.3, 93, 59, 15, 5.2, 6),
(2, 5, 12, 7.6, 12.4, 3.5, 51, 56, 16, 5.8, 4);

-- Dubai Climate Data
INSERT INTO location_climate_data (city_id, climate_zone_id, month, avg_temp_celsius, avg_high_celsius, avg_low_celsius, avg_rainfall_mm, avg_humidity_percent, avg_wind_speed_kmh, avg_sunshine_hours, avg_rainy_days) VALUES
(6, 6, 1, 19.4, 24.5, 14.3, 11, 65, 12, 8.1, 2),
(6, 6, 2, 21.2, 26.2, 16.1, 25, 65, 13, 8.2, 3),
(6, 6, 3, 24.5, 29.3, 19.6, 21, 64, 14, 8.0, 3),
(6, 6, 4, 28.7, 33.7, 23.7, 8, 61, 15, 9.2, 1),
(6, 6, 5, 33.2, 38.7, 27.7, 1, 58, 16, 10.5, 0),
(6, 6, 6, 35.5, 40.6, 30.4, 0, 59, 17, 10.8, 0),
(6, 6, 7, 37.0, 41.4, 32.5, 1, 60, 17, 10.4, 0),
(6, 6, 8, 37.5, 41.8, 33.2, 1, 62, 16, 10.1, 0),
(6, 6, 9, 34.4, 39.1, 29.7, 1, 64, 14, 9.4, 0),
(6, 6, 10, 30.5, 35.6, 25.4, 1, 64, 13, 9.5, 0),
(6, 6, 11, 25.8, 30.8, 20.8, 3, 65, 12, 8.8, 1),
(6, 6, 12, 21.4, 26.4, 16.3, 15, 66, 12, 8.0, 2);

-- Insert Best Time Data for major destinations
INSERT INTO location_best_times (
    city_id, best_months, peak_months, avoid_months, 
    best_time_summary, weather_summary, tourist_summary,
    best_for_weather, best_for_crowds, best_for_prices,
    monsoon_months, winter_months, ideal_trip_duration_days, 
    notes, data_confidence
) VALUES
-- Paris
(1, ARRAY[4,5,6,9,10], ARRAY[6,7,8], ARRAY[12,1,2], 
 'April to October', 
 'Mild temperatures, moderate rainfall, pleasant for walking',
 'Moderate to high crowds, higher prices in summer',
 ARRAY[5,6,9,10], ARRAY[3,4,11], ARRAY[1,2,11,12],
 NULL, ARRAY[12,1,2], 4,
 'Summer can be crowded and expensive. Spring and fall offer best balance.', 0.95),

-- Tokyo
(2, ARRAY[3,4,5,9,10,11], ARRAY[4,5,10,11], ARRAY[6,7,8],
 'March to May, September to November',
 'Cherry blossoms in spring, comfortable autumn weather',
 'Peak seasons for tourism, book accommodations early',
 ARRAY[4,5,10,11], ARRAY[1,2,12], ARRAY[1,2,6,7,8],
 ARRAY[6,7], ARRAY[12,1,2], 7,
 'Avoid summer (hot, humid, rainy) and winter crowds during holidays.', 0.92),

-- Santorini
(3, ARRAY[4,5,6,9,10], ARRAY[7,8], ARRAY[11,12,1,2],
 'April to October',
 'Warm, dry weather perfect for beaches and sightseeing',
 'Peak summer months are very crowded and expensive',
 ARRAY[5,6,9,10], ARRAY[3,4,11], ARRAY[1,2,3,11,12],
 NULL, ARRAY[12,1,2], 4,
 'Shoulder seasons offer better prices and fewer crowds.', 0.90),

-- New York
(4, ARRAY[4,5,6,9,10], ARRAY[6,7,8,12], ARRAY[1,2],
 'April to June, September to October',
 'Pleasant temperatures, comfortable for outdoor activities',
 'Summer is busy, winter holidays are crowded but magical',
 ARRAY[5,6,9,10], ARRAY[1,2,3,11], ARRAY[1,2,3,11],
 NULL, ARRAY[12,1,2], 5,
 'Fall foliage and spring blooms are spectacular. Winter can be harsh.', 0.88),

-- Bali
(5, ARRAY[4,5,6,7,8,9,10], ARRAY[7,8], ARRAY[1,2,3],
 'April to October',
 'Dry season with sunny skies and low humidity',
 'Peak season coincides with best weather',
 ARRAY[5,6,7,8,9], ARRAY[3,4,10,11], ARRAY[1,2,3,12],
 ARRAY[11,12,1,2,3], NULL, 7,
 'Wet season has heavy rainfall and higher humidity. Dry season is ideal.', 0.93),

-- Dubai
(6, ARRAY[11,12,1,2,3,4], ARRAY[12,1,2,3], ARRAY[6,7,8],
 'November to March',
 'Pleasant temperatures, ideal for outdoor activities',
 'Peak winter season, higher prices and crowds',
 ARRAY[12,1,2,3], ARRAY[11,4], ARRAY[5,6,7,8,9],
 NULL, NULL, 5,
 'Summer is extremely hot. Winter is perfect but expensive.', 0.94);

-- Insert Tourism Data for key months
INSERT INTO monthly_tourism_data (city_id, month, tourism_season_id, visitor_volume_score, price_index, hotel_occupancy_percent, flight_price_index) VALUES
-- Paris tourism data
(1, 1, 5, 3, 75, 65, 80),
(1, 4, 3, 7, 100, 80, 100),
(1, 6, 1, 10, 150, 95, 140),
(1, 7, 1, 10, 160, 98, 150),
(1, 9, 2, 8, 120, 85, 110),
(1, 12, 2, 6, 110, 75, 120),

-- Tokyo tourism data
(2, 1, 4, 4, 85, 70, 90),
(2, 4, 1, 10, 180, 95, 170),
(2, 7, 3, 6, 90, 75, 85),
(2, 10, 1, 9, 150, 90, 140),
(2, 12, 2, 7, 120, 80, 110),

-- Dubai tourism data
(6, 1, 1, 10, 200, 98, 180),
(6, 6, 5, 2, 50, 40, 60),
(6, 12, 1, 9, 180, 95, 160);

-- Insert Activities for destinations
INSERT INTO location_activities (city_id, activity_name, activity_type, best_months, available_months, description) VALUES
-- Paris activities
(1, 'Seine River Cruise', 'sightseeing', ARRAY[4,5,6,7,8,9,10], ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 'Scenic boat tours along the Seine River'),
(1, 'Outdoor Cafe Dining', 'cultural', ARRAY[4,5,6,7,8,9,10], ARRAY[3,4,5,6,7,8,9,10,11], 'Enjoy Parisian cafe culture outdoors'),
(1, 'Museum Visits', 'cultural', ARRAY[1,2,3,11,12], ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 'Louvre, Orsay, and other world-class museums'),

-- Tokyo activities
(2, 'Cherry Blossom Viewing', 'outdoor', ARRAY[3,4], ARRAY[3,4], 'Hanami - traditional cherry blossom viewing'),
(2, 'Temple Visits', 'cultural', ARRAY[3,4,5,10,11], ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 'Visit ancient temples and shrines'),
(2, 'Autumn Foliage', 'outdoor', ARRAY[10,11], ARRAY[10,11,12], 'Beautiful fall colors in parks and gardens'),

-- Dubai activities
(6, 'Desert Safari', 'outdoor', ARRAY[11,12,1,2,3], ARRAY[1,2,3,4,10,11,12], 'Desert excursions and dune bashing'),
(6, 'Beach Activities', 'beach', ARRAY[11,12,1,2,3,4], ARRAY[1,2,3,4,10,11,12], 'Swimming, water sports, beach clubs'),
(6, 'Shopping', 'cultural', ARRAY[1,2,3,4,5,11,12], ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 'World-class shopping malls and souks');

-- Insert Weather Events
INSERT INTO weather_events (city_id, event_type, start_month, end_month, intensity, impact_on_tourism, description) VALUES
-- Tokyo
(2, 'monsoon', 6, 7, 'moderate', 'moderate', 'Rainy season with high humidity'),
(2, 'typhoon_season', 8, 10, 'moderate', 'moderate', 'Potential typhoons, mostly September'),

-- Bali
(5, 'wet_season', 11, 3, 'heavy', 'significant', 'Heavy rainfall and high humidity'),
(5, 'dry_season', 4, 10, 'light', 'minimal', 'Perfect weather with minimal rainfall'),

-- Dubai
(6, 'extreme_heat', 6, 9, 'severe', 'severe', 'Temperatures often exceed 40°C, outdoor activities limited');

-- Additional cities can be added here following the same pattern...