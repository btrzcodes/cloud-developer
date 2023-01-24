const fs = require('fs');
const path = require('path');
import Jimp = require("jimp");

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outFile = Math.floor(Math.random() * 2000) + ".jpg";
      const outpath = "/tmp/filtered." + outFile
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
      //return outFile
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export function deleteLocalFiles(files: Array<string>) {
  try {
    if(files){
      const filesPath = __dirname + '/tmp/'
      for (let file of files) {
        fs.unlinkSync( filesPath + file);
      }
      console.log('Deleted local files')
    } else {
      console.log('No local file was found')
    }
  } catch (err) {
    console.log( '----->>>>> Error while deleting local file!', err) // TODO vas por aqui y por que no se ve el file sino la url
  }
}
