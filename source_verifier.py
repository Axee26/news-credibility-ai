"""
source_verifier.py
NAVER News API 기반 출처 검증 모듈
팀폴6 | AI 기반 뉴스 신뢰도 평가 플랫폼 (DSD v1.0)
"""

from __future__ import annotations

import os
import re
import logging
from typing import List

import requests
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# NAVER API 설정
_NAVER_API_URL = "https://openapi.naver.com/v1/search/news.json"
_CLIENT_ID     = os.getenv("NAVER_CLIENT_ID", "")
_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET", "")

# 언론사 화이트리스트
TRUSTED_PRESS: set[str] = {
    "연합뉴스", "KBS", "MBC", "SBS", "YTN", "JTBC",
    "조선일보", "중앙일보", "동아일보", "한국경제", "매일경제",
    "한겨레", "경향신문", "오마이뉴스", "뉴시스", "뉴스1",
    "아이뉴스24", "전자신문", "디지털타임스", "헤럴드경제",
}

def _remove_html_tags(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text).strip()

def _extract_keywords(text: str, max_keywords: int = 3) -> str:
    tokens = text.split()
    keywords = [t for t in tokens if len(t) >= 2][:max_keywords]
    return " ".join(keywords) if keywords else text[:20]

def _parse_press_from_url(url: str) -> str:
    match = re.search(r"https?://(?:www\.)?([^/]+)", url)
    return match.group(1).split(".")[0] if match else "unknown"

def fetch_naver_articles(keyword: str, display: int = 10) -> List[dict]:
    if not _CLIENT_ID or not _CLIENT_SECRET:
        logger.error("[source_verifier] NAVER API 키가 설정되지 않았습니다.")
        return []

    headers = {
        "X-Naver-Client-Id":     _CLIENT_ID,
        "X-Naver-Client-Secret": _CLIENT_SECRET,
    }
    params = {
        "query":   keyword,
        "display": display,
        "sort":    "sim",
    }

    try:
        response = requests.get(_NAVER_API_URL, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.Timeout:
        logger.error("[source_verifier] NAVER API 응답 시간 초과")
        return []
    except requests.exceptions.RequestException as e:
        logger.error(f"[source_verifier] NAVER API 호출 실패: {e}")
        return []

    articles = []
    for item in data.get("items", []):
        title = _remove_html_tags(item.get("title", ""))
        url   = item.get("originallink") or item.get("link", "")
        press = _parse_press_from_url(url)
        articles.append({
            "title":       title,
            "press":       press,
            "url":         url,
            "description": _remove_html_tags(item.get("description", "")),
            "pubDate":     item.get("pubDate", ""),
        })

    logger.info(f"[source_verifier] {len(articles)}건 수집")
    return articles

def calculate_credibility(articles: List[dict]) -> float:
    if not articles:
        return 0.0
    trusted_count = sum(
        1 for art in articles
        if any(trusted in art.get("press", "") for trusted in TRUSTED_PRESS)
    )
    credibility = trusted_count / len(articles)
    return round(credibility, 4)

def verify(text: str) -> dict:
    keyword  = _extract_keywords(text)
    articles = fetch_naver_articles(keyword)
    credibility = calculate_credibility(articles)

    trusted_articles = [
        a for a in articles
        if any(t in a.get("press", "") for t in TRUSTED_PRESS)
    ]
    press_name = trusted_articles[0]["press"] if trusted_articles else (
        articles[0]["press"] if articles else "unknown"
    )

    return {
        "credibility": credibility,
        "press_name":  press_name,
        "articles":    articles,
    }