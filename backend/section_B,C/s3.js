const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const REGION = "us-east-1";
const BUCKET_NAME = "your-bucket-name";
const URL_EXPIRY = 60;

const s3Client = new S3Client({ region: REGION });

async function generateSignedUrl(filename, type) {
  let extension;

  if (type === "image") {
    extension = ".jpeg";
  } else if (type === "video") {
    extension = ".mp4";
  } else {
    throw new Error("Invalid type. Must be 'image' or 'video'.");
  }

  const key = `${filename}${extension}`;

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: URL_EXPIRY });
}

function generateSigned(filename, type) {
  let extension;

  if (type === "image") {
    return "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg"
  } else if (type === "video") {
    return "https://filesamples.com/samples/video/mp4/sample_960x540.mp4"
  } else {
    throw new Error("Invalid type. Must be 'image' or 'video'.");
  }
}
module.exports = {generateSignedUrl,generateSigned};
