import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

class PeakPredictor:
    def __init__(self, data_path='data/historical_traffic_log.csv', model_path='models/rf_model.pkl'):
        self.data_path = data_path
        self.model_path = model_path
        self.model = None

    def load_and_prepare_data(self):
        try:
            df = pd.read_csv(self.data_path, parse_dates=['timestamp'])
        except Exception as e:
            print(f"Error loading training data: {e}")
            return None
        
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        df['minute'] = df['timestamp'].dt.minute
        return df

    def train_model(self):
        df = self.load_and_prepare_data()
        if df is None:
            return False
            
        features = ['hour', 'day_of_week', 'is_weekend', 'minute']
        target = 'total_count'
        
        X = df[features]
        y = df[target]
        
        print("Training Random Forest Regressor on historical traffic data...")
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        os.makedirs(os.path.dirname(self.model_path) or '.', exist_ok=True)
        joblib.dump(self.model, self.model_path)
        print(f"Model trained and saved to {self.model_path}")
        return True
        
    def load_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            return True
        return False

    def predict_peak_timings(self):
        if self.model is None and not self.load_model():
            print("Model not found. Please train the model first.")
            return None
            
        prediction_data = []
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        for day_idx, day_name in enumerate(days):
            is_weekend = 1 if day_idx >= 5 else 0
            
            hourly_predictions = []
            for hour in range(24):
                features = pd.DataFrame([{
                    'hour': hour,
                    'day_of_week': day_idx,
                    'is_weekend': is_weekend,
                    'minute': 0 # Sampling roughly at start of hour
                }])
                pred = self.model.predict(features)[0]
                # Assuming pred is the count per 15 min, hourly count -> pred * 4
                hourly_count = int(pred * 4) 
                hourly_predictions.append((hour, hourly_count))
            
            hourly_predictions.sort(key=lambda x: x[1], reverse=True)
            top_3_peaks = hourly_predictions[:3] 
            
            prediction_data.append({
                'Day': day_name,
                'Peak 1': f"{top_3_peaks[0][0]:02d}:00 ({top_3_peaks[0][1]} records)",
                'Peak 2': f"{top_3_peaks[1][0]:02d}:00 ({top_3_peaks[1][1]} records)",
                'Peak 3': f"{top_3_peaks[2][0]:02d}:00 ({top_3_peaks[2][1]} records)"
            })
            
        return pd.DataFrame(prediction_data)

if __name__ == "__main__":
    predictor = PeakPredictor()
    predictor.train_model()
    peaks_df = predictor.predict_peak_timings()
    print("\n--- Weekly Peak Traffic Predictions ---")
    print(peaks_df)
