const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to handle screenshots and send them to the Face++ API
router.post("/confidence", upload.single("screenshot"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send({ message: "No screenshot uploaded" });
  }

  const outputPath = path.join(uploadsDir, `${Date.now()}.jpg`);
  try {
    // Save the file buffer to the uploads directory
    fs.writeFileSync(outputPath, file.buffer);

    console.log(`Screenshot saved: ${outputPath}`);

    // Prepare form data to send to Face++ API
    const formData = new FormData();
    formData.append("api_key", "o5CnEnJI66q1VkCLwXpe_puZtCvE5xK"); // Replace with your actual Face++ API key
    formData.append("api_secret", "GZG1tNE50VSznFQgrZh1tGpfryorTpuQ"); // Replace with your actual Face++ API secret
    formData.append("image_file", fs.createReadStream(outputPath));

    // Send the image to the Face++ API
    const options = {
      method: "POST",
      url: "https://api-us.faceplusplus.com/facepp/v3/detect",
      headers: {
        ...formData.getHeaders(),
      },
      data: formData,
    };

    const response = await axios.request(options);

    // Respond with the analysis result
    res.status(200).send({ message: "Screenshot received", analysis: response.data });
  } catch (error) {
    console.error("Error handling screenshot or sending to API:", error);
    res.status(500).send({ message: "Failed to process screenshot", error: error.message });
  }
});

module.exports = router;
