import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getRequiredEnv } from "../config/env";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { provider } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const login = async () => {
      const code = searchParams.get("code");

      if (!code) {
        alert("SNS 로그인에 실패했습니다.");
        navigate("/login");
        return;
      }

      try {
        const SPRING_API_BASE = getRequiredEnv("VITE_SPRING_API_BASE_URL");

        const res = await fetch(
          `${SPRING_API_BASE}/api/auth/${provider}/callback?code=${code}`
        );

        if (!res.ok) throw new Error("소셜 로그인 실패");

        const user = await res.json();

        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.username);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            username: user.username,
          }),
        );

        navigate("/");
      } catch (err) {
        console.error("SNS 로그인 오류:", err);
        alert("SNS 로그인 처리 중 오류가 발생했습니다.");
        navigate("/login");
      }
    };

    login();
  }, [provider, searchParams, navigate]);

  return <div>로그인 중...</div>;
};

export default OAuthCallback;
