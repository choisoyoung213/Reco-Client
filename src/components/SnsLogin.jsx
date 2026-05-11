// sns계정 로그인 텍스트 + 구글 + 카카오 묶음
import styled from "styled-components"
import googleIcon from "../assets/google.png"
import kakaoIcon from "../assets/kakao.png"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`

const SnsText = styled.p`
  font-family: 'Pretendard Variable';
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.50);
`

const BtnWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`

const IconButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: white;
  cursor: pointer;
  padding: 0;
`

const IconImg = styled.img`
  width: 44px;
  height: 44px;
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const Line = styled.div`
  flex: 1;
  height: 1px;
  background: #E2E8F0;
`

const SnsLogin = () => {
  const handleGoogleLogin = () => {
    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const REDIRECT_URI = "http://localhost:5173/oauth/google"
    const SCOPE = "email profile"

    window.location.href =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`
  }

  const handleKakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY
    const REDIRECT_URI = "http://localhost:5173/oauth/kakao"

    window.location.href =
      `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
  }

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
  )
}

export default SnsLogin