"""
main.py
FastAPI AI 서버 — 메인 엔드포인트
팀폴6 | AI 기반 뉴스 신뢰도 평가 플랫폼 (DSD v1.0)

역할: Spring Boot 메인 서버에서 POST /ai/analyze 요청을 받아
4개 모듈을 순서대로 호출하고 최종 JSON 응답을 반환한다.
"""

from __future__ import annotations

import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from koelectra_classifier import predict
from similarity import get_top_articles
from source_verifier import verify

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NewsCheck AI Server",
    description="AI 기반 뉴스 신뢰도 평가 플랫폼 - AI 서버",
    version="1.0.0"
)

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    exaggeration:  float
    ai_prob:       float
    label:         str
    credibility:   float
    press_name:    str
    top_articles:  list
    final_score:   float

@app.post("/ai/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    text = request.text.strip()

    if not text or len(text) < 10:
        raise HTTPException(status_code=400, detail="텍스트가 너무 짧습니다.")
    if len(text) > 2000:
        text = text[:2000]

    # 1. KoELECTRA 분석
    koelectra_result = predict(text)
    exaggeration = koelectra_result["exaggeration"]
    ai_prob      = koelectra_result["ai_prob"]
    label        = koelectra_result["label"]

    # 2. NAVER API 출처 검증
    verifier_result = verify(text)
    credibility  = verifier_result["credibility"]
    press_name   = verifier_result["press_name"]
    articles     = verifier_result["articles"]

    # 3. Sentence-BERT 유사도 분석
    top_articles = get_top_articles(text, articles, top_k=5)

    # 4. 종합 신뢰도 점수 산출
    source_score = credibility * 100
    final_score  = round(
        (source_score * 0.4) +
        ((100 - exaggeration) * 0.35) +
        ((100 - ai_prob) * 0.25),
        2
    )

    logger.info(f"[main] 분석 완료 → final_score={final_score}")

    return AnalyzeResponse(
        exaggeration=exaggeration,
        ai_prob=ai_prob,
        label=label,
        credibility=credibility,
        press_name=press_name,
        top_articles=top_articles,
        final_score=final_score,
    )

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)