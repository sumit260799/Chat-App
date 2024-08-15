import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropImage";

const ImageCrop = ({ boxSize, imageSrc, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropButtonClick = async () => {
    if (croppedAreaPixels) {
      const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImageUrl);
    }
  };
  const height = boxSize;
  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        style={{ height: `${height}px` }}
        className={`relative w-full  bg-gray-200 dark:bg-gray-800`}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={4 / 4}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          cropShape="rect"
          showGrid={true}
        />
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="range"
          value={zoom}
          min="1"
          max="3"
          step="0.1"
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(e.target.value)}
          className="w-48"
        />
        <button
          onClick={handleCropButtonClick}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Crop
        </button>
      </div>
    </div>
  );
};

export default ImageCrop;
