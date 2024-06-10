import os
import subprocess

# Define directories and file paths
video_dir = '/content/drive/MyDrive/Assets'
output_dir = '/content/drive/MyDrive/Output'
lut_file = '/content/run/lut.cube'
watermark_image = 'content/run/wm.png'

# Ensure the output directory exists
os.makedirs(output_dir, exist_ok=True)

# Iterate through all .mp4 files in the video directory
for filename in os.listdir(video_dir):
    if filename.endswith('.mp4'):
        input_video = os.path.join(video_dir, filename)
        output_video = os.path.join(output_dir, filename)
        
        # Build the FFmpeg command
        ffmpeg_command = [
            'ffmpeg',
            '-i', input_video,         # Input video file
            '-i', watermark_image,     # Watermark image file
            '-filter_complex',
            f"[0]lut3d=file={lut_file}[v];"
            f"[v][1]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2",  # Apply LUT and overlay watermark
            '-c:v', 'libx264',         # Use H.264 codec for output
            '-crf', '18',              # Set constant rate factor for quality
            '-preset', 'fast',         # Set encoding speed
            output_video               # Output video file
        ]

        # Execute the FFmpeg command
        print(f"Processing {input_video}...")
        subprocess.run(ffmpeg_command, check=True)
        print(f"Processed {output_video}")

print("All videos processed.")
