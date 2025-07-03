import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import axios from "axios";
import "./index.css";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function App() {
  const [inputImage, setInputImage] = useState(null);
  const [style, setStyle] = useState("Van Gogh");
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setInputImage(URL.createObjectURL(file));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://your-backend-url.com/style-transfer", {
        imageUrl: inputImage,
        style: style
      });
      setOutputImage(response.data.stylizedImageUrl);
    } catch (error) {
      console.error("Style transfer failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Artify AI 🎨</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">Hi, {user.displayName}</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </div>
        ) : (
          <button onClick={handleLogin} className="bg-blue-500 px-3 py-1 rounded">Login with Google</button>
        )}
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Upload Your Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
          {inputImage && (
            <img
              src={inputImage}
              alt="input"
              className="rounded-xl shadow-md"
            />
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Choose Style</h2>
          <select
            className="w-full bg-gray-700 text-white p-2 rounded mb-4"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option>Van Gogh</option>
            <option>Cyberpunk</option>
            <option>Studio Ghibli</option>
            <option>Pixel Art</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={!inputImage || loading}
            className="bg-green-500 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Applying Style..." : "Generate Art"}
          </button>

          {outputImage && !loading && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Stylized Output</h3>
              <img
                src={outputImage}
                alt="styled output"
                className="rounded-xl shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
