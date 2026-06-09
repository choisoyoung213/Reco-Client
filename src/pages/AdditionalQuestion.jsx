import { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import BackIcon from "../assets/img/Vector.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background: #fff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 24px 0;
  position: relative;
`;

const BackButton = styled.div`
  position: absolute;
  left: 24px;
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

const Title = styled.p`
  font-family: "Paperlogy";
  font-size: 18px;
  font-weight: 600;
  color: #272727;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #f0f0f0;
  margin-top: 12px;
`;

const ProgressFill = styled.div`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: #53b175;
  border-radius: 0 4px 4px 0;
`;

const Content = styled.div`
  padding: 60px 24px;
  flex: 1;
`;

const QuestionType = styled.p`
  font-family: "Paperlogy";
  font-size: 13px;
  color: #53b175;
  font-weight: 700;
  margin-bottom: 12px;
`;

const QuestionTitle = styled.p`
  font-family: "Paperlogy";
  font-size: 18.5px;
  font-weight: 700;
  color: #272727;
  line-height: 1.4;
  margin-bottom: 12px;
`;

const QuestionSub = styled.p`
  font-family: "Paperlogy";
  font-size: 13px;
  color: #959595;
  line-height: 1.5;
  margin-bottom: 40px;
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 12px;
  border: ${({ $isSelected }) =>
    $isSelected ? "2px solid #53b175" : "1px solid #e0e0e0"};
  background: ${({ $isSelected }) => ($isSelected ? "#f0faf4" : "#fff")};
  cursor: pointer;
`;

const OptionText = styled.p`
  font-family: "Paperlogy";
  font-size: 15px;
  color: #272727;
`;

const Radio = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: ${({ $isSelected }) =>
    $isSelected ? "none" : "1.5px solid #d9d9d9"};
  background: ${({ $isSelected }) => ($isSelected ? "#53b175" : "transparent")};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RadioInner = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
`;

const BottomButton = styled.button`
  width: 100%;
  height: 56px;
  background: #53b175;
  border: none;
  color: white;
  font-family: "Paperlogy";
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 24px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const QUESTIONS = [
  "바닥에 내려놓으면 모양이 그대로 유지되나요?",
  "바닥에 떨어뜨리면 깨질 가능성이 있나요?",
  "손으로 눌렀을 때 모양이 변하나요?",
];

const answerOptions = [
  { id: "yes", text: "맞아요" },
  { id: "no", text: "아니에요" },
  { id: "unknown", text: "잘 모르겠어요" },
];

const AdditionalQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleConfirm = () => {
    if (selected === null) return;

    const nextAnswers = [
      ...answers,
      {
        question: currentQuestion,
        answer: selected,
      },
    ];

    setAnswers(nextAnswers);

    if (isLastQuestion) {
      navigate("/loading", {
        state: {
          mode: "reanalyze",
          result: location.state?.result,
          capturedImage: location.state?.capturedImage,
          additionalAnswers: nextAnswers,
        },
      });
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <BackIconImg src={BackIcon} alt="Back" />
        </BackButton>
        <Title>추가질문</Title>
      </Header>

      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>

      <Content>
        <QuestionType>
          {currentIndex + 1}/{QUESTIONS.length}
        </QuestionType>

        <QuestionTitle>{currentQuestion}</QuestionTitle>

        <QuestionSub>
          더 정확한 분석을 위해 물건의 특징을 선택해주세요.
        </QuestionSub>

        <OptionList>
          {answerOptions.map((option) => (
            <Option
              key={option.id}
              $isSelected={selected === option.id}
              onClick={() => setSelected(option.id)}
            >
              <OptionText>{option.text}</OptionText>
              <Radio $isSelected={selected === option.id}>
                {selected === option.id && <RadioInner />}
              </Radio>
            </Option>
          ))}
        </OptionList>
      </Content>

      <BottomButton disabled={selected === null} onClick={handleConfirm}>
        {isLastQuestion ? "결과 확인하기" : "다음"}
      </BottomButton>
    </Container>
  );
};

export default AdditionalQuestion;