# Use Python 3.10 slim as a lightweight base image for better ML wheel compatibility
FROM python:3.10-slim

# Install system dependencies required by OpenCV and build tools for ML wheels
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /code

# Copy the requirements file into the container
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project files
COPY . .

# Create writable directories for YOLO configuration and data logs
RUN mkdir -p /tmp/Ultralytics /code/data /code/models
RUN chmod -R 777 /tmp/Ultralytics /code/data /code/models

# Expose port (Hugging Face Spaces defaults to 7860)
EXPOSE 7860

# Pass environment variables
ENV YOLO_CONFIG_DIR="/tmp/Ultralytics"
ENV YOLO_VERBOSE="False"
ENV YOLO_UPDATE_CHECK="False"
ENV YOLO_VERSION_CHECK="False"
ENV PORT=7860

# Hugging Face default command
CMD ["bash", "start.sh"]
