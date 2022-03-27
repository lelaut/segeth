import React from "react";

const BlobBackground = () => {
  return (
    <div className="fixed overflow-hidden z-[-1] w-full h-full">
      <svg className="absolute z-[-1] overflow-hidden" viewBox="0 0 300 300">
        <animateTransform
          attributeName="transform"
          begin="0s"
          dur="2s"
          type="translate"
          fill="freeze"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          values="-100 -100;0;0"
        />
        <path
          fill="#ff438a"
          d="M60.6,-60.3C74.1,-47.1,77.6,-23.5,69.4,-8.2C61.2,7.1,41.2,14.2,27.7,22.9C14.2,31.6,7.1,42,-0.8,42.8C-8.7,43.6,-17.3,34.8,-30.1,26C-42.8,17.3,-59.7,8.7,-56.5,3.2C-53.3,-2.3,-30.1,-4.5,-17.3,-17.7C-4.5,-30.9,-2.3,-55,10.6,-65.7C23.5,-76.3,47.1,-73.5,60.6,-60.3Z"
          transform="translate(20 50)"
        />
      </svg>

      <svg className="absolute z-[-1] overflow-hidden" viewBox="0 0 400 300">
        <animateTransform
          attributeName="transform"
          begin="0s"
          dur="2s"
          type="translate"
          fill="freeze"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          values="100 -60;0;0"
        />
        <path
          fill="#4dfce0"
          d="M36.8,-66.6C41.6,-54.2,35.1,-33.6,36.1,-19.9C37.1,-6.1,45.7,0.9,51.6,12.3C57.5,23.7,60.7,39.6,53.3,43.8C45.9,48,27.8,40.5,12.7,46.2C-2.3,52,-14.4,70.9,-26,74.2C-37.7,77.4,-49.1,64.9,-49.5,50.6C-49.9,36.3,-39.4,20.2,-36.5,8.2C-33.7,-3.8,-38.5,-11.8,-40.6,-23.3C-42.8,-34.9,-42.4,-50.1,-35.2,-61.3C-27.9,-72.5,-14,-79.8,1,-81.4C16,-83,32.1,-78.9,36.8,-66.6Z"
          transform="translate(400 80)"
        />
      </svg>

      <svg
        className="absolute top-[85vh] sm:top-[calc(80vh-100px)] z-[-1] overflow-hidden"
        viewBox="0 0 200 200"
      >
        <animateTransform
          attributeName="transform"
          begin="0s"
          dur="2s"
          type="translate"
          fill="freeze"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          values="50 100;0;0"
        />
        <path
          fill="#f9f871"
          d="M20.4,-24C34.3,-22.7,59,-30.5,70.1,-26.2C81.2,-21.8,78.7,-5.5,71.9,7.2C65.1,19.8,54.2,28.6,42.4,29.9C30.6,31.1,18,24.8,8.7,25.8C-0.6,26.9,-6.7,35.2,-13.7,37.3C-20.6,39.5,-28.4,35.4,-28.9,28.6C-29.3,21.7,-22.4,12,-18.4,5.8C-14.4,-0.4,-13.3,-3,-13.3,-7.3C-13.2,-11.6,-14.2,-17.6,-12.1,-24.3C-10.1,-31.1,-5,-38.7,-0.9,-37.3C3.2,-35.8,6.4,-25.4,20.4,-24Z"
          transform="translate(100 42)"
        />
      </svg>
    </div>
  );
};

export default BlobBackground;
