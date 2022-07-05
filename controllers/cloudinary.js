const cloudinary = require("cloudinary").v2;

//config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  const { image } = req.body;

  console.log("hey request body is", req.body);
  //we are going to send the image in the request body
  try {
    let result = await cloudinary.uploader.upload(image, {
      public_id: `${Date.now()}`,
      resource_type: "auto", //jpeg/png
    });
    res.json({
      url: result.url.toString(),
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong while uploading image");
  }
};
