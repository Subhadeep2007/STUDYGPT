import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (
    buffer,
    options = {}
) => {
    return new Promise((resolve, reject) => {
        const uploadStream =
            cloudinary.uploader.upload_stream({
                    folder: "studygpt/profiles",

                    resource_type: "image",

                    ...options
                },

                (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                }
            );

        uploadStream.end(buffer);
    });
};

export default uploadToCloudinary;