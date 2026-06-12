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
  {
    type: "오류 유형",
    question: "분석 결과에서 어떤 부분이 이상했나요?",
    options: [
      { id: "wrong_item", text: "물건 종류가 틀렸어요" },
      { id: "wrong_material", text: "재질이 틀렸어요" },
      { id: "wrong_disposal", text: "배출 방법이 이상해요" },
      { id: "mostly_wrong", text: "전체적으로 이상해요" },
    ],
  },
  {
    type: "물건 용도",
    question: "이 물건은 주로 어떤 용도로 사용되나요?",
    options: [
      { id: "drink_food", text: "음식/음료 용기" },
      { id: "packaging", text: "포장재" },
      { id: "paper_item", text: "종이 제품" },
      { id: "electronic", text: "전자기기 또는 부품" },
      { id: "medicine", text: "의약품 관련" },
      { id: "daily_item", text: "생활용품" },
      { id: "unknown", text: "잘 모르겠어요" },
    ],
  },
  {
    type: "재질 특징",
    question: "가장 많이 보이는 재질은 무엇인가요?",
    options: [
      { id: "hard_plastic", text: "단단한 플라스틱" },
      { id: "soft_pet", text: "투명하고 눌리는 플라스틱" },
      { id: "vinyl", text: "비닐처럼 얇고 말랑함" },
      { id: "paper", text: "종이 또는 종이팩" },
      { id: "metal", text: "금속 재질" },
      { id: "glass", text: "유리 재질" },
      { id: "styrofoam", text: "스티로폼" },
      { id: "mixed", text: "여러 재질이 섞여 있음" },
      { id: "unknown", text: "잘 모르겠어요" },
    ],
  },
  {
    type: "현재 상태",
    question: "현재 물건 상태는 어떤가요?",
    options: [
      { id: "clean", text: "깨끗함" },
      { id: "dirty", text: "오염물 있음" },
      { id: "label_cap", text: "라벨 또는 뚜껑이 붙어 있음" },
      { id: "broken", text: "깨지거나 부서짐" },
      { id: "battery_inside", text: "배터리/전자부품 포함" },
      { id: "unknown", text: "잘 모르겠어요" },
    ],
  },
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

    const selectedOption = currentQuestion.options.find(
      (option) => option.id === selected,
    );
    const nextAnswers = [
      ...answers,
      {
        type: currentQuestion.type,
        question: currentQuestion.question,
        answer: selected,
        answerText: selectedOption?.text || "",
      },
    ];

    setAnswers(nextAnswers);

    if (isLastQuestion) {
      navigate("/loading", {
        state: {
          mode: "reanalyze",
          result: location.state?.result,
          file: location.state?.file,
          capturedImage: location.state?.capturedImage,
          additionalAnswers: nextAnswers,
          questionType: location.state?.questionType,
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

        <QuestionTitle>{currentQuestion.question}</QuestionTitle>

        <QuestionSub>
          더 정확한 분석을 위해 물건의 특징을 선택해주세요.
        </QuestionSub>

        <OptionList>
          {currentQuestion.options.map((option) => (
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
