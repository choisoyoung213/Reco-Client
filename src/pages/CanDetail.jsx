import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CommonLayout } from "../components/CommonLayout";

import CanIcon from "../assets/img/canIcon.svg";
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
  background-image: url(${CanIcon});
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
  font-family: 'Paperlogy', sans-serif;
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
  font-family: 'Paperlogy', sans-serif;
  font-size: 14px;
  color: #333;
`;

const StepHeader = styled.div`
  font-weight: 700;
  color: #53b175;
  margin-bottom: 4px;
`;

const SubText = styled.div`
  font-family: 'Paperlogy', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  line-height: 1.6;
  word-break: keep-all;
  padding-left: 10px;
  text-indent: -10px;
`;

const Tip = styled.div`
  font-family: 'Paperlogy', sans-serif;
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
  font-family: 'Paperlogy', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #000;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const WarningList = styled.ul`
  font-family: 'Paperlogy', sans-serif;
  list-style: none;
  padding: 0;
  margin: 0;

  font-size: 13px;
  font-weight: 600;
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
const CanDetail = () => {
  const navigate = useNavigate();
  return (
    <CommonLayout>
      <PageContent>
        <HeaderContainer>
          <BackBtn onClick={() => navigate(-1)}>
            <BackIconImg src={BackIcon} alt="Back" />
          </BackBtn>
          <HeaderTitle>캔</HeaderTitle>
        </HeaderContainer>
        <MainIcon />

        <ContentCard>
          <CardTitle>캔 이렇게 버려요.</CardTitle>
          <StepList>
            <StepItem>
              <StepHeader>1. 내용물 비우기</StepHeader>
              <SubText>→ 캔 안에 남아 있는 음료나 음식물을 모두 비워주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>2. 헹구기</StepHeader>
              <SubText>→ 물로 한 번 헹궈 이물질을 제거해주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>3. 기름 제거</StepHeader>
              <SubText>→ 참치캔 등 기름이 있는 경우 키친타월로 닦아주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>4. 압축하기</StepHeader>
              <SubText>→ 캔을 찌그러뜨려 부피를 줄여주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>5. 스프레이 캔 처리</StepHeader>
              <SubText>→ 가스를 완전히 제거한 후 배출해주세요</SubText>
              <SubText>→ 위험할 수 있으니 구멍은 안전한 곳에서 뚫어주세요</SubText>
            </StepItem>
          </StepList>
          <Tip>💡 깨끗한 상태로 배출해야 재활용 가능해요</Tip>
        </ContentCard>

        <WarningCard>
          <WarningTitle>캔 / 금속 - ⚠️ 주의사항</WarningTitle>
          <WarningList>
            <li>내용물이 남아 있으면 재활용이 어려워요</li>
            <li>스프레이 캔은 가스를 제거하지 않으면 위험해요</li>
            <li>날카로운 부분에 손이 다치지 않도록 주의해주세요</li>
          </WarningList>
        </WarningCard>
      </PageContent>
    </CommonLayout>
  );
};

export default CanDetail;