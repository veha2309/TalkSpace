import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

const CustomUploader = () => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <>
      <CldUploadWidget
        uploadPreset="urnu8ppv" // Replace with your actual upload preset
        options={{
          cropping: true, // Enable cropping
          folder: "user_uploads", // Save images to a specific folder
          multiple: false, // Allow only single file upload
        }}
        onUpload={() => setIsUploading(true)} // Set uploading state
        onSuccess={() => {
          setIsUploading(false);
        }}
        onError={(error) => {
          console.error("Upload Error:", error);
          setIsUploading(false);
        }}
      >
        {({ open }) => (
          <button
            onClick={() => open()}
            className={`px-4 py-2 rounded ${isUploading
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload an Image"}
          </button>
        )}
      </CldUploadWidget>
    </>
  );
};

export default CustomUploader;
