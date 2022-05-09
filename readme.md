# mp3

A batch converter of media to MP3.

## What this does
1. Reads all files from a specified location except files with extensions *.mp3* and *.txt*.
1. Creates MP3 out for each file of identical file name except for the file extension.
1. If MP3 is successfully written deletes the original media file.
1. Writes status output to the terminal file by file.

## Install
1. Download and install [ffmpeg](https://ffmpeg.org/).
1. Execute `npm install -g typescript`
1. Modify the value of ffmpeg.ts to point to the location of the ffmpeg binary, might be something similar to `"C:\\Users\\user_name\\downloads\\ffmpeg-4.4.1-full_build\\bin\\ffmpeg.exe"` for Windows users. **Must be an absolute path**.
1. From inside the project directory `npm install`.
1. Execute `tsc` from inside the project directory

## Execution
`node mp3 "C:\myFiles"` where the third argument is the location of the media to convert.