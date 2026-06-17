import InputLogin from "../components/InputLogin.jsx";
import SnsLogin from "../components/SnsLogin.jsx";
import { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { getRequiredEnv } from "../config/env";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 40px 24px;
  gap: 16px;
  color: #272727;
  font-family: "Paperlogy";
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  margin-top: 150px;
`;

const SubTitle = styled.p`
  margin-bottom: 5px;
  text-align: left;
`;

const Title = styled.p`
  font-family: "Paperlogy";
  font-size: 24px;
  font-weight: 600;
  line-height: 20px;
  color: #272727;
  margin-bottom: 30px;
  text-align: left;
`;

const GreenText = styled.span`
  color: #53b175;
`;

const Button = styled.button`
  width: 100%;
  height: 54px;
  border-radius: 10px;
  background: #53b175;
  border: none;
  color: white;
  font-family: "Paperlogy";
  font-size: 16px;
  cursor: pointer;
  margin-top: 25px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)}; /* 비활성화시 흐리게 */
`;

const LoginText = styled.p`
  font-family: "Paperlogy";
  font-size: 11px;
  font-weight: 400;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.8);
  text-align: left;
`;

const LoginLink = styled.span`
  font-family: "Paperlogy";
  font-size: 11px;
  font-weight: 500;
  line-height: 20px;
  color: rgba(100, 178, 148, 0.8);
  cursor: pointer;
`;

const ErrorMsg = styled.p`
  font-size: 11px;
  color: red;
  font-family: "Paperlogy";
`;

const Login = () => {
  const navigate = useNavigate();
  const SPRING_API_BASE = getRequiredEnv("VITE_SPRING_API_BASE_URL");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    if (!userId || !password) {
      setErrorMsg("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setErrorMsg("");

      const response = await fetch(`${SPRING_API_BASE}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userId,
          password: password,
        }),
      });

      if (!response.ok) {
        setErrorMsg("아이디 또는 비밀번호가 일치하지 않습니다.");
        return;
      }

      const data = await response.json();

      localStorage.setItem("userId", data.id);
      localStorage.setItem("username", data.username || userId);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          username: data.username || userId,
        }),
      );

      navigate("/");
    } catch (error) {
      console.error("로그인 오류:", error);
      setErrorMsg("서버 연결에 실패했습니다.");
    }
  };

  return (
    <Container>
      <div>
        <SubTitle>다시 만나서 반갑습니다!</SubTitle>
        <Title>
          3초만에 <GreenText>로그인</GreenText> 완료하기
        </Title>
      </div>

      <InputLogin
        label="아이디"
        placeholder="아이디를 입력하시오"
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <InputLogin
        label="비밀번호"
        placeholder="비밀번호를 입력하시오"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}

      <Button onClick={handleLogin} disabled={!userId || !password}>
        로그인
      </Button>
      <LoginText>
        아직 회원이 아니신가요?{" "}
        <Link to="/signup">
          <LoginLink>회원가입</LoginLink>
        </Link>
      </LoginText>
      <SnsLogin />
    </Container>
  );
};

export default Login;
