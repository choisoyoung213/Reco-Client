import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CommonLayout } from "../components/CommonLayout";

import GlassIcon from "../assets/img/glassIcon.svg";
import BackIcon from "../assets/img/Vector.svg";

/* ===== Styles (기존과 동일) ===== */
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
  background-image: url(${GlassIcon});
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
const GlassDetail = () => {
  const navigate = useNavigate();
  return (
    <CommonLayout>
      <PageContent>
        <HeaderContainer>
          <BackBtn onClick={() => navigate(-1)}>
            <BackIconImg src={BackIcon} alt="Back" />
          </BackBtn>
        <HeaderTitle>유리</HeaderTitle>
        </HeaderContainer>
        <MainIcon />

        <ContentCard>
          <CardTitle>유리 이렇게 버려요.</CardTitle>
          <StepList>
            <StepItem>
              <StepHeader>1. 내용물 비우기</StepHeader>
              <SubText>→ 병 안에 남아 있는 음료나 내용물을 모두 비워주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>2. 뚜껑 분리</StepHeader>
              <SubText>→ 금속이나 플라스틱으로 된 뚜껑은 분리해서 버려주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>3. 세척하기</StepHeader>
              <SubText>→ 가능하다면 물로 한 번 헹궈 깨끗하게 해주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>4. 안전하게 배출</StepHeader>
              <SubText>→ 깨지지 않도록 조심해서 배출해주세요</SubText>
              <SubText>→ 깨진 유리는 신문지에 싸서 일반쓰레기로 버려주세요</SubText>
            </StepItem>
            <StepItem>
              <StepHeader>5. 유리 구분하기</StepHeader>
              <SubText>→ 도자기, 거울, 내열유리는 재활용이 되지 않아요</SubText>
            </StepItem>
          </StepList>
          <Tip>💡 유리는 "병만" 재활용 가능해요</Tip>
        </ContentCard>

        <WarningCard>
          <WarningTitle>유리 - ⚠️ 주의사항</WarningTitle>
          <WarningList>
            <li>깨진 유리는 재활용이 불가능해요</li>
            <li>도자기, 거울, 내열유리는 함께 버리면 안 돼요</li>
            <li>배출 시 다치지 않도록 주의해주세요</li>
          </WarningList>
        </WarningCard>
      </PageContent>
    </CommonLayout>
  );
};

export default GlassDetail;