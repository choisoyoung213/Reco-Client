import styled from "styled-components"
import bium from "../assets/loading.gif"
import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getRequiredEnv } from "../config/env"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background: #fdfbfd;
  position: relative; 
`

const Image = styled.img`
  width: 280px;
  margin-bottom: 10px;
`

const Title = styled.p`
  font-family: 'Paperlogy';
  font-size: 20px;
  font-weight: 500;
  color: #272727;
  text-align: center;
  margin-bottom: 10px;
  font-weight: 600;
`

const SubTitle = styled.p`
  font-family: 'Paperlogy';
  font-size: 13px;
  color: #5D5D5D;
  text-align: center;
  line-height: 1.5;
`
const BackButton = styled.button`
   background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: absolute;  /* ← 변경 */
  top: 20px;           /* ← 상단에 고정 */
  left: 24px;
`

const getFastApiBase = () => {
  const base = getRequiredEnv("VITE_API_BASE_URL")

  if (import.meta.env.DEV && /^https?:\/\/localhost:8000\/?$/.test(base)) {
    return ""
  }

  return base
}

const FASTAPI_BASE = getFastApiBase()

const normalizePercent = (value) => {
  const num = Number(value)

  if (!Number.isFinite(num)) return 0

  if (num > 0 && num <= 1) {
    return Math.round(num * 100)
  }

  return Math.round(num)
}

const getResultSource = (data) => data.result || data.data || data.analysis || data

const hasProbabilityItems = (value) =>
  Array.isArray(value) ? value.length > 0 : value && typeof value === "object"

const getMaterialProbabilities = (source, fallbackResult = {}) => {
  if (hasProbabilityItems(source.materialProbabilities)) {
    return source.materialProbabilities
  }
  if (hasProbabilityItems(source.material_probabilities)) {
    return source.material_probabilities
  }
  if (hasProbabilityItems(source.materials)) {
    return source.materials
  }
  if (hasProbabilityItems(source.predictions)) {
    return source.predictions
  }
  if (hasProbabilityItems(source.summary)) {
    return source.summary
  }
  if (hasProbabilityItems(source.detail)) {
    return source.detail
  }
  if (hasProbabilityItems(fallbackResult.materialProbabilities)) {
    return fallbackResult.materialProbabilities
  }

  return [
    {
      label:
        source.primary_material ||
        source.material ||
        fallbackResult.primaryMaterial ||
        fallbackResult.primary_material ||
        "분석 결과",
      percent: normalizePercent(
        source.confidence ||
          fallbackResult.confidence ||
          100
      ),
    },
  ]
}

const normalizeAnalysisResult = (data) => {
  const source = getResultSource(data)
  const steps = source.disposal_steps || source.disposalSteps || []

  return {
    ...source,

    itemName:
      source.waste_type_ko ||
      source.itemName ||
      source.item ||
      "분석 결과",

    item:
      source.waste_type_ko ||
      source.itemName ||
      source.item ||
      "분석 결과",

    primaryMaterial:
      source.primary_material ||
      source.material ||
      "분석 결과",

    materialProbabilities: getMaterialProbabilities(source),

    aiSummary:
      source.ai_summary ||
      source.aiSummary,

    disposalSteps: steps,

    disposalMethodSummary:
      source.disposalMethodSummary ||
      steps.join("\n"),

    contaminationStatus:
      source.contamination?.level === "clean"
        ? "good"
        : source.contamination?.level === "low"
        ? "normal"
        : source.contamination?.level === "high"
        ? "bad"
        : source.contaminationStatus || "good",

    isRecyclable:
      source.recyclable?.possible ??
      source.isRecyclable ??
      true,

    confidence: normalizePercent(source.confidence || 100),
  }
}

const normalizeReanalysisResult = (data, previousResult = {}) => {
  const source = getResultSource(data)
  const normalized = normalizeAnalysisResult(source)

  return {
    ...previousResult,
    ...normalized,

    itemName:
      source.waste_type_ko ||
      source.itemName ||
      source.item ||
      previousResult.itemName ||
      previousResult.item ||
      normalized.itemName,

    item:
      source.waste_type_ko ||
      source.itemName ||
      source.item ||
      previousResult.item ||
      previousResult.itemName ||
      normalized.item,

    primaryMaterial:
      source.primary_material ||
      source.material ||
      previousResult.primaryMaterial ||
      previousResult.primary_material ||
      normalized.primaryMaterial,

    materialProbabilities: getMaterialProbabilities(source, previousResult),

    disposalSteps:
      source.disposal_steps ||
      source.disposalSteps ||
      previousResult.disposalSteps ||
      normalized.disposalSteps,

    disposalMethodSummary:
      source.disposalMethodSummary ||
      previousResult.disposalMethodSummary ||
      normalized.disposalMethodSummary,

    aiSummary:
      source.ai_summary ||
      source.aiSummary ||
      previousResult.aiSummary ||
      normalized.aiSummary,
  }
}

const Loading = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const requestStartedRef = useRef(false)

  const {
    mode,
    file,
    previewImage,
    result,
    capturedImage,
    additionalAnswers,
    questionType,
  } = location.state || {}

  useEffect(() => {
    if (requestStartedRef.current) return
    requestStartedRef.current = true

    const analyze = async () => {
      try {
        if (!file) {
          throw new Error("분석할 이미지가 없습니다.")
        }

        const formData = new FormData()
        formData.append("image", file)

        const response = await fetch(`${FASTAPI_BASE}/api/v1/materials/analyze`, {
          method: "POST",
          body: formData,
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.detail ||
              `분석 요청에 실패했습니다. (${response.status})`
          )
        }

        const fixedResult = JSON.parse(
          JSON.stringify(normalizeAnalysisResult(data))
        )

        navigate("/result", {
          state: {
            result: fixedResult,
            capturedImage: previewImage,
          },
        })
      } catch (error) {
        console.error("분석 요청 실패:", error)
        alert("분석 서버에 연결하지 못했습니다. 서버 실행 상태를 확인해주세요.")
        navigate(-1)
      }
    }

    const reanalyze = async () => {
      try {
        if (!result) {
          throw new Error("이전 분석 결과가 없습니다.")
        }

        const formData = new FormData()

        if (file) {
          formData.append("image", file)
        } else if (capturedImage?.startsWith("data:image")) {
          const imageBlob = await fetch(capturedImage).then((res) => res.blob())
          formData.append("image", imageBlob, "reanalyze-image.jpg")
        } else if (capturedImage?.startsWith("blob:")) {
          const imageBlob = await fetch(capturedImage).then((res) => res.blob())
          formData.append("image", imageBlob, "reanalyze-image.jpg")
        }

        formData.append("previous_result", JSON.stringify(result))
        formData.append("additional_answers", JSON.stringify(additionalAnswers || []))
        formData.append("question_type", questionType || "general_reanalysis")

        console.log("재분석 요청 FormData:", {
          hasFile: !!file,
          hasCapturedImage: !!capturedImage,
          result,
          additionalAnswers,
          questionType,
        })

        const response = await fetch(`${FASTAPI_BASE}/api/v1/materials/reanalyze`, {
          method: "POST",
          body: formData,
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.detail ||
              `재분석 요청에 실패했습니다. (${response.status})`
          )
        }

        const fixedResult = JSON.parse(
          JSON.stringify(normalizeReanalysisResult(data, result))
        )

        navigate("/result", {
          state: {
            result: fixedResult,
            capturedImage,
          },
        })
      } catch (error) {
        console.error("재분석 요청 실패:", error)
        alert("재분석에 실패해 이전 분석 결과를 그대로 보여드릴게요.")
        navigate("/result", {
          replace: true,
          state: {
            result,
            capturedImage,
          },
        })
      }
    }

    if (mode === "analyze") analyze()
    if (mode === "reanalyze") reanalyze()
  }, [])

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>{"<"}</BackButton>
      <Image src={bium} alt="비움 캐릭터" />
      <Title>
        {mode === "reanalyze"
          ? "비움이가 다시 분석하고 있어요"
          : "비움이가 분리배출 방법을 찾고있어요"}
      </Title>
      <SubTitle>
        AI 비움이가 결과를 분석하고 있어요<br />
        앱을 종료하지 마시고 잠깐만 기다려 주세요
      </SubTitle>
    </Container>
  )
}

export default Loading
