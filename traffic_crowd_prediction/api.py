from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import threading
import os
from typing import Optional

from cv_counter import TrafficCounter
from peak_predictor import PeakPredictor

app = FastAPI(
    title="Traffic & Crowd Real-time Analytics API",
    description="API to control and query object tracking models for real-time CCTV feeds."
)

# Global configuration / state
active_tracker: Optional[TrafficCounter] = None
tracker_thread: Optional[threading.Thread] = None

class StreamStartRequest(BaseModel):
    url: str
    output_log: str = "data/live_api_traffic_log.csv"

class TrafficStatusResponse(BaseModel):
    status: str
    active_stream: Optional[str] = None
    persons: int = 0
    vehicles: int = 0
    total: int = 0

def run_tracker_in_background(url: str, output_csv: str):
    global active_tracker
    try:
        # Re-initialize tracker and run processing without OpenCV UI since it's a daemon
        active_tracker = TrafficCounter(video_path=url, output_csv=output_csv)
        print(f"Starting Background Tracker on Stream: {url}")
        active_tracker.process_video(show_video=False)
    except Exception as e:
        print(f"Error in background tracker: {e}")
    finally:
        active_tracker = None

@app.post("/stream/start", tags=["CCTV Stream Management"])
async def start_stream(request: StreamStartRequest):
    """
    Starts the video tracking background process for a given RTSP/HTTP URL.
    If a stream is already running, stops it and starts the new one.
    """
    global active_tracker, tracker_thread
    
    # Clean up existing stream properly
    if active_tracker and active_tracker.is_running:
        active_tracker.stop()
        if tracker_thread:
            tracker_thread.join(timeout=5.0) 
            
    # Launch new stream
    tracker_thread = threading.Thread(
        target=run_tracker_in_background,
        args=(request.url, request.output_log),
        daemon=True
    )
    tracker_thread.start()
    
    return {"message": f"Successfully launched tracker for {request.url} in background"}

@app.post("/stream/stop", tags=["CCTV Stream Management"])
async def stop_stream():
    """
    Stops the currently running video processing stream.
    """
    global active_tracker
    if active_tracker and active_tracker.is_running:
        active_tracker.stop()
        return {"message": "Active stream tracking stopped."}
    return {"message": "No stream currently tracking."}

@app.get("/stream/status", response_model=TrafficStatusResponse, tags=["Analytics"])
async def get_stream_status():
    """
    Retrieves the actual live counting metrics from the actively running CCTV stream tracker.
    """
    global active_tracker
    
    if active_tracker and active_tracker.is_running:
        counts = active_tracker.counts
        return TrafficStatusResponse(
            status="running",
            active_stream=str(active_tracker.video_path),
            persons=counts.get('person', 0),
            vehicles=counts.get('vehicle', 0),
            total=counts.get('person', 0) + counts.get('vehicle', 0)
        )
        
    return TrafficStatusResponse(status="idle")

@app.get("/forecast/peaks", tags=["Analytics"])
async def get_peak_forecast():
    """
    Retrieves the predicted weekly peak hour timings from our ML model,
    using historical traffic data.
    """
    predictor = PeakPredictor(data_path='data/historical_traffic_log.csv', model_path='models/rf_model.pkl')
    
    # Fast path if trained, else we attempt training seamlessly
    if predictor.model is None and not predictor.load_model():
        if os.path.exists('data/historical_traffic_log.csv'):
            success = predictor.train_model()
            if not success:
               raise HTTPException(status_code=500, detail="Failed to train model from existing historical data.")
        else:
            raise HTTPException(
                status_code=400, 
                detail="Historical data not found. Run generate_synthetic_data.py to collect base patterns before forecasting."
            )
            
    df_peaks = predictor.predict_peak_timings()
    if df_peaks is None:
        raise HTTPException(status_code=500, detail="Peak prediction returned None")
        
    # converting pandas DF to native dicts for JSON serialization
    return df_peaks.to_dict(orient="records")

if __name__ == "__main__":
    import uvicorn
    # Typically you run with `uvicorn api:app --reload`
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
