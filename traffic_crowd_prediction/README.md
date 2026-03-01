---
title: AathraOS Traffic Backend
emoji: 🚦
colorFrom: blue
colorTo: red
sdk: docker
pinned: false
---

# AathraOS Traffic Prediction Backend

This repository contains the backend API for the AathraOS smart city dashboard. It provides:
1. **Real-time Traffic Tracking:** Headless CCTV YOLOv8 computer vision object counting (`persons` and `vehicles`).
2. **AI Peak Forecasting:** A Random Forest machine learning model that analyzes historical metrics to predict weekly peak congestion hours.

## Deployment Details

This project is configured to be deployed natively on **Hugging Face Spaces** as a Docker space.

The provided `Dockerfile` installs all necessary dependencies (including OpenCV headless libraries) and boots the FastAPI server via `uvicorn` using the `start.sh` configuration script. By default, it runs the `fake_api.py` data stream so it fits within free-tier hardware limits.

To run the actual YOLO CV tracking model on your own hardware:
1. Clone the repository.
2. Edit `start.sh` to run `python3 -m uvicorn api:app --host 0.0.0.0 --port $PORT` instead of `fake_api.py`.
3. Provide a video or CCTV `.mp4` stream directly to the `/stream/start` endpoint.
