// sns계정 로그인 텍스트 + 구글 + 카카오 묶음
import styled from "styled-components";
import googleIcon from "../assets/google.png";
import kakaoIcon from "../assets/kakao.png";
import { getRequiredEnv } from "../config/env";
import { useGoogleLogin } from "@react-oauth/google";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const SnsText = styled.p`
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.5);
`;

const BtnWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const IconButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: white;
  cursor: pointer;
  padding: 0;
`;

const IconImg = styled.img`
  width: 44px;
  height: 44px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background: #e2e8f0;
`;

const SnsLogin = () => {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        ).then((res) => res.json());

        const response = await fetch(
          `${getRequiredEnv("VITE_SPRING_API_BASE_URL")}/api/auth/social`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: "GOOGLE",
              providerUserId: userInfo.sub,
              username: userInfo.name,
              profileImageUrl: userInfo.picture || "",
            }),
          },
        );

        const user = await response.json();

        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.username);

        window.location.href = "/";
      } catch (error) {
        console.error("구글 로그인 실패:", error);
        alert("구글 로그인에 실패했습니다.");
      }
    },
  });

  const handleKakaoLogin = () => {
    try {
      const REST_API_KEY = getRequiredEnv("VITE_KAKAO_REST_API_KEY");
      const REDIRECT_URI = getRequiredEnv("VITE_KAKAO_REDIRECT_URI");

      window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Wrapper>
      <Divider>
        <Line />
        <SnsText>SNS 계정으로 로그인</SnsText>
        <Line />
      </Divider>

      <BtnWrapper>
        <IconButton type="button" onClick={handleGoogleLogin}>
          <IconImg src={googleIcon} alt="구글 로그인" />
        </IconButton>

        <IconButton type="button" onClick={handleKakaoLogin}>
          <IconImg src={kakaoIcon} alt="카카오 로그인" />
        </IconButton>
      </BtnWrapper>
    </Wrapper>
  );
};

export default SnsLogin;
