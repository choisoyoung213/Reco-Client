import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const ScanPage = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null); // 👈 Base64 변환을 위한 숨겨진 캔버스 Ref 추가
  const navigate = useNavigate();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // 후면 카메라 사용
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("카메라를 시작할 수 없습니다:", err);
        navigate(-1);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [navigate]);

  // [핵심 함수] iOS 보안 이슈를 우회하는 캡처 및 데이터 인코딩 로직
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    // 비디오의 실제 해상도 크기만큼 캔버스 사이즈를 동적으로 맞춰줌
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 캔버스에 현재 카메라 화면을 그대로 그리기
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 캔버스에 그려진 이미지를 고유 문자열 데이터(base64)로 추출 (압축률 0.8)
    const base64ImageData = canvas.toDataURL("image/jpeg", 0.8);

    // 가상의 분석 데이터 구조와 함께 base64 이미지 전달
    navigate("/result", {
      state: {
        result: { item: "플라스틱 병", confidence: 92 },
        capturedImage: base64ImageData, // 👈 SSL 에러를 완벽하게 막아주는 데이터 포맷
      },
    });
  };

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>←</BackButton>
      <GuideText>
        분리배출할 품목을
        <br />
        가이드 안에 맞춰주세요
      </GuideText>

      {/* 비디오 화면 출력 (정방향 세팅 유지) */}
      <Video ref={videoRef} autoPlay playsInline muted />
      <ScanFrame />

      {/* 화면에는 보이지 않는 변환용 캔버스 크기 고정 */}
      <HiddenCanvas ref={canvasRef} />

      <BottomNav onCapture={handleCapture} />
    </Container>
  );
};

/* ===== Styled Components ===== */
const Container = styled.div`
  position: relative;
  width: 393px;
  height: 100vh;
  margin: 0 auto;
  background-color: #000;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1) !important;
`;

const HiddenCanvas = styled.canvas`
  display: none; /* 화면 렌더링에서 완전히 제외하여 숨김 */
`;

const BackButton = styled.div`
  position: absolute;
  top: 40px;
  left: 20px;
  color: white;
  font-size: 24px;
  z-index: 10;
  cursor: pointer;
`;

const GuideText = styled.div`
  position: absolute;
  top: 100px;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
  z-index: 10;
  line-height: 1.4;
`;

const ScanFrame = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
  border: 3px solid #53b175;
  border-radius: 20px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  z-index: 5;
  pointer-events: none;
`;

export default ScanPage;