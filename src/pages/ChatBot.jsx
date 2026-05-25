import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BiumChatImg from "../assets/img/BiumProfile.svg"; 
import ChatSelectIcon from "../assets/img/Chat_select.svg";

const ChatbotPage = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    // 채팅 메시지들을 담는 배열 상태
    const [messages, setMessages] = useState([]);
    const chatEndRef = useRef(null);

    // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 메시지 전송 함수
    const handleSendMessage = () => {
        if (inputValue.trim() === "") return;

        const newMessage = {
            id: Date.now(),
            text: inputValue,
            sender: "user",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputValue("");

        // (선택 사항) 비움이의 자동 응답 시뮬레이션
        setTimeout(() => {
            const biumReply = {
                id: Date.now() + 1,
                text: "죄송합니다. 아직 학습 중인 질문이에요. 분리수거 방법을 다시 확인해 드릴까요?",
                sender: "bium",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, biumReply]);
        }, 1000);
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
                            <MessageBubble user>{msg.text}</MessageBubble>
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
                <div ref={chatEndRef} />
            </ChatArea>

            <InputWrapper>
                <InputContainer>
                    <ChatInput 
                        placeholder="비움이에게 물어보기" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <SendBtn src={ChatSelectIcon} alt="전송" onClick={handleSendMessage} />
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
  border-radius: ${props => props.user ? "20px 20px 2px 20px" : "2px 20px 20px 20px"};
  background-color: ${props => props.user ? "#53B175" : "#efefef"};
  color: ${props => props.user ? "#fff" : "#272727"};
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