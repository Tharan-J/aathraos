import time
import api
import threading
import random

# We'll just fake the api state since we don't have a video
# We'll run this script and it'll start the API and then periodically update the global tracker state
class FakeTracker:
    def __init__(self):
        self.is_running = True
        self.video_path = "fake_stream_for_dashboard_test"
        self.counts = {'person': 12000, 'vehicle': 400}

    def stop(self):
        self.is_running = False

def update_loop():
    while True:
        if api.active_tracker and getattr(api.active_tracker, "video_path", "") == "fake_stream_for_dashboard_test":
            # Just vary the numbers slightly
            api.active_tracker.counts['person'] += random.randint(-50, 50)
            api.active_tracker.counts['vehicle'] += random.randint(-10, 10)
        time.sleep(3)

print("Starting Fake Stream Data Injector...")
api.active_tracker = FakeTracker()
t = threading.Thread(target=update_loop, daemon=True)
t.start()

import uvicorn
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(api.app, host="0.0.0.0", port=port)
