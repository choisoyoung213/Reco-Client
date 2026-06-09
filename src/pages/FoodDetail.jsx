import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CommonLayout } from "../components/CommonLayout";

import FtIcon from "../assets/img/ftIcon.svg";
import BackIcon from "../assets/img/Vector.svg";

/* ===== Styles ===== */
const PageContent = styled.div`
  padding: 40px 25px;
  text-align: left;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
`;

const BackBtn = styled.div`
  position: absolute;
  left: 0;
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

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-family: 'Paperlogy', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: #53b175;
  margin: 0; 
`;

const MainIcon = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  background-image: url(${FtIcon}); /* FtIcon 사용 */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const ContentCard = styled.div`
  border: 1px solid #53b175;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  font-family: 'Paperlogy';
  font-weight: 600;
  font-size: 20px;
  color: #000;
  margin-bottom: 20px;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StepItem = styled.div`
  font-family: 'Paperlogy';
  font-size: 14px;
  color: #333;
`;

const StepHeader = styled.div`
  font-weight: 700;
  color: #53b175;
  margin-bottom: 4px;
`;

const SubText = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #555;
  line-height: 1.6;
  word-break: keep-all;
  padding-left: 10px;
  text-indent: -10px;
`;

const Tip = styled.div`
  margin-top: 20px;
  font-weight: 700;
  font-size: 13px;
  color: #53b175;
  text-align: center;
`;

const WarningCard = styled.div`
  border: 1px solid #ff4d4f;
  border-radius: 20px;
  padding: 20px;
`;

const WarningTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #000;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const WarningList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  line-height: 1.6;
  text-align: left;
  word-break: keep-all;

  li {
    margin-bottom: 8px;
    position: relative;
    padding-left: 12px;
  }
`;

/* ===== Component ===== */
const FoodDetail = () => {
  const navigate = useNavigate();
  return (
    <CommonLayout>
      <PageContent>
        <HeaderContainer>
          <BackBtn onClick={() => navigate(-1)}>
            <BackIconImg src={BackIcon} alt="Back" />
          </BackBtn>
          <HeaderTitle>음식물 쓰레기</HeaderTitle>
        </HeaderContainer>
        <MainIcon />

        <ContentCard>
          <CardTitle>음식물 이렇게 버려요.</CardTitle>
          <StepList>
            <StepItem>
              <StepHeader>1. 물기 제거</StepHeader>
              <SubText>→ 음식물에 있는 국물이나 물기를 최대한 빼주세요</SubText>
              <SubText>→ 물기가 많으면 처리 비용이 증가해요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>2. 음식물만 분리</StepHeader>
              <SubText>→ 밥, 채소, 과일 등 음식물만 따로 모아서 배출해주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>3. 일반쓰레기 구분</StepHeader>
              <SubText>→ 뼈, 조개껍데기, 씨앗 등은 일반쓰레기로 버려주세요</SubText>
              <SubText>→ 분해가 어려운 것은 음식물로 처리되지 않아요 </SubText>
            </StepItem>
            <StepItem>
              <StepHeader>4. 이물질 제거</StepHeader>
              <SubText>→ 비닐, 이쑤시개 등 음식물이 아닌 것은 제거해주세요</SubText>
            </StepItem>
          </StepList>
          <Tip>💡 “먹을 수 있는 것” 기준으로 생각하면 쉬워요</Tip>
        </ContentCard>

        <WarningCard>
          <WarningTitle>음식물 - ⚠️ 주의사항</WarningTitle>
          <WarningList>
            <li>뼈, 껍데기, 씨앗은 음식물이 아니에요</li>
            <li>비닐, 이쑤시개 등 이물질이 섞이면 안돼요</li>
            <li>물기가 많으면 처리 비용이 증가해요</li>
          </WarningList>
        </WarningCard>
      </PageContent>
    </CommonLayout>
  );
};

export default FoodDetail;