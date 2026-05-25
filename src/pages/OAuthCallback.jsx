import { useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

const OAuthCallback = () => {
  const navigate = useNavigate()
  const { provider } = useParams()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")

    if (!code) {
      alert("SNS 로그인에 실패했습니다.")
      navigate("/login")
      return
    }

    console.log("provider:", provider)
    console.log("code:", code)

    navigate("/")
  }, [provider, searchParams, navigate])

  return <div>로그인 중...</div>
}

export default OAuthCallback