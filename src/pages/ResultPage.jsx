import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import BiumResultImg from "../assets/img/Bium_result.svg";
import RecoIcon from "../assets/img/RecoIcon.svg"
import BottomNav from "../components/BottomNav";
import ChatIcon from "../assets/img/ChatIcon.svg"

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { result, capturedImage } = location.state || {
        result: { item: "플라스틱 병", confidence: 85 },
        capturedImage: null,
    };

    return (
        <Container>
            <Header>
                <BackBtn onClick={() => navigate(-1)}>&lt;</BackBtn>
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
                    <DonutChart>
                        <ChartCenter>
                            <EcoLabel src={RecoIcon} alt="RecoIcon" />
                        </ChartCenter>
                    </DonutChart>
                    <Legend>
                        <LegendItem><Dot color="#53B175" /> 플라스틱</LegendItem>
                        <LegendItem><Dot color="#1E3A2F" /> 유리</LegendItem>
                        <LegendItem><Dot color="#D3D3D3" /> 기타</LegendItem>
                    </Legend>
                </ChartWrapper>
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

const Container = styled.div`
  width: 393px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  /* 네브바 높이만큼 하단 패딩을 주어 챗봇 버튼이 가려지지 않게 함 */
  padding-bottom: 120px; 
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Pretendard', sans-serif;
  position: relative;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const BackBtn = styled.div`
  font-size: 20px;
  cursor: pointer;
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
`;

const Character = styled.img`
  position: absolute;
  width: 120px;
  right: 20px;
  bottom: 0;
`;

const AnalysisCard = styled.div`
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
`;

const DonutChart = styled.div`
  width: 150px;
  height: 150px;
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

const Legend = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
  gap: 15px;
  width: 100%;
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

const ChatbotBtn = styled.div`
  background-color: #53B175;
  color: #fff;
  padding: 15px 25px;
  border-radius: 20px;
  display: flex;
  align-items: center; /* 아이콘과 텍스트 뭉치를 세로 중앙 정렬 */
  justify-content: flex-start; /* 왼쪽부터 정렬 */
  gap: 15px; /* 아이콘과 텍스트 사이 간격 */
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
  align-items: flex-start; /* 왼쪽 정렬 */
  gap: 4px; /* 위아래 문구 사이 간격 */
    font-family: 'Paperlogy-6SemiBold', sans-serif;

  .top-msg {
    font-size: 12px;
    font-weight: 500;
  }

  .bottom-msg {
    font-size: 16px;
    font-weight: 800; /* 두껍게 */
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
  position: fixed; /* absolute에서 fixed로 변경하여 화면 하단에 고정 */
  bottom: 0;
  left: 50%;
  transform: translateX(-50%); /* 가로 중앙 정렬 */
  width: 393px; /* 컨테이너와 동일한 너비 */
  z-index: 1000;
  background-color: #fff;
`;

export default ResultPage;