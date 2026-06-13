# -*- coding: utf-8 -*-
"""
koelectra_classifier.py
KoELECTRA 기반 가짜뉴스 분류 모듈
- predict(): 과장성(exaggeration) 및 AI 생성 의심도(ai_prob) 예측
- train_model(): AI Hub 낚시성 기사 탐지 데이터로 파인튜닝
"""

import os
import json
import torch
from torch.utils.data import Dataset, DataLoader
from torch.optim import AdamW
from transformers import ElectraTokenizer, ElectraForSequenceClassification
from sklearn.metrics import f1_score
from tqdm import tqdm

# ────────────────────────────────────────────────
# Chargement du modèle et tokenizer
# 파인튜닝된 모델이 있으면 우선 사용, 없으면 기본 모델 사용
# ────────────────────────────────────────────────

MODEL_NAME = "monologg/koelectra-base-v3-discriminator"
FINETUNED_PATH = "koelectra_finetuned"

if os.path.exists(FINETUNED_PATH):
    print(f"[KoELECTRA] Loading fine-tuned model from {FINETUNED_PATH}")
    tokenizer = ElectraTokenizer.from_pretrained(FINETUNED_PATH)
    model = ElectraForSequenceClassification.from_pretrained(FINETUNED_PATH)
else:
    print(f"[KoELECTRA] Loading base model {MODEL_NAME}")
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


# ────────────────────────────────────────────────
# Dataset pour l'entraînement
# ────────────────────────────────────────────────

class ClickbaitDataset(Dataset):
    """Dataset PyTorch pour les articles 낚시성/일반 labellisés."""

    def __init__(self, texts, labels, max_length=512):
        self.encodings = tokenizer(
            texts,
            truncation=True,
            padding=True,
            max_length=max_length,
            return_tensors="pt"
        )
        self.labels = torch.tensor(labels, dtype=torch.long)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {key: val[idx] for key, val in self.encodings.items()}
        item["labels"] = self.labels[idx]
        return item


def _load_data_from_folder(folder_path: str, max_per_class: int = 10000):
    """
    Parcourt récursivement folder_path, lit chaque JSON AI Hub.
    Label basé sur le nom du dossier parent :
    - "cb" ou contient "CLICKBAIT" → label 1
    - "ncb" ou contient "NONCLICKBAIT" ou "NON" → label 0
    max_per_class: limite par classe pour entraînement CPU
    """
    texts, labels = [], []
    count = {0: 0, 1: 0}
    skipped = 0

    for root, dirs, files in os.walk(folder_path):
        # Déterminer le label depuis le nom du dossier parent
        parent = os.path.basename(root).upper()
        if "NCB" in parent or "NON" in parent or "NONCLICKBAIT" in parent:
            folder_label = 0
        elif "CB" in parent or "CLICKBAIT" in parent:
            folder_label = 1
        else:
            continue  # dossier non reconnu, on skip

        # Vérifier si la limite par classe est atteinte
        if count[folder_label] >= max_per_class:
            continue

        for fname in files:
            if not fname.endswith(".json"):
                continue
            if count[folder_label] >= max_per_class:
                break
            fpath = os.path.join(root, fname)
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    data = json.load(f)

                src = data.get("sourceDataInfo", {})
                title = src.get("newsTitle", "")
                content = src.get("newsContent", "")

                text = f"{title} [SEP] {content[:400]}"
                texts.append(text)
                labels.append(folder_label)
                count[folder_label] += 1

            except Exception:
                skipped += 1
                continue

    print(f"[Data] Loaded: {len(texts)} samples (Clickbait: {count[1]}, NonClickbait: {count[0]}) | Skipped: {skipped}")
    return texts, labels


