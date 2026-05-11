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
import MyPage from "../pages/MyPage.jsx";
import Login from "../pages/Login.jsx";
import SignUp from "../pages/SignUp.jsx";
import Search from "../pages/Search.jsx";
import Loading from "../pages/Loading.jsx";
import Activity from "../pages/Activity.jsx";
import MapPage from "../pages/MapPage.jsx";
import OAuthCallback from "../pages/OAuthCallback"

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
  { path: "/mypage", element: <MyPage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/search", element: <Search /> },
  { path: "/loading", element: <Loading /> },
  { path: "/activity", element: <Activity /> },
  {path: "/location", element: <MapPage /> },
  { path: "/oauth/:provider", element: <OAuthCallback /> }
]);

export default router;