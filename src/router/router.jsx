// router.jsx
// pages 폴더에 페이지 추가하고
// router에 path 추가해서 연결하면 됩니다
// home은 그냥 예시에유
// router.jsx
import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import PaperDetail from "../pages/PaperDetail";
import PlasticDetail from "../pages/PlasticDetail";
import GlassDetail from "../pages/GlassDetail";
import FoodDetail from "../pages/FoodDetail";
import CanDetail from "../pages/CanDetail"; 
import TrashDetail from "../pages/TrashDetail";

// import SignUp from "../pages/SignUp.jsx";
// import Login from "../pages/Login.jsx";
// import InputLogin from "../components/InputLogin.jsx";
// import SnsLogin from "../components/SnsLogin.jsx";

import ScanPage from "../pages/ScanPage.jsx";
import ResultPage from "../pages/ResultPage.jsx";
import ChatBot from "../pages/ChatBot.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },

  { path: "/paper", element: <PaperDetail /> },
  { path: "/plastic", element: <PlasticDetail /> },
  { path: "/glass", element: <GlassDetail /> },
  { path: "/food", element: <FoodDetail /> },
  { path: "/can", element: <CanDetail /> },
  { path: "/trash", element: <TrashDetail /> },
  
  // { path:"/signup", element: <SignUp/> },
  // { path:"/login", element: <Login/> },

  { path: "/scan", element: <ScanPage /> },
  { path: "/result", element: <ResultPage /> },
  { path: "/chatbot", element: <ChatBot /> },
]);

export default router;