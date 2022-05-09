
import { exec, ExecException } from "child_process";
import { readdir, stat, Stats, unlink } from "fs";
import { sep } from "path";
import ffmpeg from "./ffmpeg.js";

const mp3 = function ():void {
    const musicPath:string = (process.argv.length > 2)
            ? process.argv[2]
            : process.cwd();
    readdir(musicPath, function (readError:NodeJS.ErrnoException, list:string[]):void {
        if (readError === null) {
            let listIndex:number = 0;
            const fileList:string[] = [],
                listLength:number = list.length,
                convert = function () {
                    let musicIndex:number = 0;
                    const musicLength:number = fileList.length,
                        childWrapper = function ():void {
                            const inPath:string = musicPath + sep + fileList[musicIndex],
                                outPath:string = fileList[musicIndex].slice(0, fileList[musicIndex].lastIndexOf("."));
                            exec(`${ffmpeg} -i "${inPath}" -vn -ab 320k -ar 48000 -y "${musicPath + sep + outPath}.mp3"`, {}, function (childError:ExecException, stdout:string, stderr:string):void {
                                if (childError === null) {
                                    unlink(inPath, function (unlinkError:NodeJS.ErrnoException) {
                                        if (unlinkError === null) {
                                            musicIndex = musicIndex + 1;
                                            console.log(`File number ${musicIndex} of ${musicLength} written: ${fileList[musicIndex - 1]}`);
                                            if (musicIndex < musicLength) {
                                                childWrapper();
                                            } else {
                                                console.log("All files converted");
                                            }
                                        } else {
                                            console.log(`Error removing file ${inPath}`);
                                            console.log(JSON.stringify(unlinkError));
                                        }
                                    });
                                } else {
                                    console.log(`Error converting file ${fileList[musicIndex]}`);
                                    console.log(stderr);
                                    console.log(JSON.stringify(childError));
                                }
                            });
                        };
                    childWrapper();
                },
                statWrapper = function () {
                    stat(musicPath + sep + list[listIndex], function (statErr:NodeJS.ErrnoException, stats:Stats):void {
                        if (statErr === null) {
                            if (stats.isFile() === true && (/\.mp3$/).test(list[listIndex]) === false && (/\.txt$/).test(list[listIndex]) === false) {
                                fileList.push(list[listIndex]);
                            }
                            listIndex = listIndex + 1;
                            if (listIndex < listLength) {
                                statWrapper();
                            } else {
                                convert();
                            }
                        } else {
                            console.log(`Error accessing file ${musicPath + sep + list[listIndex]}`);
                            console.log(JSON.stringify(statErr));
                        }
                    });
                };
            statWrapper();
        } else {
            console.log(`Error reading directory "${musicPath}"`);
            console.log(JSON.stringify(readError));
        }
    });
};

mp3();