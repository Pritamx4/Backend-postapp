const {ImageKit} = require("@imagekit/nodejs");
require("dotenv").config();

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// imagekit function for uploading file
async function uploadFile(buffer) {
  const result = await imagekit.files.upload({
    file: buffer.toString("base64"),
    fileName: "image.jpg",
  });
  return result;
}

// imagekit function for deleting file
async function deleteFile(fileId) {
  const result = await imagekit.files.delete(fileId);
  return result;
}


module.exports = {
  uploadFile,
  deleteFile
};
