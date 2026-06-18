// src/components/BottomNav.jsx
import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

// 기존 아이콘들
import HomeIcon from "../assets/img/varhome.svg";
import LocationIcon from "../assets/img/varlocation.svg";
import CameraIcon from "../assets/img/varcamera.svg";
import ActivityIcon from "../assets/img/varactivity.svg";
import ProfileIcon from "../assets/img/varprofile.svg";

// 활성화 시 아이콘들
import HomeOnIcon from "../assets/img/varhomeOn.svg";
import LocationOnIcon from "../assets/img/varlocationOn.svg";
import ScanIcon from "../assets/img/varscanIcon.svg";
import ActivityOnIcon from "../assets/img/varactivityOn.svg";
import ProfileOnIcon from "../assets/img/varprofileOn.svg";

// --- 스타일 (기존 코드 유지) ---
const NavContainer = styled.div`
  position: fixed; /* 화면 하단 고정 */
  bottom: 0;
  width: 393px;
  height: 88px;
  background: #fff;
  box-shadow: ${({ $hideTopShadow }) =>
    $hideTopShadow ? "none" : "0px -1px 8.3px rgba(0, 0, 0, 0.1)"};
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 20px 20px 0 0;
  z-index: 100;
`;

const NavItem = styled.div`
  display: flex; 
  flex-direction: 
  column; align-items: center; 
  gap: 4px;
  font-family: Paperlogy; 
  font-size: 10px; 
  cursor: pointer;
`;

const NavIcon = styled.img` 
width: 24px; 
height: 24px; 
object-fit: contain; `;

const CameraWrapper = styled.div`
  width: 60px; 
  height: 60px; 
  background: #53b175; 
  border-radius: 50%;
  margin-top: -10px; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  box-shadow: 0px 4px 10px rgba(83, 177, 117, 0.3);
`;

const StyledCameraIcon = styled.img` width: 32px; height: 32px; object-fit: contain; `;

const BottomNavComponent = ({ onCapture, hideTopShadow = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isLocation = location.pathname === "/location";
  const isScan = location.pathname === "/scan";
  const isActivity = location.pathname === "/activity";
  const isProfile = location.pathname === "/mypage";

  const handleCameraClick = () => {
    if (isScan && onCapture) {
      onCapture();
    } else {
      navigate('/scan');
    }
  };

  return (
    <NavContainer $hideTopShadow={hideTopShadow}>
      <NavItem onClick={() => navigate('/')}>
        <NavIcon src={isHome ? HomeOnIcon : HomeIcon} />Home
      </NavItem>
      
      <NavItem onClick={() => navigate('/location')}>
        <NavIcon src={isLocation ? LocationOnIcon : LocationIcon} />Location
      </NavItem>

      <CameraWrapper onClick={handleCameraClick}>
        <StyledCameraIcon src={isScan ? ScanIcon : CameraIcon} alt="Camera" />
      </CameraWrapper>

      <NavItem onClick={() => navigate('/activity')}>
        <NavIcon src={isActivity ? ActivityOnIcon : ActivityIcon} />Activity
      </NavItem>
      
      <NavItem onClick={() => navigate('/mypage')}>
        <NavIcon src={isProfile ? ProfileOnIcon : ProfileIcon} />Profile
      </NavItem>
    </NavContainer>
  );
};
export default BottomNavComponent;
