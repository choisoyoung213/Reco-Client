import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CommonLayout } from "../components/CommonLayout";

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
  height: 852px;
  margin: 0 auto;
  background: #ffffff;
  overflow-y: auto;
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
  top: 275px;
  left: 0;
  width: 393px;
  height: 577px;
  background: #ffffff;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 25px 25px 0 0;
  z-index: 1;
`;

const CategoryGrid = styled.div`
  position: absolute;
  top: 305px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  z-index: 2;
`;

const CategoryItem = styled.div`
  flex: 0 0 50px;
  width: 50px;
  text-align: center;
  cursor: pointer;
`;

const CategoryIcon = styled.div`
  width: 44px;
  height: 44px;
  margin: 0 auto 4px;
  background-image: url(${(props) => props.$img});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const CategoryText = styled.div`
  font-size: 10.5px;
  font-weight: 500;
  color: #272727;
  white-space: nowrap;
  letter-spacing: -0.3px;
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
  color: rgba(0, 0, 0, 0.5);
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

const Home = () => {
  const [currentAddress, setCurrentAddress] = useState("위치 탐색 중...");
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const [lastChatMessage] = useState({
    text: "안녕하세요! 비움이에게 무엇이든 물어보세요!",
    time: "지금",
    unreadCount: 1,
  });

  useEffect(() => {
    let isMounted = true;

    const loadKakaoMap = () =>
      new Promise((resolve, reject) => {
        try {
          const kakaoMapKey = getRequiredEnv("VITE_KAKAO_MAP_KEY");

          if (window.kakao?.maps) {
            window.kakao.maps.load(() => resolve(window.kakao));
            return;
          }

          const existingScript = document.querySelector(
            'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
          );

          if (existingScript) {
            existingScript.remove();
          }

          const script = document.createElement("script");
          script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services`;
          script.async = true;

          script.onload = () => {
            if (!window.kakao?.maps) {
              reject(new Error("Kakao SDK loaded, but window.kakao.maps is missing"));
              return;
            }

            window.kakao.maps.load(() => resolve(window.kakao));
          };

          script.onerror = () => {
            reject(new Error(`Kakao SDK load failed: ${script.src}`));
          };

          document.head.appendChild(script);
        } catch (error) {
          reject(error);
        }
      });

    const setRegionName = (geocoder, coords) => {
      if (!coords || !window.kakao?.maps?.services) return;

      const lng = coords.getLng();
      const lat = coords.getLat();

      if (!lng || !lat || Number.isNaN(lng) || Number.isNaN(lat)) {
        return;
      }

      geocoder.coord2RegionCode(lng, lat, (result, status) => {
        if (!isMounted) return;

        if (status !== window.kakao.maps.services.Status.OK) {
          setCurrentAddress("위치 확인 불가");
          return;
        }

        const region = result.find((item) => item.region_type === "H");
        setCurrentAddress(region?.region_3depth_name || region?.region_2depth_name || "위치 확인 불가");
      });
    };

    const initializeMap = () => {
      const container = document.getElementById("kakao-map");

      if (!container || !window.kakao?.maps || !isMounted) {
        setCurrentAddress("지도 설정 필요");
        return;
      }

      const defaultCoords = new window.kakao.maps.LatLng(37.4781, 126.9517);

      const map = new window.kakao.maps.Map(container, {
        center: defaultCoords,
        level: 5,
      });

      mapRef.current = map;

      if (!window.kakao.maps.services?.Geocoder) {
        setCurrentAddress("위치 확인 불가");
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      setRegionName(geocoder, defaultCoords);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (!isMounted || !window.kakao?.maps) return;

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            if (!lat || !lon || Number.isNaN(lat) || Number.isNaN(lon)) {
              setCurrentAddress("위치 확인 불가");
              return;
            }

            const currentPos = new window.kakao.maps.LatLng(lat, lon);
            map.setCenter(currentPos);
            setRegionName(geocoder, currentPos);
          },
          () => {
            if (isMounted) {
              setCurrentAddress("관악구");
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 60000,
          }
        );
      } else {
        setCurrentAddress("관악구");
      }

      window.kakao.maps.event.addListener(map, "click", () => {
        navigate("/location");
      });
    };

    loadKakaoMap()
      .then(initializeMap)
      .catch((error) => {
        console.error("카카오 지도 로딩 실패:", error);
        if (isMounted) setCurrentAddress("지도 설정 필요");
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <CommonLayout>
      <Main>
        <TitleGreen>지구를 위해,</TitleGreen>
        <TitleBlack>
          분리수거 함께
          <br />
          하실래요?
        </TitleBlack>
        <SubText>
          어떤 쓰레기인지 헷갈리셨죠?
          <br />
          제가 알려드릴게요!
        </SubText>

        <EarthBackground />
        <CharacterImage />
        <Card />

        <CategoryGrid>
          <CategoryItem onClick={() => navigate("/paper")}>
            <CategoryIcon $img={PaperIcon} />
            <CategoryText>종이</CategoryText>
          </CategoryItem>
          <CategoryItem onClick={() => navigate("/plastic")}>
            <CategoryIcon $img={PlasticIcon} />
            <CategoryText>플라스틱</CategoryText>
          </CategoryItem>
          <CategoryItem onClick={() => navigate("/glass")}>
            <CategoryIcon $img={GlassIcon} />
            <CategoryText>유리</CategoryText>
          </CategoryItem>
          <CategoryItem onClick={() => navigate("/food")}>
            <CategoryIcon $img={FtIcon} />
            <CategoryText>음식물</CategoryText>
          </CategoryItem>
          <CategoryItem onClick={() => navigate("/can")}>
            <CategoryIcon $img={CanIcon} />
            <CategoryText>캔</CategoryText>
          </CategoryItem>
          <CategoryItem onClick={() => navigate("/trash")}>
            <CategoryIcon $img={TrashIcon} />
            <CategoryText>일반쓰레기</CategoryText>
          </CategoryItem>
        </CategoryGrid>

        <LocationHeaderWrapper>
          <LocationTitle>
            <LocationSub>나의 위치 기반</LocationSub>
            <LocationMain>가까운 분리배출 장소</LocationMain>
          </LocationTitle>
          <LocationBadge>📍 {currentAddress}</LocationBadge>
        </LocationHeaderWrapper>

        <MapContainer id="kakao-map" onClick={() => navigate("/location")} />

        <ChatbotBannerSection>
          <ChatbotSubTitle>헷갈리거나 궁금하다면</ChatbotSubTitle>
          <ChatbotMainTitle>비움이와 채팅하러가기</ChatbotMainTitle>

          <ChatbotCard onClick={() => navigate("/chatbot")}>
            <ChatbotCharacterCircle />
            <ChatbotTextWrapper>
              <ChatbotNameRow>
                <ChatbotName>비움이</ChatbotName>
                <ChatbotTime>{lastChatMessage.time}</ChatbotTime>
              </ChatbotNameRow>
              <ChatbotPreviewRow>
                <ChatbotMessagePreview>{lastChatMessage.text}</ChatbotMessagePreview>
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