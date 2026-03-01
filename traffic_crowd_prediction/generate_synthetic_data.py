import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_synthetic_traffic_data(start_date='2025-01-01', days=90, output_filename='historical_traffic_log.csv'):
    """
    Generates synthetic historical traffic data reflecting weekly patterns.
    Rush hours on weekdays are typically 8:00-10:00 and 17:00-19:00.
    Weekends have a wider, lower peak around midday.
    """
    start_dt = pd.to_datetime(start_date)
    end_dt = start_dt + timedelta(days=days)
    
    # Generate a date range with 15-minute intervals
    date_rng = pd.date_range(start=start_dt, end=end_dt, freq='15min')
    
    data = []
    
    for dt in date_rng:
        day_of_week = dt.dayofweek
        hour = dt.hour
        
        # Base count
        base_person = np.random.poisson(5)
        base_vehicle = np.random.poisson(20)
        
        if day_of_week < 5:  # Weekday
            # Morning rush (8-10)
            if 8 <= hour < 10:
                person_count = int(np.random.normal(50, 10))
                vehicle_count = int(np.random.normal(150, 30))
            # Evening rush (17-19)
            elif 17 <= hour < 19:
                person_count = int(np.random.normal(40, 10))
                vehicle_count = int(np.random.normal(160, 35))
            # Daytime (10-17)
            elif 10 <= hour < 17:
                person_count = int(np.random.normal(15, 5))
                vehicle_count = int(np.random.normal(60, 15))
            # Night time
            else:
                person_count = int(np.random.normal(2, 2))
                vehicle_count = int(np.random.normal(10, 5))
        else: # Weekend
            # Midday peak (11-16)
            if 11 <= hour < 16:
                person_count = int(np.random.normal(30, 8))
                vehicle_count = int(np.random.normal(80, 20))
            # Evening (16-22)
            elif 16 <= hour < 22:
                person_count = int(np.random.normal(20, 6))
                vehicle_count = int(np.random.normal(50, 15))
            # Night/Morning
            else:
                person_count = int(np.random.normal(5, 3))
                vehicle_count = int(np.random.normal(15, 5))
                
        # Ensure non-negative counts
        person_count = max(0, person_count)
        vehicle_count = max(0, vehicle_count)
        
        # Add some random noise
        person_count += np.random.poisson(base_person)
        vehicle_count += np.random.poisson(base_vehicle)
        
        data.append({
            'timestamp': dt,
            'person_count': person_count,
            'vehicle_count': vehicle_count,
            'total_count': person_count + vehicle_count
        })
        
    df = pd.DataFrame(data)
    
    # Save to CSV
    os.makedirs(os.path.dirname(output_filename) or '.', exist_ok=True)
    df.to_csv(output_filename, index=False)
    print(f"Generated {len(df)} records of synthetic traffic data and saved to {output_filename}")

if __name__ == "__main__":
    output_path = os.path.join(os.path.dirname(__file__), 'data', 'historical_traffic_log.csv')
    generate_synthetic_traffic_data(days=90, output_filename=output_path)
