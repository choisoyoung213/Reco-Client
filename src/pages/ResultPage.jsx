import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import BiumResultImg from "../assets/img/Bium_result.svg";
import EcoLabelIcon from "../assets/img/RecoIcon.svg";
import BottomNav from "../components/BottomNav";
import ChatIcon from "../assets/img/ChatIcon.svg";

// 오염도 이모션 아이콘 로드
import GoodIcon from "../assets/img/goodIcon.svg";
import NormalIcon from "../assets/img/normalIcon.svg";
import BadIcon from "../assets/img/badIcon.svg";
import BackIcon from "../assets/img/Vector.svg";
import { getRequiredEnv } from "../config/env";

const SPRING_API_BASE = getRequiredEnv("VITE_SPRING_API_BASE_URL");

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showTooltip, setShowTooltip] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const autoSaveAttemptedRef = useRef(false);

  // 📍 더미 데이터 제거 및 백엔드 라우팅 데이터 구조 완전 정착
  const { result, capturedImage, file } = location.state || {};

  // 데이터가 없을 경우 비정상 접근이므로 이전 페이지로 튕겨버리는 방어 코드 추가
  useEffect(() => {
    if (!result) {
      alert("분석 결과 데이터가 존재하지 않습니다.");
      navigate(-1);
    }
  }, [result, navigate]);

  if (!result) return null;

  const resultTitle =
    result.itemName ||
    result.item ||
    result.waste_type_ko ||
    result.primaryMaterial ||
    result.primary_material ||
    "분석 결과";

  const getContaminationIcon = (status) => {
    switch (status) {
      case "good": return GoodIcon;
      case "normal": return NormalIcon;
      case "bad": return BadIcon;
      default: return GoodIcon;
    }
  };

  const getContaminationText = (status) => {
    switch (status) {
      case "good": return "오염도 좋음";
      case "normal": return "오염도 보통";
      case "bad": return "오염도 나쁨";
      default: return "오염도 좋음";
    }
  };

  const saveResult = useCallback(
    async ({ silent = false } = {}) => {
      if (isSaving || isSaved) return false;

      try {
        setIsSaving(true);

        const payload = {
          userId: localStorage.getItem("userId"),
          imageUrl: result.imageUrl || capturedImage,
          itemName: result.itemName || result.item,
          item: result.item || result.itemName,
          primaryMaterial: result.primaryMaterial,
          isRecyclable: result.isRecyclable,
          disposalMethodSummary: result.disposalMethodSummary,
          disposalSteps: result.disposalSteps,
          aiSummary: result.aiSummary,
          contaminationStatus: result.contaminationStatus || "good",
          confidence: result.confidence || 90,
        };

        const response = await fetch(`${SPRING_API_BASE}/api/analysis`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "저장 요청에 실패했습니다.");
        }

        setIsSaved(true);

        if (!silent) {
          alert(data.message || "결과가 저장되었습니다.");
        }

        return true;
      } catch (error) {
        console.error(error);
        if (!silent) {
          alert(error.message || "저장에 실패했습니다.");
        }
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [capturedImage, isSaved, isSaving, result],
  );

  useEffect(() => {
    if (autoSaveAttemptedRef.current) return;
    if (localStorage.getItem("autoSave") !== "true") return;

    const autoSaveKey = [
      "reco-auto-save",
      result.analysisId || result.id || result.itemName || result.item,
      result.imageUrl || capturedImage?.slice(0, 80) || "",
    ].join(":");

    if (sessionStorage.getItem(autoSaveKey)) return;

    autoSaveAttemptedRef.current = true;
    sessionStorage.setItem(autoSaveKey, "pending");

    saveResult({ silent: true }).then((saved) => {
      if (saved) {
        sessionStorage.setItem(autoSaveKey, "saved");
        return;
      }
      sessionStorage.removeItem(autoSaveKey);
    });
  }, [capturedImage, result, saveResult]);

  const handleSaveResult = () => {
    saveResult();
  };
  
  const disposalSteps = result.disposalMethodSummary
    ? result.disposalMethodSummary.split("\n")
    : result.disposalSteps || [];

  const normalizePercent = (value) => {
    const percent =
      typeof value === "string"
        ? Number.parseFloat(value.replace("%", ""))
        : Number(value);

    if (!Number.isFinite(percent)) return 0;
    if (percent > 0 && percent <= 1) return percent * 100;

    return percent;
  };

  const getMaterialLabel = (item) =>
  item.label ||
  item.material ||
  item.materialName ||
  item.name ||
  item.className ||
  item.type ||
  item.category ||
  item.waste_type_ko ||
  "";

const getMaterialPercent = (item) =>
  normalizePercent(
    item.percent ??
      item.percentage ??
      item.probability ??
      item.score ??
      item.confidence ??
      item.value ??
      item.ratio,
  );

  const hasMaterialProbabilityData = (value) =>
    Array.isArray(value)
      ? value.length > 0
      : value && typeof value === "object";

  // 📝 백엔드 응답 규격 파싱 함수: 문자열/배열/객체 모두 대응
  const parseMaterialProbabilities = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value
        .map((item) => ({
          label: getMaterialLabel(item),
          percent: getMaterialPercent(item),
        }))
        .filter((item) => item.label);
    }

    if (typeof value === "object") {
      return Object.entries(value).map(([label, percent]) => ({
        label,
        percent: normalizePercent(percent),
      }));
    }

    const text = String(value);
    const matches = [
      ...text.matchAll(
        /(?:label|material|name)=([^,}]+).*?(?:percent|percentage|probability|score|confidence)=([\d.]+)/g,
      ),
    ];

    if (matches.length > 0) {
      return matches.map((match) => ({
        label: match[1].trim(),
        percent: normalizePercent(match[2]),
      }));
    }

    return text
      .split(/[,\n]/)
      .map((part) => {
        const match = part.match(/([^:()]+)[:(]\s*([\d.]+)%?\)?/);

        if (!match) return null;

        return {
          label: match[1].trim(),
          percent: normalizePercent(match[2]),
        };
      })
      .filter(Boolean);
  };

  const rawMaterialData = parseMaterialProbabilities(
    hasMaterialProbabilityData(result.materialProbabilities)
      ? result.materialProbabilities
      : [
          {
            label:
              result.primaryMaterial ||
              result.primary_material ||
              resultTitle,
            percent: result.confidence || 100,
          },
        ],
  );
  
  // 1. 높은 확률순 내림차순 정렬
  let sortedMaterialData = [...rawMaterialData].sort((a, b) => b.percent - a.percent);

  // 2. 💡 확률이 0%인 재질은 완벽하게 배제 (실물 그래프에 매핑된 것만 추출)
  sortedMaterialData = sortedMaterialData.filter(item => item.percent > 0);

  const contaminationStatus = result.contaminationStatus || "good";

  // 🎨 도넛 차트 순위별 고정 색상 팔레트
  const colorPalette = ["#53B175", "#1E3A2F", "#D3D3D3"];
  const chartBackground =
    sortedMaterialData.length > 0
      ? (() => {
          const segments = sortedMaterialData.reduce(
            (acc, item, index) => {
              const start = acc.total;
              const end = Math.min(start + item.percent, 100);
              const color = colorPalette[index] || "#D3D3D3";

              return {
                total: end,
                values: [...acc.values, `${color} ${start}% ${end}%`],
              };
            },
            { total: 0, values: [] },
          );

          if (segments.total < 100) {
            segments.values.push(`#E5E5E5 ${segments.total}% 100%`);
          }

          return `conic-gradient(${segments.values.join(", ")})`;
        })()
      : "#E5E5E5";

  return (
    <Container>
      <Header>
        <BackBtn onClick={() => navigate("/")}>
          <BackIconImg src={BackIcon} alt="Back" />
        </BackBtn>
        <Title>{resultTitle}</Title>
      </Header>

      <VisualSection>
        <ImageFrame>
          <CapturedImage
            src={capturedImage || "https://via.placeholder.com/200"}
            alt="Captured"
          />
        </ImageFrame>
        <Character src={BiumResultImg} alt="Mascot" />
      </VisualSection>

      <AnalysisCard>
        <CardTitle>재질 분석</CardTitle>

        <ChartWrapper>
          <DonutChartContainer>
            <DonutChart
              style={{
                background: chartBackground,
              }}
            >
              <ChartCenter>
                <EcoLabel src={EcoLabelIcon} alt="EcoLabelIcon" />
              </ChartCenter>
            </DonutChart>
          </DonutChartContainer>

          <Legend>
            {/* 💡 확률 분포 데이터가 실재하는 요소만 범례(Legend) 컴포넌트로 동적 매핑 */}
            {sortedMaterialData.map((item, index) => {
              const dotColor = colorPalette[index] || "#D3D3D3";
              return (
                <LegendItem key={index}>
                  <Dot color={dotColor} /> {item.label} (
                  {Math.round(item.percent)}%)
                </LegendItem>
              );
            })}
          </Legend>
        </ChartWrapper>

        <EmotionIcon
          src={getContaminationIcon(contaminationStatus)}
          alt="contamination status"
          onClick={() => setShowTooltip(!showTooltip)}
        />

        {showTooltip && (
          <ContaminationTooltip onClick={() => setShowTooltip(false)}>
            {getContaminationText(contaminationStatus)}
          </ContaminationTooltip>
        )}
      </AnalysisCard>

      <GuideCard>
        <GuideHeader>{resultTitle}은 이렇게 버려요.</GuideHeader>
        <GuideList>
          {disposalSteps.length > 0 ? (
            disposalSteps.map((step, index) => (
              <GuideItem key={index}>
                <div className="num">{step}</div>
              </GuideItem>
            ))
          ) : (
            <GuideItem>
              <div className="num">분리배출 방법을 불러오는 중...</div>
            </GuideItem>
          )}
        </GuideList>
      </GuideCard>

      <ActionButtonGroup>
        <ActionButton onClick={handleSaveResult}>
          {isSaving ? "저장 중..." : isSaved ? "저장 완료" : "결과 저장"}
        </ActionButton>
        <ActionButton
          onClick={() =>
            navigate("/additional-question", {
              state: {
                result,
                file,
                capturedImage,
                questionType: result?.questionType || "general_reanalysis",
              },
            })
          }
        >
          추가 질문
        </ActionButton>
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
  font-family: "Pretendard", sans-serif;
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
  color: #53b175;
  font-weight: 800;
  margin-right: 24px;
  font-family: "Paperlogy-7Bold", sans-serif;
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
  border: 3px solid #53b175;
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
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  text-align: left;
  color: #272727;
  font-family: "Paperlogy-6SemiBold", sans-serif;
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
  &:active { transform: scale(0.95); }
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
  font-family: "Paperlogy-5Medium", sans-serif;

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
  justify-content: center;
  flex-wrap: wrap;
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
  background-color: ${(props) => props.color};
`;

const GuideCard = styled.div`
  border: 2px solid #53b175;
  border-radius: 20px;
  padding: 20px;
`;

const GuideHeader = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  text-align: left;
  color: #272727;
  font-family: "Paperlogy-6SemiBold", sans-serif;
`;

const GuideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const GuideItem = styled.div`
  text-align: left;
  .num {
    color: #53b175;
    font-weight: bold;
    font-size: 15px;
    font-family: "Paperlogy-6SemiBold", sans-serif;
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
  background-color: #eaeaea;
  color: #333333;
  font-size: 16px;
  font-weight: 700;
  padding: 16px 0;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  font-family: "Paperlogy-6SemiBold", sans-serif;
  transition: background 0.2s ease;
  &:active { background-color: #dcdcdc; }
`;

const ChatbotBtn = styled.div`
  background-color: #53b175;
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
  font-family: "Paperlogy-6SemiBold", sans-serif;

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
