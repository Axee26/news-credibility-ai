from transformers import ElectraTokenizer, ElectraForSequenceClassification
import torch

# Chargement du modèle et tokenizer
MODEL_NAME = "monologg/koelectra-base-v3-discriminator"
tokenizer = ElectraTokenizer.from_pretrained(MODEL_NAME)
model = ElectraForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=2)
model.eval()

def predict(text: str) -> dict:
    """
    Entrée: texte d'un article de news (max 2000 caractères)
    Sortie: scores de fiabilité
    """
    # Tokenisation
    inputs = tokenizer(
        text,
        return_tensors="pt",
        max_length=512,
        truncation=True,
        padding=True
    )
    
    # Prédiction
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)
    
    exaggeration = round(probs[0][1].item() * 100, 2)
    ai_prob = round(probs[0][0].item() * 100, 2)
    
    if exaggeration >= 70:
        label = "불신"
    elif exaggeration >= 40:
        label = "주의"
    else:
        label = "신뢰"
    
    return {
        "exaggeration": exaggeration,
        "ai_prob": ai_prob,
        "label": label
    }

# Test rapide
if __name__ == "__main__":
    test_text = "정부가 오늘 새로운 경제 정책을 발표했습니다."
    result = predict(test_text)
    print(result)