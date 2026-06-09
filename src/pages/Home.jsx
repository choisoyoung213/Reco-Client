import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CommonLayout } from "../components/CommonLayout";

// 이미지 파일 import
import Bium from "../assets/img/Bium.svg";
import BiumProfile from "../assets/img/BiumProfile.svg";
import EarthIcon from "../assets/img/earth30.svg";
import PaperIcon from "../assets/img/paperIcon.svg";
import PlasticIcon from "../assets/img/plasticIcon.svg";
import GlassIcon from "../assets/img/glassIcon.svg";
import FtIcon from "../assets/img/ftIcon.svg";
import CanIcon from "../assets/img/canIcon.svg";
import TrashIcon from "../assets/img/trashIcon.svg";
import { getRequiredEnv } from "../config/env";

/* ===== Styled Components ===== */
const Main = styled.div`
  position: relative;
  width: 393px;
  height: 852px; /* 스크롤 없이 컴팩트하게 떨어지도록 전체 높이 조정 */
  margin: 0 auto;
  background: #ffffff;
  overflow-y: auto; /* 내용이 많아질 경우 안전 장치 */
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TitleGreen = styled.div`
  position: absolute;
  left: 25px;
  top: 90px;
  width: 154px;
  font-family: Paperlogy;
  font-weight: 600;
  font-size: 28px;
  line-height: 20px;
  color: #53b175;
  text-align: left;
`;

const TitleBlack = styled.div`
  position: absolute;
  left: 25px;
  top: 120px;
  font-family: Paperlogy;
  font-weight: 600;
  font-size: 28px;
  line-height: 38px;
  color: #000;
  text-align: left;
`;

const SubText = styled.div`
  position: absolute;
  left: 25px;
  top: 205px;
  font-family: Paperlogy;
  font-size: 12px;
  line-height: 20px;
  color: #686868;
  text-align: left;
`;

const CharacterImage = styled.div`
  position: absolute;
  width: 183px;
  height: 214px;
  left: 195px;
  top: 36px;
  background-image: url(${Bium});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 20px;
`;

const EarthBackground = styled.div`
  position: absolute;
  left: 100px; 
  top: 10px; 
  width: 400px; 
  height: 430px;
  background-image: url(${EarthIcon});
  background-size: contain;
  background-repeat: no-repeat;
`;

const Card = styled.div`
  position: absolute;
  top: 275px; /* 검색바가 빠지면서 카드가 위로 조금 더 자연스럽게 안착 */
  left: 0;
  width: 393px;
  height: 577px; 
  background: #ffffff !important;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 25px 25px 0 0;
  z-index: 1;
`;

const CategoryGrid = styled.div`
  position: absolute;
  top: 305px;
  left: 20px;
  width: 353px;
  display: flex;
  gap: 16px;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;
  z-index: 2;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryItem = styled.div`
  flex: 0 0 auto;
  width: 68px;
  text-align: center;
  cursor: pointer;
`;

const CategoryIcon = styled.div`
  width: 52px;
  height: 52px;
  margin: 0 auto 8px;
  
  background-image: url(${props => props.$img}); 
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const CategoryText = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #272727;
`;

const LocationHeaderWrapper = styled.div`
  position: absolute;
  left: 21px;
  top: 415px;
  width: 351px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 2;
`;

const LocationTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  text-align: left;
`;

const LocationSub = styled.div`
  font-family: Paperlogy;
  font-weight: 600;
  font-size: 13px;
  color: #959595;
`;

const LocationMain = styled.div`
  font-family: Paperlogy;
  font-weight: 700;
  font-size: 20px;
  color: #000;
`;

const LocationBadge = styled.div`
  font-family: Paperlogy;
  font-weight: 500;
  font-size: 12px;
  color: #7a7777;
  padding-bottom: 2px;
`;

const MapContainer = styled.div`
  position: absolute;
  left: 21px;
  top: 475px; 
  width: 351px;
  height: 195px; 
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #e2e2e2;
  z-index: 2;
  cursor: pointer; 
