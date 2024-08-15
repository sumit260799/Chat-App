import React, { useState, useEffect, useRef } from "react";
import { RiZoomInFill, RiZoomOutFill } from "react-icons/ri";
import { MdKeyboardBackspace } from "react-icons/md";

const PreviewImage = ({ closeImagePreview, previewImage }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomIn, setZoomIn] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  useEffect(() => {
    let zoomInterval;

    if (zoomIn) {
      zoomInterval = setInterval(() => {
        setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 2));
      }, 100);
    }

    if (zoomOut) {
      zoomInterval = setInterval(() => {
        setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 1));
      }, 100);
    }

    return () => clearInterval(zoomInterval);
  }, [zoomIn, zoomOut]);

  const handleZoomInMouseDown = () => setZoomIn(true);
  const handleZoomInMouseUp = () => setZoomIn(false);
  const handleZoomOutMouseDown = () => setZoomOut(true);
  const handleZoomOutMouseUp = () => setZoomOut(false);

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      e.preventDefault();
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - startPosition.x;
      const newY = e.clientY - startPosition.y;

      const imgWidth = imgRef.current.offsetWidth;
      const imgHeight = imgRef.current.offsetHeight;
      const containerWidth = imgRef.current.parentElement.offsetWidth;
      const containerHeight = imgRef.current.parentElement.offsetHeight;

      const maxPosX = (imgWidth * zoomLevel - containerWidth) / 2;
      const maxPosY = (imgHeight * zoomLevel - containerHeight) / 2;

      const minPosX = -(imgWidth * zoomLevel - containerWidth) / 2;
      const minPosY = -(imgHeight * zoomLevel - containerHeight) / 2;

      setPosition({
        x: Math.min(Math.max(newX, minPosX), maxPosX),
        y: Math.min(Math.max(newY, minPosY), maxPosY),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (imgRef.current) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [isDragging]);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomChange = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel((prevZoom) => {
      const newZoom = Math.min(Math.max(prevZoom + zoomChange, 1), 2);

      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      } else {
        const mouseX = e.clientX - imgRef.current.getBoundingClientRect().left;
        const mouseY = e.clientY - imgRef.current.getBoundingClientRect().top;

        const imgWidth = imgRef.current.offsetWidth;
        const imgHeight = imgRef.current.offsetHeight;
        const containerWidth = imgRef.current.parentElement.offsetWidth;
        const containerHeight = imgRef.current.parentElement.offsetHeight;

        const prevWidth = imgWidth / prevZoom;
        const prevHeight = imgHeight / prevZoom;
        const newWidth = imgWidth / newZoom;
        const newHeight = imgHeight / newZoom;

        const deltaX = (mouseX / containerWidth) * (prevWidth - newWidth);
        const deltaY = (mouseY / containerHeight) * (prevHeight - newHeight);

        setPosition((prevPosition) => ({
          x: Math.max(
            Math.min(prevPosition.x + deltaX, 0),
            -newWidth + containerWidth
          ),
          y: Math.max(
            Math.min(prevPosition.y + deltaY, 0),
            -newHeight + containerHeight
          ),
        }));
      }

      return newZoom;
    });
  };

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        imgRef.current.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0  z-50 w-[100vw] h-[100vh] flex flex-col justify-center items-center  backdrop-blur-xl bg-white/50 dark:bg-black/50 select-none">
      <div className="w-[80vw] flex justify-between items-center mb-4 text-xl dark:text-slate-200 text-gray-900 fixed top-4 left-1/2 transform -translate-x-1/2">
        <div>
          <button onClick={closeImagePreview}>
            <MdKeyboardBackspace />
          </button>
        </div>
        <div className="flex ">
          <div className=" bg-gray-500 text-white mr-2  rounded-lg px-2 font-sans text-sm">
            {Math.round(zoomLevel * 100)}%
          </div>
          <button
            className="mr-2"
            onMouseDown={handleZoomInMouseDown}
            onMouseUp={handleZoomInMouseUp}
            onMouseLeave={handleZoomInMouseUp}
          >
            <RiZoomInFill />
          </button>
          <button
            onMouseDown={handleZoomOutMouseDown}
            onMouseUp={handleZoomOutMouseUp}
            onMouseLeave={handleZoomOutMouseUp}
          >
            <RiZoomOutFill />
          </button>
        </div>
      </div>
      <div
        className="relative rounded-lg overflow-hidden  max-h-[70vh] max-w-[95vw] lg:max-w-[90vw] lg:min-w-[30vw] lg:max-h-[90vh]   mt-7"
        onMouseDown={handleMouseDown}
      >
        {zoomLevel === 1 ? (
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-full  max-h-[70vh] max-w-[95vw] lg:max-w-[90vw] lg:min-w-[30vw] lg:max-h-[90vh]  object-fill"
          />
        ) : (
          <img
            ref={imgRef}
            src={previewImage}
            alt="Preview"
            className={`object-contain transition-transform duration-300 ease-in-out  ${
              zoomLevel > 1
                ? isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-not-allowed"
            }`}
            style={{
              transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: "center center",
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        )}
      </div>
    </div>
  );
};

export default PreviewImage;
