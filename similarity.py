"""
similarity.py
Sentence-BERT 기반 뉴스 유사도 분석 모듈
팀폴6 | AI 기반 뉴스 신뢰도 평가 플랫폼 (DSD v1.0)
담당자 : 라디
"""

from __future__ import annotations

import logging
from typing import List

import numpy as np
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

_MODEL_NAME = "snunlp/KR-SBERT-V40K-klueNLI-augSTS"
_model: SentenceTransformer | None = None

def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        logger.info(f"[similarity] 모델 로딩 중: {_MODEL_NAME}")
        _model = SentenceTransformer(_MODEL_NAME)
        logger.info("[similarity] 모델 로딩 완료")
    return _model

def encode(texts: List[str]) -> np.ndarray:
    if not texts:
        return np.empty((0,), dtype=np.float32)
    model = _get_model()
    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        show_progress_bar=False,
        normalize_embeddings=True,
    )
    return embeddings

def compute_similarity(v1: np.ndarray, v2: np.ndarray) -> List[float]:
    q = np.array(v1, dtype=np.float32).flatten()
    c = np.array(v2, dtype=np.float32)
    if c.ndim == 1:
        c = c.reshape(1, -1)
    scores: np.ndarray = c @ q
    return scores.tolist()

def get_top_articles(
    query: str,
    articles: List[dict],
    top_k: int = 5,
) -> List[dict]:
    if not articles:
        logger.warning("[similarity] 후보 기사가 비어 있습니다.")
        return []

    titles = [art.get("title", "") for art in articles]
    all_texts = [query] + titles
    all_embeddings = encode(all_texts)

    query_emb = all_embeddings[0]
    article_embs = all_embeddings[1:]

    scores = compute_similarity(query_emb, article_embs)

    scored = []
    for art, score in zip(articles, scores):
        scored.append({
            "title":      art.get("title", ""),
            "press":      art.get("press", ""),
            "url":        art.get("url", ""),
            "similarity": round(float(score), 4),
        })

    scored.sort(key=lambda x: x["similarity"], reverse=True)
    return scored[:top_k]