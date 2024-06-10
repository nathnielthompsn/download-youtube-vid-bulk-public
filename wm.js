const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define paths to your LUT file and overlay image
const lutFilePath = path.resolve('/content/run/lut.cube');
const overlayImagePath = path.resolve('/content/run/wm.png');
const videoDir = path.resolve('/content/drive/MyDrive/Assets');
const updatedDir = path.resolve('/content/drive/MyDrive/Updated');

if (!fs.existsSync(updatedDir)) {
  fs.mkdirSync(updatedDir);
}

// Function to process each video file
const processVideo = async (videoFile) => {
  // Get the filename without extension
  const fileName = path.parse(videoFile).name;

  // Define paths for input and output files
  const videoFilePath = path.join(videoDir, videoFile);
  const outputFilePath = path.join(updatedDir, `${fileName}_updated.mp4`);

  // Construct the FFmpeg command to apply LUT and overlay image
  const ffmpegCommand = `ffmpeg -i "${videoFilePath}" -i "${overlayImagePath}" -filter_complex "[0:v]lut3d='${lutFilePath}'[v];[v][1:v] overlay=(W-w)/2:(H-h)/2:enable='between(t,0,20)'" "${outputFilePath}"`;

  // Execute the FFmpeg command
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error processing ${videoFile}: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`FFmpeg stderr: ${stderr}`);
    }
    console.log(`LUT and overlay applied to ${videoFile}, output saved to ${outputFilePath}`);
  });
};

// Read the files in the "video" directory
fs.readdir(videoDir, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    return;
  }

  // Filter only .mp4 files
  const videoFiles = files.filter(file => path.extname(file) === '.mp4');

  // Process each video file
  videoFiles.forEach(processVideo);
});
