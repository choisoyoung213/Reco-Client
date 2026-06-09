import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CommonLayout } from "../components/CommonLayout";

import TrashIcon from "../assets/img/trashIcon.svg";
import BackIcon from "../assets/img/Vector.svg";

/* ===== Styles (공통) ===== */
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
  background-image: url(${TrashIcon});
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
const TrashDetail = () => {
  const navigate = useNavigate();
  return (
    <CommonLayout>
      <PageContent>
        <HeaderContainer>
          <BackBtn onClick={() => navigate(-1)}>
            <BackIconImg src={BackIcon} alt="Back" />
          </BackBtn>
          <HeaderTitle>일반쓰레기</HeaderTitle>
        </HeaderContainer>
        <MainIcon />

        <ContentCard>
          <CardTitle>일반쓰레기 이렇게 버려요.</CardTitle>
          <StepList>
            <StepItem>
              <StepHeader>1. 재활용 여부 확인</StepHeader>
              <SubText>→ 재활용이 어려운 쓰레기만 따로 모아주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>2. 종량제 봉투 사용</StepHeader>
              <SubText>→ 지정된 쓰레기 봉투에 담아 배출해주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>3. 오염된 재활용 처리</StepHeader>
              <SubText>→ 이물질이 묻은 재활용품은 일반쓰레기로 버려주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>4. 대표적인 품목</StepHeader>
              <SubText>→ 휴지, 기저귀, 칫솔, 깨진 유리 등이 해당됩니다</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>5. 혼합 재질 주의</StepHeader>
              <SubText>→ 여러 재질이 섞여 분리가 어려운 경우 일반쓰레기로 버려주세요</SubText>
            </StepItem>
          </StepList>
          <Tip>💡 헷갈릴 때는 일반쓰레기로 버리는 것이 안전해요</Tip>
        </ContentCard>

        <WarningCard>
          <WarningTitle>일반쓰레기 - ⚠️ 주의사항</WarningTitle>
          <WarningList>
            <li>재활용 가능한 자원을 함께 버리지 않도록 주의해주세요</li>
            <li>종량제 봉투를 사용하지 않으면 수거되지 않을 수 있어요</li>
            <li>지역별 배출 규칙을 확인하는 것이 좋아요</li>
          </WarningList>
        </WarningCard>
      </PageContent>
    </CommonLayout>
  );
};

export default TrashDetail;