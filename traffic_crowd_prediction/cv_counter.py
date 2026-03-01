import cv2
import numpy as np
from ultralytics import YOLO
from datetime import datetime
import pandas as pd
import os

class TrafficCounter:
    def __init__(self, video_path='sample.mp4', output_csv='data/live_traffic_log.csv', model_name='yolov8n.pt'):
        self.video_path = video_path
        self.output_csv = output_csv
        self.model = YOLO(model_name)
        # COCO Classes: person(0), bicycle(1), car(2), motorcycle(3), bus(5), truck(7)
        self.target_classes = [0, 1, 2, 3, 5, 7]
        self.counts = {'person': 0, 'vehicle': 0}
        self.tracked_objects = set() # Store sets of tracked IDs that crossed the line
        self.is_running = False
        
        # Log interval frames (e.g. log every 300 frames)
        self.log_interval_frames = 300 
        self.current_frame = 0
        
        os.makedirs(os.path.dirname(self.output_csv) or '.', exist_ok=True)
        # Write header if file doesn't exist
        if not os.path.exists(self.output_csv):
            pd.DataFrame(columns=['timestamp', 'person_count', 'vehicle_count', 'total_count']).to_csv(self.output_csv, index=False)

    def process_video(self, show_video=True):
        if str(self.video_path).isdigit():
            cam_index = int(self.video_path)
            cap = cv2.VideoCapture(cam_index)
        else:
            cap = cv2.VideoCapture(self.video_path)
            
        if not cap.isOpened():
            print(f"Error opening video stream or file {self.video_path}. Make sure it exists.")
            return

        # Define counting line at 60% of frame height
        ret, frame = cap.read()
        if not ret:
            return
        h, w = frame.shape[:2]
        line_y = int(h * 0.6)
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        
        self.is_running = True
        
        while cap.isOpened() and self.is_running:
            ret, frame = cap.read()
            if not ret:
                break
            
            self.current_frame += 1
            
            # YOLOv8 tracking with ByteTrack
            results = self.model.track(frame, persist=True, tracker="bytetrack.yaml", classes=self.target_classes, verbose=False)
            
            if results[0].boxes and results[0].boxes.id is not None:
                boxes = results[0].boxes.xyxy.cpu().numpy()
                track_ids = results[0].boxes.id.int().cpu().numpy()
                class_ids = results[0].boxes.cls.int().cpu().numpy()
                
                for box, track_id, class_id in zip(boxes, track_ids, class_ids):
                    x1, y1, x2, y2 = box
                    cx, cy = int((x1 + x2)/2), int((y1 + y2)/2)
                    
                    # Center point
                    cv2.circle(frame, (cx, cy), 5, (0, 255, 0), -1)
                    
                    # Logic: object crosses the line
                    if track_id not in self.tracked_objects:
                        if line_y - 10 < cy < line_y + 10:
                            self.tracked_objects.add(track_id)
                            if class_id == 0 or class_id == 1: # Person or bicycle
                                self.counts['person'] += 1
                            else: # any other target class is vehicle
                                self.counts['vehicle'] += 1
                    
                    # Draw BB 
                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (255, 0, 0), 2)
            
            # Draw counting line and texts
            cv2.line(frame, (0, line_y), (w, line_y), (0, 0, 255), 2)
            cv2.putText(frame, f"Persons/Bicyclists: {self.counts['person']}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Vehicles: {self.counts['vehicle']}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
            # Form interval snapshots
            if self.current_frame % self.log_interval_frames == 0:
                self.log_data()
            
            if show_video:
                disp_frame = cv2.resize(frame, (800, 600))
                cv2.imshow("Traffic & Crowd Counter", disp_frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                    
        self.is_running = False
        cap.release()
        if show_video:
            cv2.destroyAllWindows()
        self.log_data() # Final log
        
    def stop(self):
        """Allows threads to signal the processing loop to stop."""
        self.is_running = False
        
    def log_data(self):
        current_time = datetime.now()
        data = {
            'timestamp': [current_time],
            'person_count': [self.counts['person']],
            'vehicle_count': [self.counts['vehicle']],
            'total_count': [self.counts['person'] + self.counts['vehicle']]
        }
        df = pd.DataFrame(data)
        df.to_csv(self.output_csv, mode='a', header=False, index=False)
        print(f"Logged data at {current_time}: {self.counts}")
        self.counts['person'] = 0
        self.counts['vehicle'] = 0

if __name__ == "__main__":
    counter = TrafficCounter(video_path='sample.mp4', output_csv='data/live_traffic_log.csv')
    print("Starting video processing... Press 'q' to quit.")
    counter.process_video(show_video=False)
