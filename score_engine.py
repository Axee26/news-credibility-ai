"""
score_engine.py
---------------
Score Credibility formula calculator final — NewsCheck (팀폴6)

Formule :
    score = (source_score × 0.4) + ((100 - exaggeration) × 0.35) + ((100 - ai_prob) × 0.25)

Labels :
    신뢰  → score >= 70
    주의  → 40 <= score < 70
    불신  → score < 40
"""


def calculate_score(
    source_score: float,
    exaggeration: float,
    ai_prob: float
) -> dict:
    source_score  = max(0.0, min(100.0, float(source_score)))
    exaggeration  = max(0.0, min(100.0, float(exaggeration)))
    ai_prob       = max(0.0, min(100.0, float(ai_prob)))

    source_contrib       = source_score         * 0.40
    exaggeration_contrib = (100 - exaggeration) * 0.35
    ai_contrib           = (100 - ai_prob)      * 0.25

    score = round(source_contrib + exaggeration_contrib + ai_contrib, 2)

    if score >= 70:
        label = "신뢰"
    elif score >= 40:
        label = "주의"
    else:
        label = "불신"

    return {
        "score": score,
        "label": label,
        "breakdown": {
            "source_contrib":        round(source_contrib, 2),
            "exaggeration_contrib":  round(exaggeration_contrib, 2),
            "ai_contrib":            round(ai_contrib, 2),
        }
    }


if __name__ == "__main__":
    tests = [
        {"source_score": 90, "exaggeration": 10, "ai_prob": 5},
        {"source_score": 50, "exaggeration": 50, "ai_prob": 50},
        {"source_score": 10, "exaggeration": 90, "ai_prob": 90},
    ]
    for t in tests:
        result = calculate_score(**t)
        print(f"입력: {t}")
        print(f"결과: score={result['score']} | label={result['label']}")
        print(f"분해: {result['breakdown']}\n")