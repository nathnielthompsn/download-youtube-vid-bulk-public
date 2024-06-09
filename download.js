const ytdl = require('ytdl-core');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Read JSON file
const videoList = JSON.parse(fs.readFileSync('/content/run/vid.json', 'utf8'));

// Directory to save the files
const outputDir = '/content/drive/MyDrive/Assets';

// Ensure the directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Function to download a stream and save it to a file
function downloadStream(url, options, output) {
    return new Promise((resolve, reject) => {
        const stream = ytdl(url, options);
        const writeStream = fs.createWriteStream(output);

        stream.pipe(writeStream);

        stream.on('end', () => resolve());
        stream.on('error', (err) => reject(err));
    });
}

// Function to merge video and audio using ffmpeg
function mergeVideoAudio(videoPath, audioPath, outputPath) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i ${videoPath} -i ${audioPath} -c copy ${outputPath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            resolve(stdout);
        });
    });
}

// Function to download and merge video and audio
async function downloadAndMerge(url, videoOutput, audioOutput, finalOutput) {
    try {
        console.log(`Downloading video to ${videoOutput}...`);
        await downloadStream(url, { quality: 'highestvideo' }, videoOutput);

        console.log(`Downloading audio to ${audioOutput}...`);
        await downloadStream(url, { quality: 'highestaudio' }, audioOutput);

        console.log(`Merging video and audio to ${finalOutput}...`);
        await mergeVideoAudio(videoOutput, audioOutput, finalOutput);

        console.log(`Cleaning up temporary files...`);
        fs.unlinkSync(videoOutput);
        fs.unlinkSync(audioOutput);

        console.log(`Video downloaded and merged successfully: ${finalOutput}`);
    } catch (err) {
        console.error(err);
    }
}

// Async function to process videos one by one
async function processVideos(videoList) {
    for (const [index, video] of videoList.entries()) {
        const videoFilename = path.join(outputDir, `temp_${video.title}_${index}.mp4`);
        const audioFilename = path.join(outputDir, `temp_${video.title}_${index}.mp3`);
        const outputFilename = path.join(outputDir, `${video.title}.mp4`);

        await downloadAndMerge(video.url, videoFilename, audioFilename, outputFilename);
    }
}

// Process each video in the list sequentially
processVideos(videoList);
