import streamlit as st
import pandas as pd
import os
import cv2
import tempfile
from cv_counter import TrafficCounter
from peak_predictor import PeakPredictor

st.set_page_config(page_title="Traffic & Crowd Analytics", layout="wide")
st.title("Traffic & Crowd Counting + Peak Prediction")

st.markdown("""
This dashboard allows you to analyze video feeds for crowds and vehicles using YOLOv8, 
and leverages historical data to predict peak traffic hours using Machine Learning.
""")

tab1, tab2 = st.tabs(["Peak Forecasting", "Live Traffic Counting"])

with tab1:
    st.header("Weekly Peak Traffic Predictions")
    
    predictor = PeakPredictor(data_path='data/historical_traffic_log.csv')
    if not os.path.exists('data/historical_traffic_log.csv'):
        st.warning("Historical data not found. Run `generate_synthetic_data.py` first.")
    else:
        if st.button("Train/Retrain Model & Predict Peaks"):
            with st.spinner("Training Random Forest model on historical data..."):
                predictor.train_model()
                st.success("Model trained successfully!")
        
        if os.path.exists('models/rf_model.pkl'):
            peaks_df = predictor.predict_peak_timings()
            st.dataframe(peaks_df, use_container_width=True)
            
            st.write("Predictions are based on `data/historical_traffic_log.csv` simulating past traffic patterns.")
        else:
            st.info("Please train the model to view predictions.")

with tab2:
    st.header("Count Traffic Elements from Video Feed")
    st.write("Upload a video snippet to run YOLOv8 tracking (detects people, bicycles, cars, etc.).")
    
    video_file = st.file_uploader("Upload sample traffic video", type=['mp4', 'avi', 'mov'])
    
    if video_file:
        tfile = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") 
        tfile.write(video_file.read())
        
        if st.button("Start Tracking & Counting"):
            counter = TrafficCounter(video_path=tfile.name, output_csv='data/live_traffic_log.csv')
            
            video_placeholder = st.empty()
            
            cap = cv2.VideoCapture(tfile.name)
            ret, frame = cap.read()
            if not ret:
                st.error("Could not read video.")
            else:
                h, w = frame.shape[:2]
                line_y = int(h * 0.6)
                
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                
                progress_bar = st.progress(0)
                total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                
                track_counts = st.empty()
                st.info("Currently processing... (Video plays slowly due to YOLO tracking & streamlit rendering overhead)")
                
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break
                        
                    counter.current_frame += 1
                    
                    # Inference
                    results = counter.model.track(frame, persist=True, tracker="bytetrack.yaml", classes=counter.target_classes, verbose=False)
                    
                    if results[0].boxes and results[0].boxes.id is not None:
                        boxes = results[0].boxes.xyxy.cpu().numpy()
                        track_ids = results[0].boxes.id.int().cpu().numpy()
                        class_ids = results[0].boxes.cls.int().cpu().numpy()
                        
                        for box, track_id, class_id in zip(boxes, track_ids, class_ids):
                            x1, y1, x2, y2 = box
                            cx, cy = int((x1 + x2)/2), int((y1 + y2)/2)
                            
                            cv2.circle(frame, (cx, cy), 5, (0, 255, 0), -1)
                            if track_id not in counter.tracked_objects:
                                if line_y - 10 < cy < line_y + 10:
                                    counter.tracked_objects.add(track_id)
                                    if class_id == 0 or class_id == 1:
                                        counter.counts['person'] += 1
                                    else:
                                        counter.counts['vehicle'] += 1
                                        
                            # Bounding boxes
                            color = (0, 0, 255) if class_id in [0, 1] else (255, 0, 0)
                            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
                    
                    cv2.line(frame, (0, line_y), (w, line_y), (0, 255, 255), 3)
                    
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    video_placeholder.image(frame_rgb, channels="RGB")
                    
                    # Update metrics
                    track_counts.markdown(f"### Current Tally:\\n**Persons/Bicycles:** {counter.counts['person']}\\n**Vehicles:** {counter.counts['vehicle']}")
                    
                    if counter.current_frame % counter.log_interval_frames == 0:
                        counter.log_data()
                        
                    if total_frames > 0:
                        progress_bar.progress(min(counter.current_frame / total_frames, 1.0))
                
                counter.log_data()
                cap.release()
                st.success("Video processing complete. Counts logged to `data/live_traffic_log.csv`.")
