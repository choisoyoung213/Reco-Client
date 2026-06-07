import { useEffect, useState } from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import profileImg from "../assets/img/profile.jpg"
import BottomNavComponent from "../components/BottomNav"
import EditIcon from "../assets/img/edit.svg"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background: #fff;
  padding-bottom: 88px;
`

const Header = styled.div`
  padding: 20px 24px;
  background: #fff;
  font-family: 'Paperlogy';
  font-size: 15px;
  font-weight: 600;
  color: #272727;
  text-align: left;
`

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
  background: #fff;
  margin-bottom: 8px;
`

const ProfileImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
`

const UserName = styled.p`
  font-family: 'Paperlogy';
  font-size: 20px;
  font-weight: 600;
  color: #272727;
  margin-bottom: 12px;
`
const UserNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
`
const UserNameInput = styled.input`
  width: 120px;
  border: none;
  border-bottom: 1px solid #53b175;
  outline: none;
  text-align: center;
  font-family: 'Paperlogy';
  font-size: 20px;
  font-weight: 600;
  color: #272727;
`
const EditButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #53B175;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  color: white;
`

const LogoutButton = styled.button`
  display: inline-flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  font-family: 'Paperlogy';
  font-size: 13px;
  cursor: pointer;
`

const SettingSection = styled.div`
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  margin: 0 16px;
  padding: 8px 16px;
`

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: ${({ noBorder }) =>
    noBorder ? "none" : "0.5px solid #f0f0f0"};
  cursor: ${({ clickable }) => (clickable ? "pointer" : "default")};
`

const SettingText = styled.p`
  font-family: 'Paperlogy';
  font-size: 15px;
  color: #272727;
`

const Toggle = styled.button`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: ${({ isOn }) => (isOn ? "#53B175" : "#D9D9D9")};
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
`

const ToggleCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 2px;
  left: ${({ isOn }) => (isOn ? "22px" : "2px")};
  transition: left 0.2s;
`

const MyPage = () => {
  const navigate = useNavigate()

  const [userName, setUserName] = useState("사용자 명")
  const [editName, setEditName] = useState("사용자 명")
  const [isEditing, setIsEditing] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [autoEmail, setAutoEmail] = useState(false)

  useEffect(() => {
    const savedUsername = localStorage.getItem("username")
    const savedUserId = localStorage.getItem("userId")
    const savedAutoSave = localStorage.getItem("autoSave")
    const savedAutoEmail = localStorage.getItem("autoEmail")
    const savedUserName = localStorage.getItem("userName")

    if (savedUserName) {
      setUserName(savedUserName)
      setEditName(savedUserName)
    }

    setUserName(savedUsername || savedUserId || "사용자 명")

    if (savedAutoSave !== null) {
      setAutoSave(savedAutoSave === "true")
    }

    if (savedAutoEmail !== null) {
      setAutoEmail(savedAutoEmail === "true")
    }
  }, [])

  const handleAutoSave = () => {
    setAutoSave((prev) => {
      localStorage.setItem("autoSave", !prev)
      return !prev
    })
  }

  const handleAutoEmail = () => {
    setAutoEmail((prev) => {
      localStorage.setItem("autoEmail", !prev)
      return !prev
    })
  }
  const handleEditName = () => {
    if (!isEditing) {
      setIsEditing(true)
      return
    }

    if (!editName.trim()) {
      alert("이름을 입력해주세요.")
      return
    }

    setUserName(editName)
    localStorage.setItem("userName", editName)
    setIsEditing(false)
  }
  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userId")
    localStorage.removeItem("username")
    navigate("/login")
  }

  return (
    <Container>
      <Header>마이페이지</Header>

      <ProfileSection>
        <ProfileImage src={profileImg} alt="프로필" />
        <UserNameRow>
          {isEditing ? (
            <UserNameInput
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEditName()
                }
              }}
              autoFocus
            />
          ) : (
            <UserName style={{ marginBottom: 0 }}>{userName}</UserName>
          )}

          <EditButton onClick={handleEditName}>
            {isEditing ? "✓" : <img src={EditIcon} width={14} height={14} />}
          </EditButton>
        </UserNameRow>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </ProfileSection>

      <SettingSection>
        <SettingRow>
          <SettingText>자동 결과 저장</SettingText>
          <Toggle type="button" isOn={autoSave} onClick={handleAutoSave}>
            <ToggleCircle isOn={autoSave} />
          </Toggle>
        </SettingRow>

        <SettingRow>
          <SettingText>이메일 자동 전송 on/off</SettingText>
          <Toggle type="button" isOn={autoEmail} onClick={handleAutoEmail}>
            <ToggleCircle isOn={autoEmail} />
          </Toggle>
        </SettingRow>

        <SettingRow noBorder clickable onClick={() => alert("문의 기능 준비중입니다.")}>
          <SettingText>문의하기</SettingText>
        </SettingRow>
      </SettingSection>

      <BottomNavComponent />
    </Container>
  )
}

export default MyPage   
