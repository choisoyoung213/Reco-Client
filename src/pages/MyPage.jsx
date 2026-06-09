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

const SettingValue = styled.span`
  font-family: 'Paperlogy';
  font-size: 13px;
  color: #959595;
`

const Toggle = styled.button`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: ${({ $isOn }) => ($isOn ? "#53B175" : "#D9D9D9")};
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
  left: ${({ $isOn }) => ($isOn ? "22px" : "2px")};
  transition: left 0.2s;
`

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ContactModal = styled.div`
  width: calc(100% - 48px);
  max-width: 360px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
`

const ModalTitle = styled.p`
  font-family: 'Paperlogy';
  font-size: 17px;
  font-weight: 700;
  color: #272727;
  margin-bottom: 12px;
`

const ContactInput = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  resize: none;
  box-sizing: border-box;
  font-family: 'Paperlogy';
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #53B175;
  }
`

const ModalButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 14px;
`

const ModalButton = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: ${({ $primary }) => ($primary ? "#53B175" : "#eeeeee")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#272727")};
  font-family: 'Paperlogy';
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`

const MyPage = () => {
  const navigate = useNavigate()

  const [userName, setUserName] = useState("사용자 명")
  const [editName, setEditName] = useState("사용자 명")
  const [isEditing, setIsEditing] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [locationAllowed, setLocationAllowed] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [contactContent, setContactContent] = useState("")

  useEffect(() => {
    const savedUsername = localStorage.getItem("username")
    const savedUserId = localStorage.getItem("userId")
    const savedAutoSave = localStorage.getItem("autoSave")
    const savedLocationAllowed = localStorage.getItem("locationAllowed")
    const savedUserName = localStorage.getItem("userName")
    const nextUserName = savedUserName || savedUsername || savedUserId || "사용자 명"

    setUserName(nextUserName)
    setEditName(nextUserName)

    if (savedAutoSave !== null) {
      setAutoSave(savedAutoSave === "true")
    }

    if (savedLocationAllowed !== null) {
      setLocationAllowed(savedLocationAllowed === "true")
    }
  }, [])

  const handleAutoSave = () => {
    setAutoSave((prev) => {
      localStorage.setItem("autoSave", !prev)
      return !prev
    })
  }

  const handleLocationPermission = () => {
    if (locationAllowed) {
      setLocationAllowed(false)
      localStorage.setItem("locationAllowed", "false")
      localStorage.removeItem("lastLatitude")
      localStorage.removeItem("lastLongitude")
      window.dispatchEvent(new Event("reco-location-permission-change"))
      return
    }

    if (!navigator.geolocation) {
      alert("위치 정보를 지원하지 않는 브라우저입니다.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationAllowed(true)
        localStorage.setItem("locationAllowed", "true")
        localStorage.setItem("lastLatitude", String(position.coords.latitude))
        localStorage.setItem("lastLongitude", String(position.coords.longitude))
        window.dispatchEvent(new Event("reco-location-permission-change"))
      },
      () => {
        setLocationAllowed(false)
        localStorage.setItem("locationAllowed", "false")
        window.dispatchEvent(new Event("reco-location-permission-change"))
        alert("위치 정보 권한이 필요합니다.")
      },
    )
  }

  const handleContact = () => {
    setIsContactOpen(true)
  }

  const handleSubmitContact = async () => {
    if (!contactContent.trim()) {
      alert("문의 내용을 입력해주세요.")
      return
    }

    try {
      const userId = localStorage.getItem("userId")

      const response = await fetch(
        `${import.meta.env.VITE_SPRING_API_BASE_URL}/api/inquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            content: contactContent,
          }),
        },
      )

      if (!response.ok) {
        throw new Error("문의 등록 실패")
      }

      alert("문의가 접수되었습니다.")
      setContactContent("")
      setIsContactOpen(false)
    } catch (error) {
      console.error("문의 등록 실패:", error)
      alert("문의 접수에 실패했습니다.")
    }
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
    localStorage.removeItem("userName")
    navigate("/login")
  }

  return (
    <Container>
      <Header>Profile</Header>

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
            {isEditing ? "✓" : <img src={EditIcon} width={23} height={23} />}
          </EditButton>
        </UserNameRow>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </ProfileSection>

      <SettingSection>
        <SettingRow>
          <SettingText>자동 결과 저장</SettingText>
          <Toggle type="button" $isOn={autoSave} onClick={handleAutoSave}>
            <ToggleCircle $isOn={autoSave} />
          </Toggle>
        </SettingRow>

        <SettingRow>
          <SettingText>위치 정보 허용</SettingText>
          <Toggle type="button" $isOn={locationAllowed} onClick={handleLocationPermission}>
            <ToggleCircle $isOn={locationAllowed} />
          </Toggle>
        </SettingRow>

        <SettingRow noBorder clickable onClick={handleContact}>
          <SettingText>문의하기</SettingText>
        </SettingRow>
      </SettingSection>

      {isContactOpen && (
        <ModalOverlay>
          <ContactModal>
            <ModalTitle>문의하기</ModalTitle>

            <ContactInput
              placeholder="문의 내용을 입력해주세요."
              value={contactContent}
              onChange={(e) => setContactContent(e.target.value)}
            />

            <ModalButtonRow>
              <ModalButton
                type="button"
                onClick={() => {
                  setIsContactOpen(false)
                  setContactContent("")
                }}
              >
                취소
              </ModalButton>

              <ModalButton
                type="button"
                $primary
                onClick={handleSubmitContact}
              >
                문의하기
              </ModalButton>
            </ModalButtonRow>
          </ContactModal>
        </ModalOverlay>
      )}

      <BottomNavComponent />
    </Container>
  )
}

export default MyPage   
