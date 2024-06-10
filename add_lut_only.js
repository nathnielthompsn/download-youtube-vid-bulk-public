const { exec } = require('child_process');
const path = require('path');

// Define paths to your video file and LUT file
const videoFilePath = path.resolve('test.mp4');
const lutFilePath = path.resolve('lut.cube');
const outputFilePath = path.resolve('output.mp4');

// Construct the FFmpeg command
const ffmpegCommand = `ffmpeg -i "${videoFilePath}" -vf "lut3d='${lutFilePath}'" "${outputFilePath}"`;

// Execute the FFmpeg command
exec(ffmpegCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`FFmpeg stderr: ${stderr}`);
  }
  console.log(`FFmpeg stdout: ${stdout}`);
  console.log('LUT applied successfully, output saved to', outputFilePath);
});
