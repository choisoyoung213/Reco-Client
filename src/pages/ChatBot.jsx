import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BiumChatImg from "../assets/img/BiumProfile.svg";
import ChatSelectIcon from "../assets/img/Chat_select.svg";
import { sendChatToGemini } from "../services/gemini";
import BackIcon from "../assets/img/Vector.svg";

const SPRING_API_BASE = import.meta.env.VITE_SPRING_API_BASE_URL;

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const STEP_LINE_RE = /^(\s*\d+\.\s+)([^:：\n]+?)([:：])(\s*)(.*)$/;

const stripInlineMd = (s) =>
  String(s ?? "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/`+([^`\n]+?)`+/g, "$1");

const FormattedText = ({ text }) => {
  const lines = String(text ?? "").split(/\r?\n/);

  return (
    <>
      {lines.map((rawLine, idx) => {
        const line = stripInlineMd(rawLine);
        const m = line.match(STEP_LINE_RE);
        const isLast = idx === lines.length - 1;

        if (m) {
          const [, num, label, colon, sp, rest] = m;

          return (
            <React.Fragment key={idx}>
              {num}
              <strong>{label}</strong>
              {colon}
              {sp}
              {rest}
              {!isLast && <br />}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={idx}>
            {line}
            {!isLast && <br />}
          </React.Fragment>
        );
      })}
    </>
  );
};

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

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchChatHistory = async () => {
      try {
        const res = await fetch(
          `${SPRING_API_BASE}/api/chatbot/messages/user/${userId}`,
        );

        if (!res.ok) throw new Error("이전 대화 불러오기 실패");

        const data = await res.json();

        if (data.length > 0) {
          setMessages(
            data.map((msg) => ({
              id: msg.id,
              text: msg.content,
              sender: msg.sender === "USER" ? "user" : "bium",
              time: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })),
          );
        }
      } catch (err) {
        console.error("[비움이] 이전 대화 불러오기 실패:", err);
      }
    };

    fetchChatHistory();
  }, [navigate]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    const userText = inputValue.trim();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

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
      await fetch(`${SPRING_API_BASE}/api/chatbot/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          content: userText,
        }),
      });
    } catch (err) {
      console.error("[비움이] 사용자 메시지 저장 실패:", err);
    }

    try {
      const history = nextMessages
        .filter((m) => m.sender === "user" || m.sender === "bium")
        .slice(-20)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text,
        }));

      const { reply, source, notice } = await sendChatToGemini(history);
      console.log("SOURCE =", source);
      console.log("REPLY =", reply);
      console.log("NOTICE =", notice);
      console.log("HISTORY =", history);

      try {
        await fetch(`${SPRING_API_BASE}/api/chatbot/messages/bot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            content: reply,
          }),
        });
      } catch (err) {
        console.error("[비움이] 봇 메시지 저장 실패:", err);
      }

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
      let friendly =
        "죄송해요, 지금 응답을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.";

      if (msg.includes("denied") || msg.includes("403")) {
        friendly =
          "분리수거 도우미 연결에 문제가 생겼어요. Gemini API 키 접근 권한이 차단된 상태예요.";
      } else if (msg.includes("429") || msg.toLowerCase().includes("quota")) {
        friendly =
          "오늘 사용량이 너무 많아 잠시 쉬는 중이에요. 잠시 후 다시 시도해 주세요.";
      } else if (
        msg.includes("Failed to fetch") ||
        msg.includes("NetworkError")
      ) {
        friendly =
          "서버에 연결할 수 없어요. Reco 서버가 켜져 있는지 확인해 주세요.";
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
        <BackBtn onClick={() => navigate(-1)}>
          <BackIconImg src={BackIcon} alt="Back" />
        </BackBtn>
        <HeaderTitle>비움이</HeaderTitle>
      </Header>

      <ChatArea>
        {messages.map((msg) =>
          msg.sender === "user" ? (
            <UserMessage key={msg.id}>
              <TimeStamp>{msg.time}</TimeStamp>
              <MessageBubble $user>
                <FormattedText text={msg.text} />
              </MessageBubble>
            </UserMessage>
          ) : (
            <BiumMessageSection key={msg.id}>
              <BiumProfile src={BiumChatImg} alt="비움이" />
              <BiumContent>
                <BiumName>비움이</BiumName>
                <BiumResponse>
                  <MessageBubble>
                    <FormattedText text={msg.text} />
                  </MessageBubble>
                  <TimeStamp>{msg.time}</TimeStamp>
                </BiumResponse>
              </BiumContent>
            </BiumMessageSection>
          ),
        )}

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
            placeholder={
              isLoading ? "비움이가 응답 중이에요..." : "비움이에게 물어보기"
            }
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
            style={{
              opacity: isLoading ? 0.5 : 1,
              pointerEvents: isLoading ? "none" : "auto",
            }}
          />
        </InputContainer>
      </InputWrapper>
    </Container>
  );
};

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
  border-bottom: 1px solid #f2f2f2;
`;

const BackBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
`;

const BackIconImg = styled.img`
  width: 12px;
  height: auto;
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
  align-items: flex-end;
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
  padding: 12px 12px;
  font-size: 13px;
  line-height: 1.55;
  text-align: left;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;
  border-radius: ${(props) =>
    props.$user ? "20px 20px 2px 20px" : "2px 20px 20px 20px"};
  background-color: ${(props) => (props.$user ? "#53B175" : "#efefef")};
  color: ${(props) => (props.$user ? "#fff" : "#272727")};

  strong {
    font-weight: 700;
    color: ${(props) => (props.$user ? "#fff" : "#1f7a3d")};
  }

  br + br {
    display: none;
  }
`;

const TimeStamp = styled.span`
  font-size: 11px;
  color: #999;
  margin-bottom: 2px;
  white-space: nowrap;
`;

const InputWrapper = styled.div`
  padding: 20px;
  background-color: #fff;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f6f6f6;
  border: 1px solid #e0e0e0;
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

const SendBtn = styled.img`
  width: 35px;
  height: 35px;
  cursor: pointer;
`;

export default ChatbotPage;
