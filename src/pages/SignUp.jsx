import InputLogin from "../components/InputLogin.jsx";
import SnsLogin from "../components/SnsLogin.jsx";
import { useState } from "react"
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 40px 24px;
    gap: 16px;

    color: #272727;
    font-family: 'Paperlogy';
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    margin-top: 120px;
`

const SubTitle = styled.p`
    margin-bottom: 5px;
    text-align: left;
`

const Title = styled.p`
    font-family: 'Paperlogy';
    font-size: 24px;
    font-weight: 600;
    line-height: 20px;
    color: #272727;
    margin-bottom: 30px;
    text-align: left;
`

const GreenText = styled.span`
    color: #53B175;
`

const Button = styled.button`
    width: 100%;
    height: 54px;
    border-radius: 10px;
    background: #53B175;
    border: none;
    color: white;
    font-family: 'Paperlogy';
    font-size: 16px;
    cursor: pointer;
    margin-top: 25px;

    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

const LoginText = styled.p`
    font-family: 'Paperlogy';
    font-size: 11px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.80);
    text-align: left;
`

const LoginLink = styled.span`
    font-family: 'Paperlogy';
    font-size: 11px;
    font-weight: 500;
    line-height: 20px;
    color: rgba(100, 178, 148, 0.80);
    cursor: pointer;
`

const ErrorMsg = styled.p`
    font-size: 11px;
    color: red;
    font-family: 'Paperlogy';
`

const SignUp = () => {
    const navigate = useNavigate()

    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const [passwordCheck, setPasswordCheck] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const handleSignUp = () => {
        if (!userId || !password || !passwordCheck) {
            setErrorMsg("모든 항목을 입력해주세요.")
            return
        }

        if (password !== passwordCheck) {
            setErrorMsg("비밀번호가 일치하지 않습니다.")
            return
        }

        setErrorMsg("")

        // 나중에 여기서 API 호출
        navigate("/login")
    }

    return (
        <Container>
            <div>
                <SubTitle>안녕하세요, 처음 만나서 반가워요!</SubTitle>
                <Title>
                    3초만에 <GreenText>회원가입</GreenText> 완료하기
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

            <InputLogin
                label="비밀번호 확인"
                placeholder="비밀번호를 확인하시오"
                type="password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
            />

            {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}

            <Button
                onClick={handleSignUp}
                disabled={!userId || !password || !passwordCheck}
            >
                회원가입
            </Button>

            <LoginText>
                이미 계정이 있으신가요?{" "}
                <Link to="/login">
                    <LoginLink>로그인</LoginLink>
                </Link>
            </LoginText>

            <SnsLogin />
        </Container>
    )
}

export default SignUp