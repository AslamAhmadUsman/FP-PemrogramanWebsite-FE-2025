import React from "react";
import start from "../assets/start.png";

interface StartScreenProps {
  onStart: () => void;
  hideButton?: boolean; // optional
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, hideButton }) => {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{
        backgroundImage:
          `url(${start})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Button hanya tampil jika hideButton = false */}
      {!hideButton && (
        <button
          onClick={onStart}
          className="relative z-10 px-10 py-4 top-40 text-3xl font-bold text-white bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-xl transition"
        >
          START
        </button>
      )}
    </div>
  );
};

export default StartScreen;
