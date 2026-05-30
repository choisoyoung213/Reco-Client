import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import BiumResultImg from "../assets/img/Bium_result.svg";
import RecoIcon from "../assets/img/RecoIcon.svg";
import BottomNav from "../components/BottomNav";
import ChatIcon from "../assets/img/ChatIcon.svg";

// 오염도 이모션 아이콘 로드
import GoodIcon from "../assets/img/goodIcon.svg";
import NormalIcon from "../assets/img/normalIcon.svg";
import BadIcon from "../assets/img/badIcon.svg";
import BackIcon from "../assets/img/Vector.svg";

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 📍 말풍선 설명창 열림/닫힘 상태 관리
    const [showTooltip, setShowTooltip] = useState(false);

    // 백엔드 연동 전 기본 더미 객체 정의
    const { result, capturedImage } = location.state || {
        result: { 
            item: "플라스틱 병", 
            confidence: 85,
            contamination: "good" // 👈 'good', 'normal', 'bad' 중 하나가 들어옴
        },
        capturedImage: null,
    };

    // 오염도 상태에 맞춰 아이콘을 선택해주는 함수
    const getContaminationIcon = (status) => {
        switch (status) {
            case "good": return GoodIcon;
            case "normal": return NormalIcon;
            case "bad": return BadIcon;
            default: return GoodIcon;
        }
    };

    // 💡 [신규] 오염도 상태에 맞춰 툴팁 텍스트를 반환해주는 함수
    const getContaminationText = (status) => {
        switch (status) {
            case "good": return "오염도 좋음";
            case "normal": return "오염도 보통";
            case "bad": return "오염도 나쁨";
            default: return "오염도 좋음";
        }
    };

    // 결과 저장 트리거 핸들러
    const handleSaveResult = () => {
        alert("결과가 저장되었습니다!");
    };

    return (
        <Container>
            <Header>
                <BackBtn onClick={() => navigate(-1)}><BackIconImg src={BackIcon} alt="Back" /></BackBtn>
                <Title>{result.item}</Title>
            </Header>

            <VisualSection>
                <ImageFrame>
                    <CapturedImage src={capturedImage || "https://via.placeholder.com/200"} alt="Captured" />
                </ImageFrame>
                <Character src={BiumResultImg} alt="Mascot" />
            </VisualSection>

            <AnalysisCard>
                <CardTitle>재질 분석</CardTitle>
                
                <ChartWrapper>
                    <DonutChartContainer>
                        <DonutChart>
                            <ChartCenter>
                                <EcoLabel src={RecoIcon} alt="RecoIcon" />
                            </ChartCenter>
                        </DonutChart>
                    </DonutChartContainer>
                    
                    <Legend>
                        <LegendItem><Dot color="#53B175" /> 플라스틱</LegendItem>
                        <LegendItem><Dot color="#1E3A2F" /> 유리</LegendItem>
                        <LegendItem><Dot color="#D3D3D3" /> 기타</LegendItem>
                    </Legend>
                </ChartWrapper>
                
                <EmotionIcon 
                    src={getContaminationIcon(result.contamination || "good")} 
                    alt="contamination status" 
                    onClick={() => setShowTooltip(!showTooltip)}
                />

                {showTooltip && (
                    <ContaminationTooltip onClick={() => setShowTooltip(false)}>
                        {getContaminationText(result.contamination || "good")}
                    </ContaminationTooltip>
                )}
            </AnalysisCard>

            <GuideCard>
                <GuideHeader>{result.item}은 이렇게 버려요.</GuideHeader>
                <GuideList>
                    <GuideItem>
                        <div className="num">1. 내용물 완전히 비우기</div>
                        <div className="desc">→ 병 안에 남은 음료를 완전히 비워요</div>
                    </GuideItem>
                    <GuideItem>
                        <div className="num">2. 라벨 분리</div>
                        <div className="desc">→ 병에 붙어 있는 비닐 라벨을 떼어내서 따로 버려요</div>
                    </GuideItem>
                    <GuideItem>
                        <div className="num">3. 찌그러뜨리기</div>
                        <div className="desc">→ 부피를 줄이기 위해 찌그러트려요</div>
                    </GuideItem>
                    <GuideItem>
                        <div className="num">4. 뚜껑 닫아서 배출</div>
                        <div className="desc">→ 부피를 유지하기 위해 뚜껑을 닫아 버려요</div>
                    </GuideItem>
                </GuideList>
            </GuideCard>

            <ActionButtonGroup>
                <ActionButton onClick={handleSaveResult}>결과 저장</ActionButton>
                <ActionButton onClick={() => navigate("/additional-question")}>추가 질문</ActionButton>
            </ActionButtonGroup>

            <ChatbotBtn onClick={() => navigate("/chatbot")}>
                <ChatIconImg src={ChatIcon} alt="ChatIcon" />
                <ChatText>
                    <span className="top-msg">아직 잘 모르겠다면?</span>
                    <span className="bottom-msg">
                        챗봇에게 물어보기 <span className="arrow">→</span>
                    </span>
                </ChatText>
            </ChatbotBtn>

            {/* 네브바 하단 고정 */}
            <BottomNavWrapper>
                <BottomNav />
            </BottomNavWrapper>
        </Container>
    );
};

