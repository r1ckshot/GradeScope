# 🎓 GradeScope — Student Performance Predictor

**A browser-based ML dashboard** that predicts whether a student will pass or fail an exam — entirely client-side, no backend required.

🔗 **Live demo:** [r1ckshot.github.io/GradeScope](https://r1ckshot.github.io/GradeScope)

<table>
  <td><img src="https://github.com/user-attachments/assets/13fbc6e4-8d65-459d-9755-655f9a16cb5d" alt="GradeScope Dashboard"/></td>
</table>

---

## ✨ Features

### ⚡ Real-time ML Inference
- Three models running live in the browser — Random Forest, SVM, Gradient Boosting
- Predictions update instantly as you move sliders, no button needed

### 🔢 Fuzzy Logic Score
- Continuous 0–100 performance estimate based on attendance and study hours
- Semicircular gauge visualization with Low / Mid / High zones

### 📋 Active Decision Rule
- The exact IF/AND path from a Decision Tree that fired for current inputs
- Updates live alongside ML predictions

### 🫧 Lava Lamp Background
- CSS metaball animation (`filter: blur + contrast`) built from scratch
- Organic blob physics with breathing shapes

---

## 🏗️ How It Works

Each sklearn `Pipeline` (StandardScaler + model) is exported as a single `.onnx` file — the browser passes raw values and scaling happens inside ONNX. Fuzzy logic is reimplemented in vanilla JS.

```
Python (scikit-learn) → ONNX export → Browser (onnxruntime-web)
```

| Stage | Tool |
|---|---|
| EDA & preprocessing | pandas, numpy, matplotlib, seaborn |
| Feature selection | RandomForest importance + PCA |
| Models | Random Forest, SVM, Gradient Boosting |
| Symbolic rules | Decision Tree (`max_depth=4`) |
| Fuzzy logic | scikit-fuzzy |
| ONNX export | skl2onnx |
| Browser inference | onnxruntime-web |

**Dataset:** [Student Performance Factors](https://www.kaggle.com/datasets/lainguyn123/student-performance-factors) — 6607 records (Kaggle)

---

## 🛠️ Technologies

![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/Vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/github%20pages-121013?style=for-the-badge&logo=github&logoColor=white)

---

## 🤖 AI-Assisted Development

This project was built using **Claude Code** as the primary coding assistant.

- **Me** — architecture decisions, ML choices, UI direction, testing and feedback
- **Claude** — implementing code based on my requirements

> *"Every decision was mine. Claude accelerated execution; I owned the vision."*

---

## 📚 What I Learned

- Running ML models fully client-side via ONNX Runtime Web — no backend, no API calls
- Exporting sklearn Pipelines to ONNX while keeping StandardScaler inside the model
- Reimplementing fuzzy logic (trimf, defuzzification) in vanilla JavaScript
- Single-threaded WASM constraints with onnxruntime-web and sequential inference
- CSS metaball technique: `filter: blur() contrast()` for organic lava lamp animations

---

## 👨‍💻 Author

**Mykhailo Kapustianyk**
- GitHub: [@r1ckshot](https://github.com/r1ckshot)
- Year: 2026
