import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CommonLayout } from "../components/CommonLayout";

// 이미지
import PaperIcon from "../assets/img/paperIcon.svg";
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
  background-image: url(${PaperIcon});
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
const PaperDetail = () => {
    const navigate = useNavigate();

    return (
        <CommonLayout>
            <PageContent>
                <HeaderContainer>
                    <BackBtn onClick={() => navigate(-1)}>
                        <BackIconImg src={BackIcon} alt="Back" />
                    </BackBtn>
                    <HeaderTitle>종이</HeaderTitle>
                </HeaderContainer>

                <MainIcon />

                <ContentCard>
                    <CardTitle>종이 이렇게 버려요.</CardTitle>
                    <StepList>
                        <StepItem>
                            <StepHeader>1. 이물질 제거</StepHeader>
                            <SubText>→ 음식물이나 물기가 묻지 않도록 깨끗하게 해주세요</SubText>
                            <SubText>→ 오염된 종이는 재활용이 어렵습니다</SubText>
                        </StepItem>
                        <StepItem>
                            <StepHeader>2. 부피 줄이기</StepHeader>
                            <SubText>→ 박스는 접고 신문지는 묶어서 배출해주세요</SubText>
                            <SubText>→ 부피를 줄이면 수거가 훨씬 쉬워요</SubText>
                        </StepItem>
                        <StepItem>
                            <StepHeader>3. 다른 재질 제거</StepHeader>
                            <SubText>→ 테이프, 비닐, 스티커 등은 반드시 떼어내 주세요</SubText>
                            <SubText>→ 종이가 아닌 재질이 섞이면 재활용이 불가능해요</SubText>
                        </StepItem>
                        <StepItem>
                            <StepHeader>4. 종이 구분하기</StepHeader>
                            <SubText>→ 코팅된 종이(영수증 등)는 일반쓰레기로 버려주세요</SubText>
                            <SubText>→ 일반 종이와 함께 버리면 재활용이 어렵습니다</SubText>
                        </StepItem>
                    </StepList>
                    <Tip>💡 깨끗하고 마른 종이만 재활용 가능해요</Tip>
                </ContentCard>

                <WarningCard>
                    <WarningTitle>종이류 - ⚠️ 주의사항</WarningTitle>
                    <WarningList>
                        <li>젖거나 기름이 묻은 종이는 재활용이 불가능해요</li>
                        <li>코팅된 종이(영수증, 종이컵)는 일반쓰레기로 버려요</li>
                        <li>테이프나 스티커가 붙어 있으면 꼭 제거해주세요</li>
                    </WarningList>
                </WarningCard>
            </PageContent>
        </CommonLayout>
    );
};

export default PaperDetail;