`;

/* ===== 신규 추가: 챗봇 바로가기 배너 구조 ===== */
const ChatbotBannerSection = styled.div`
  position: absolute;
  left: 21px;
  top: 690px;
  width: 351px;
  text-align: left;
  z-index: 2;
`;

const ChatbotSubTitle = styled.div`
  font-family: Paperlogy;
  font-size: 13px;
  font-weight: 600;
  color: #959595;
  margin-bottom: -1px;
`;

const ChatbotMainTitle = styled.div`
  font-family: Paperlogy;
  font-size: 19px;
  font-weight: 700;
  color: #000;
  margin-bottom: 12px;
`;

const ChatbotCard = styled.div`
  width: 100%;
  height: 72px;
  border: 1.5px solid #53b175;
  border-radius: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0px 2px 8px rgba(83, 177, 117, 0.06);
`;

const ChatbotCharacterCircle = styled.div`
  width: 60px;
  height: 60px;
  background-image: url(${BiumProfile});
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 5px;
`;

const ChatbotTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ChatbotNameRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ChatbotName = styled.span`
  font-family: Paperlogy;
  font-weight: 600;
  font-size: 14px;
  color: #53b175;
`;

const ChatbotTime = styled.span`
  font-family: Paperlogy;
  font-size: 11px;
  color: #b5b5b5;
`;

const ChatbotPreviewRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const ChatbotMessagePreview = styled.div`
  font-family: Paperlogy;
  font-size: 11px;
  color: #000000 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
  max-width: 200px;
`;

const ChatbotBadgeCount = styled.div`
  width: 20px;
  height: 20px;
  background-color: #53b175;
  border-radius: 50%;
  color: #ffffff;
  font-family: Paperlogy;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