/* ===== Styled Components ===== */
const Container = styled.div`
  width: 393px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  padding-bottom: 140px; 
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Pretendard', sans-serif;
  position: relative;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const BackBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
`;

const BackIconImg = styled.img`
  width: 12px;
  height: auto;
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 32px;
  color: #53B175;
  font-weight: 800;
  margin-right: 24px;
  font-family: 'Paperlogy-7Bold', sans-serif;
`;

const VisualSection = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
`;

const ImageFrame = styled.div`
  width: 220px;
  height: 220px;
  border: 3px solid #53B175;
  border-radius: 20px;
  overflow: hidden;
`;

const CapturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
`;

const Character = styled.img`
  position: absolute;
  width: 120px;
  right: 20px;
  bottom: 0;
`;

const AnalysisCard = styled.div`
  position: relative; 
  border: 1px solid #E0E0E0;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
`;

const CardTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  text-align: left;
  color: #272727;
  font-family: 'Paperlogy-6SemiBold', sans-serif;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 20px;
  width: 100%;
`;

const DonutChartContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
`;

const DonutChart = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(#53B175 0% 75%, #1E3A2F 75% 85%, #D3D3D3 85% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartCenter = styled.div`
  width: 100px;
  height: 100px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EcoLabel = styled.img`
    position: absolute;
`;

const EmotionIcon = styled.img`
  position: absolute;
  left: 20px;
  bottom: 16px;
  width: 38px;
  height: 38px;
  z-index: 10;
  cursor: pointer;
  
  transition: transform 0.1s ease;
  &:active {
    transform: scale(0.95); /* 누를 때 들어가는 효과 */
  }
`;

const ContaminationTooltip = styled.div`
  position: absolute;
  left: 65px;    
  bottom: 18px;  
  
  background-color: #e1e1e1;
  color: #6b6b6b;
  font-size: 13px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 20;
  cursor: pointer;
  white-space: nowrap;
  font-family: 'Paperlogy-5Medium', sans-serif;

  &::after {
    content: "";
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 4px 6px 4px 0;
    border-style: solid;
    border-color: transparent #e1e1e1 transparent transparent;
  }
`;

const Legend = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
  gap: 15px;
  width: 100%;
  padding-bottom: 5px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #272727;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const GuideCard = styled.div`
  border: 2px solid #53B175;
  border-radius: 20px;
  padding: 20px;
`;

const GuideHeader = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  text-align: left;
  color: #272727;
  font-family: 'Paperlogy-6SemiBold', sans-serif;
`;

const GuideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const GuideItem = styled.div`
  text-align: left;
  .num {
    color: #53B175;
    font-weight: bold;
    font-size: 15px;
    font-family: 'Paperlogy-6SemiBold', sans-serif;
  }
  .desc {
    color: #272727;
    font-size: 13px;
    font-weight: bold;
    margin-top: -8px;
    font-family: 'Paperlogy-6SemiBold', sans-serif;
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 14px;
  width: 100%;
`;

const ActionButton = styled.div`
  flex: 1;
  background-color: #EAEAEA;
  color: #333333;
  font-size: 16px;
  font-weight: 700;
  padding: 16px 0;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  font-family: 'Paperlogy-6SemiBold', sans-serif;
  transition: background 0.2s ease;

  &:active {
    background-color: #dcdcdc;
  }
`;

const ChatbotBtn = styled.div`
  background-color: #53B175;
  color: #fff;
  padding: 15px 25px;
  border-radius: 20px;
  display: flex;
  align-items: center; 
  justify-content: flex-start;
  gap: 15px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
`;

const ChatIconImg = styled.img`
  width: 32px;
  height: 32px;
`;

const ChatText = styled.div`
  display: flex;
  flex-direction: column; 
  align-items: flex-start;
  gap: 4px;
  font-family: 'Paperlogy-6SemiBold', sans-serif;

  .top-msg {
    font-size: 12px;
    font-weight: 500;
  }

  .bottom-msg {
    font-size: 16px;
    font-weight: 800;
    display: flex;
    align-items: center;
    margin-top: -10px;
    gap: 5px;
  }
  
  .arrow {
    font-size: 16px;
  }
`;

const BottomNavWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 393px;
  z-index: 1000;
  background-color: #fff;
`;

export default ResultPage;