def train_model(data_path: str,
                model_save_path: str = FINETUNED_PATH,
                max_per_class: int = 10000,
                epochs: int = 3,
                batch_size: int = 16,
                learning_rate: float = 2e-5) -> float:
    """
    AI Hub '낚시성 기사 탐지 데이터'로 KoELECTRA 파인튜닝.

    Args:
        data_path: 02.라벨링데이터 폴더 경로
        model_save_path: 모델 저장 경로
        epochs: 학습 에포크 수
        batch_size: 배치 크기 (메모리 부족 시 8로 감소)
        learning_rate: 학습률

    Returns:
        best_f1: 최고 F1-Score (목표: >= 0.75)
    """
    global model, tokenizer

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Train] Device: {device}")

    # 1. Charger les données
    print("[Train] Loading data...")
    texts, labels = _load_data_from_folder(data_path, max_per_class=max_per_class)
    if len(texts) == 0:
        raise ValueError(f"Aucun fichier JSON valide trouvé dans {data_path}")

    n_clickbait = sum(labels)
    print(f"[Train] Clickbait: {n_clickbait} | NonClickbait: {len(labels) - n_clickbait}")

    # 2. Split train/validation 90/10
    split = int(len(texts) * 0.9)
    train_texts, val_texts = texts[:split], texts[split:]
    train_labels, val_labels = labels[:split], labels[split:]
    print(f"[Train] Train: {len(train_texts)} | Val: {len(val_texts)}")

    # 3. Recharger le modèle de base pour l'entraînement
    train_model_instance = ElectraForSequenceClassification.from_pretrained(
        MODEL_NAME, num_labels=2
    )
    train_model_instance.to(device)

    # 4. Datasets & DataLoaders
    train_dataset = ClickbaitDataset(train_texts, train_labels)
    val_dataset = ClickbaitDataset(val_texts, val_labels)
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    # 5. Optimizer
    optimizer = AdamW(train_model_instance.parameters(),
                      lr=learning_rate, weight_decay=0.01)

    # 6. Boucle d'entraînement
    best_f1 = 0.0
    for epoch in range(epochs):
        # ── Train ──
        train_model_instance.train()
        total_loss = 0
        for batch in tqdm(train_loader, desc=f"Epoch {epoch+1}/{epochs} [Train]"):
            batch = {k: v.to(device) for k, v in batch.items()}
            optimizer.zero_grad()
            outputs = train_model_instance(**batch)
            loss = outputs.loss
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        avg_loss = total_loss / len(train_loader)

        # ── Validation ──
        train_model_instance.eval()
        all_preds, all_labels = [], []
        with torch.no_grad():
            for batch in tqdm(val_loader, desc=f"Epoch {epoch+1}/{epochs} [Val]"):
                labels_batch = batch.pop("labels")
                batch = {k: v.to(device) for k, v in batch.items()}
                outputs = train_model_instance(**batch)
                preds = torch.argmax(outputs.logits, dim=1)
                all_preds.extend(preds.cpu().numpy())
                all_labels.extend(labels_batch.numpy())

        f1 = f1_score(all_labels, all_preds, average="weighted")
        print(f"[Train] Epoch {epoch+1} | Loss: {avg_loss:.4f} | F1: {f1:.4f}")

        # Sauvegarder le meilleur modèle
        if f1 > best_f1:
            best_f1 = f1
            train_model_instance.save_pretrained(model_save_path)
            tokenizer.save_pretrained(model_save_path)
            print(f"[Train] ✅ Best model saved (F1={best_f1:.4f})")

    print(f"[Train] Complete. Best F1: {best_f1:.4f} (target: 0.75)")

    # Recharger le modèle fine-tuné pour predict()
    model = ElectraForSequenceClassification.from_pretrained(model_save_path)
    model.eval()

    return best_f1


# Test rapide
if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "train":
        # Mode entraînement: python koelectra_classifier.py train
        DATA_PATH = r"C:\dataset"
        train_model(DATA_PATH, max_per_class=10000)
    else:
        # Mode test: python koelectra_classifier.py
        test_text = "정부가 오늘 새로운 경제 정책을 발표했습니다."
        result = predict(test_text)
        print(result)
