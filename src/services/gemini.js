const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const ENDPOINT = `${API_BASE}/api/v1/chatbot/message`;

/**
 * 서버의 비움이 챗봇 엔드포인트로 대화 히스토리를 보내고 응답을 받아옵니다.
 * 서버는 Gemini 호출이 실패하면 로컬 룰 기반 응답으로 자동 폴백합니다.
 *
 * @param {Array<{role: "user"|"model", text: string}>} history
 * @returns {Promise<{reply: string, source: "gemini"|"local", notice?: string}>}
 */
export async function sendChatToGemini(history) {
    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history }),
    });

    if (!res.ok) {
        let detail = "";
        try {
            const data = await res.json();
            detail = data?.detail || JSON.stringify(data);
        } catch {
            detail = await res.text();
        }
        throw new Error(`챗봇 서버 오류 (${res.status}): ${detail}`);
    }

    const data = await res.json();
    const reply = (data?.reply || "").trim();
    if (!reply) {
        throw new Error("챗봇 응답이 비어 있어요.");
    }
    return {
        reply,
        source: data?.source || "gemini",
        notice: data?.notice || undefined,
    };
}