/* ===== Main Component ===== */
const Home = () => {
  const [currentAddress, setCurrentAddress] = useState("위치 탐색 중...");
  const regionLookupUnavailableRef = useRef(false);
  const navigate = useNavigate();

  const [lastChatMessage, setLastChatMessage] = useState({
    text: "안녕하세요! 비움이에게 무엇이든 물어보세요!",
    time: "지금",
    unreadCount: 1
  });

  useEffect(() => {
    let isMounted = true;

    const loadKakaoMap = () =>
      new Promise((resolve, reject) => {
        try {
          const kakaoMapKey = getRequiredEnv("VITE_KAKAO_MAP_KEY");
          const existingScript = document.querySelector(
            'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
          );

          if (window.kakao?.maps) {
            window.kakao.maps.load(resolve);
            return;
          }

          if (existingScript) {
            existingScript.addEventListener("load", () => {
              window.kakao.maps.load(resolve);
            });
            existingScript.addEventListener("error", reject);
            return;
          }

          const script = document.createElement("script");
          script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services`;
          script.async = true;
          script.onload = () => window.kakao.maps.load(resolve);
          script.onerror = reject;
          document.head.appendChild(script);
        } catch (error) {
          reject(error);
        }
      });

    const initializeMap = () => {
      const container = document.getElementById("kakao-map");
      if (!container || !window.kakao || !isMounted) return;

      const defaultCoords = new window.kakao.maps.LatLng(37.4781, 126.9517);

      const options = {
        center: defaultCoords,
        level: 5,
      };

      const map = new window.kakao.maps.Map(container, options);
      const geocoder = new window.kakao.maps.services.Geocoder();

      const searchAddrFromCoords = (coords, callback) => {
        if (regionLookupUnavailableRef.current) return;

        geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
      };

      const displayCenterInfo = (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          for (let i = 0; i < result.length; i++) {
            if (result[i].region_type === "H") {
              setCurrentAddress(result[i].region_3depth_name);
              break;
            }
          }
          return;
        }

        if (status === window.kakao.maps.services.Status.ERROR) {
          regionLookupUnavailableRef.current = true;
          setCurrentAddress("위치 확인 불가");
        }
      };

      searchAddrFromCoords(map.getCenter(), displayCenterInfo);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const currentPos = new window.kakao.maps.LatLng(lat, lon);

            map.setCenter(currentPos);
            searchAddrFromCoords(currentPos, displayCenterInfo);
          },
          (error) => {
            console.error("GPS 위치 정보를 가져오는 데 실패했습니다.", error);
            searchAddrFromCoords(map.getCenter(), displayCenterInfo);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      }

      window.kakao.maps.event.addListener(map, "idle", () => {
        const centerCoords = map.getCenter();
        searchAddrFromCoords(centerCoords, displayCenterInfo);
      });

      window.kakao.maps.event.addListener(map, "click", () => {
        navigate("/location");
      });
    };

    loadKakaoMap()
      .then(initializeMap)
      .catch((error) => {
        console.error(error);
        setCurrentAddress("지도 설정 필요");
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <CommonLayout>
      <Main>
        <TitleGreen>지구를 위해,</TitleGreen>
        <TitleBlack>분리수거 함께<br />하실래요?</TitleBlack>
        <SubText>
          어떤 쓰레기인지 헷갈리셨죠?<br />
          제가 알려드릴게요!
        </SubText>

        <EarthBackground />
        <CharacterImage />

        <Card />

        {/* 카테고리 슬라이더 배치 (상단 배치 완료) */}
        <CategoryGrid>
          <CategoryItem onClick={() => navigate('/paper')}><CategoryIcon $img={PaperIcon} /><CategoryText>종이</CategoryText></CategoryItem>
          <CategoryItem onClick={() => navigate('/plastic')}><CategoryIcon $img={PlasticIcon} /><CategoryText>플라스틱</CategoryText></CategoryItem>
          <CategoryItem onClick={() => navigate('/glass')}><CategoryIcon $img={GlassIcon} /><CategoryText>유리</CategoryText></CategoryItem>
          <CategoryItem onClick={() => navigate('/food')}><CategoryIcon $img={FtIcon} /><CategoryText>음식물</CategoryText></CategoryItem>
          <CategoryItem onClick={() => navigate('/can')}><CategoryIcon $img={CanIcon} /><CategoryText>캔</CategoryText></CategoryItem>
          <CategoryItem onClick={() => navigate('/trash')}><CategoryIcon $img={TrashIcon} /><CategoryText>일반쓰레기</CategoryText></CategoryItem>
        </CategoryGrid>

        {/* 위치 정보 헤더 */}
        <LocationHeaderWrapper>
          <LocationTitle>
            <LocationSub>나의 위치 기반</LocationSub>
            <LocationMain>가까운 분리배출 장소</LocationMain>
          </LocationTitle>
          <LocationBadge>📍 {currentAddress}</LocationBadge>
        </LocationHeaderWrapper>

        {/* 카카오 지도 컨테이너 */}
        <MapContainer id="kakao-map" onClick={() => navigate("/location")} />

        {/* 비움이 채팅 배너 */}
        <ChatbotBannerSection>
          <ChatbotSubTitle>헷갈리거나 궁금하다면</ChatbotSubTitle>
          <ChatbotMainTitle>비움이와 채팅하러가기</ChatbotMainTitle>

          <ChatbotCard onClick={() => navigate("/chatbot")}>
            <ChatbotCharacterCircle />
            <ChatbotTextWrapper>
              <ChatbotNameRow>
                <ChatbotName>비움이</ChatbotName>
                {/* 실시간 대화 시간 */}
                <ChatbotTime>{lastChatMessage.time}</ChatbotTime>
              </ChatbotNameRow>
              <ChatbotPreviewRow>
                {/* 마지막 대화 내용 뜨는 부분 */}
                <ChatbotMessagePreview>{lastChatMessage.text}</ChatbotMessagePreview>

                {/* 안읽은 메세지가 있을 때만 배지 띄우기 */}
                {lastChatMessage.unreadCount > 0 && (
                  <ChatbotBadgeCount>{lastChatMessage.unreadCount}</ChatbotBadgeCount>
                )}
              </ChatbotPreviewRow>
            </ChatbotTextWrapper>
          </ChatbotCard>
        </ChatbotBannerSection>

      </Main>
    </CommonLayout>
  );
};

export default Home;
