import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BiumChatImg from "../assets/img/BiumProfile.svg"; 
import ChatSelectIcon from "../assets/img/Chat_select.svg";
import { sendChatToGemini } from "../services/gemini";

const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatbotPage = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([
        {
            id: Date.now(),
            text: "안녕하세요! 분리수거 도우미 비움이예요. 궁금한 품목이나 분리배출 방법을 물어봐 주세요.",
            sender: "bium",
            time: nowTime(),
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [noticeShown, setNoticeShown] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (inputValue.trim() === "" || isLoading) return;

        const userText = inputValue.trim();
        const userMessage = {
            id: Date.now(),
            text: userText,
            sender: "user",
            time: nowTime(),
        };

        const nextMessages = [...messages, userMessage];
        setMessages(nextMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            const history = nextMessages
                .filter((m) => m.sender === "user" || m.sender === "bium")
                .map((m) => ({
                    role: m.sender === "user" ? "user" : "model",
                    text: m.text,
                }));

            const { reply, source, notice } = await sendChatToGemini(history);

            setMessages((prev) => {
                const next = [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        text: reply,
                        sender: "bium",
                        time: nowTime(),
                    },
                ];
                if (source === "local" && notice && !noticeShown) {
                    next.push({
                        id: Date.now() + 2,
                        text: `[안내] ${notice}`,
                        sender: "bium",
                        time: nowTime(),
                        isNotice: true,
                    });
                    setNoticeShown(true);
                }
                return next;
            });
        } catch (err) {
            console.error("[비움이] Gemini 호출 실패:", err);
            const msg = String(err?.message || "");
            let friendly = "죄송해요, 지금 응답을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.";
            if (msg.includes("denied") || msg.includes("403")) {
                friendly =
                    "분리수거 도우미 연결에 문제가 생겼어요. (Gemini API 키 접근 권한이 차단된 상태예요. 관리자에게 키 교체를 요청해 주세요.)";
            } else if (msg.includes("429") || msg.toLowerCase().includes("quota")) {
                friendly = "오늘 사용량이 너무 많아 잠시 쉬는 중이에요. 잠시 후 다시 시도해 주세요.";
            } else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
                friendly = "서버에 연결할 수 없어요. Reco 서버가 켜져 있는지 확인해 주세요.";
            }
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: friendly,
                    sender: "bium",
                    time: nowTime(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Header>
                <BackBtn onClick={() => navigate(-1)}>&lt;</BackBtn>
                <HeaderTitle>비움이</HeaderTitle>
            </Header>

            <ChatArea>
                {messages.map((msg) => (
                    msg.sender === "user" ? (
                        <UserMessage key={msg.id}>
                            {/* 사용자일 때는 시간이 왼쪽! */}
                            <TimeStamp>{msg.time}</TimeStamp>
                            <MessageBubble $user>{msg.text}</MessageBubble>
                        </UserMessage>
                    ) : (
                        <BiumMessageSection key={msg.id}>
                            <BiumProfile src={BiumChatImg} alt="비움이" />
                            <BiumContent>
                                <BiumName>비움이</BiumName>
                                <BiumResponse>
                                    <MessageBubble>{msg.text}</MessageBubble>
                                    {/* 비움이일 때는 시간이 오른쪽! */}
                                    <TimeStamp>{msg.time}</TimeStamp>
                                </BiumResponse>
                            </BiumContent>
                        </BiumMessageSection>
                    )
                ))}
                {isLoading && (
                    <BiumMessageSection>
                        <BiumProfile src={BiumChatImg} alt="비움이" />
                        <BiumContent>
                            <BiumName>비움이</BiumName>
                            <BiumResponse>
                                <MessageBubble>입력 중...</MessageBubble>
                            </BiumResponse>
                        </BiumContent>
                    </BiumMessageSection>
                )}
                <div ref={chatEndRef} />
            </ChatArea>

            <InputWrapper>
                <InputContainer>
                    <ChatInput
                        placeholder={isLoading ? "비움이가 응답 중이에요..." : "비움이에게 물어보기"}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        disabled={isLoading}
                    />
                    <SendBtn
                        src={ChatSelectIcon}
                        alt="전송"
                        onClick={handleSendMessage}
                        style={{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? "none" : "auto" }}
                    />
                </InputContainer>
            </InputWrapper>
        </Container>
    );
};

// --- Styled Components (기존과 동일하되 가독성을 위해 유지) ---

const Container = styled.div`
  width: 393px;
  height: 100vh;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #F2F2F2;
`;

const BackBtn = styled.div` 
    font-size: 24px; 
    cursor: pointer; 
`;

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  margin-right: 24px;
  color: #272727;
`;

const ChatArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UserMessage = styled.div`
  align-self: flex-end;
  display: flex;
  align-items: flex-end; /* 바닥 기준 정렬 */
  gap: 8px;
`;

const BiumMessageSection = styled.div`
  display: flex;
  gap: 5px;
  align-items: flex-start;
`;

const BiumProfile = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

const BiumContent = styled.div`
    display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px; 
`;
const BiumName = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #272727;
  margin-left: 2px;
`;

const BiumResponse = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const MessageBubble = styled.div`
  max-width: 240px;
  padding: 12px 10px;
  font-size: 12px;
  line-height: 1.3;
  text-align: left;
  border-radius: ${props => props.$user ? "20px 20px 2px 20px" : "2px 20px 20px 20px"};
  background-color: ${props => props.$user ? "#53B175" : "#efefef"};
  color: ${props => props.$user ? "#fff" : "#272727"};
`;

const TimeStamp = styled.span`
  font-size: 11px;
  color: #999;
  margin-bottom: 2px;
  white-space: nowrap;
`;

const InputWrapper = styled.div` padding: 20px; background-color: #fff; `;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #F6F6F6;
  border: 1px solid #E0E0E0;
  border-radius: 30px;
  padding: 5px 15px;
`;

const ChatInput = styled.input`
  flex: 1; 
  border: none; 
  background: none; 
  color: #272727;
  padding: 12px; 
  font-size: 15px; 
  outline: none;
`;

const SendBtn = styled.img` width: 35px; height: 35px; cursor: pointer; `;

export default ChatbotPage;