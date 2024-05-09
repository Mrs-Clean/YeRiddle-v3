// api/get-upload-url.js
const { getSignedBlobUploadUrl } = require('@vercel/blob');

module.exports = async (req, res) => {
    try {
        const uploadUrl = await getSignedBlobUploadUrl({
            blobId: 'your-blob-id',  // Unique identifier for the file
            blobStoreId: 'your-blob-store-id',  // ID of your Blob Store
            expiresIn: 3600  // Time in seconds until the URL expires
        });

        res.status(200).json({ uploadUrl });
    } catch (error) {
        res.status(500).json({ error: 'Error generating upload URL' });
    }
};
