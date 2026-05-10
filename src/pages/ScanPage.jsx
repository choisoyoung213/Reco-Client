import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const ScanPage = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error(err);
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

  const handleCapture = () => {
    navigate("/result");
  };

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>←</BackButton>
      <GuideText>
        분리배출할 품목을
        <br />
        가이드 안에 맞춰주세요
      </GuideText>

      <Video ref={videoRef} autoPlay playsInline muted />
      <ScanFrame />

      <BottomNav onCapture={handleCapture} />
    </Container>
  );
};

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
`;

export default ScanPage;