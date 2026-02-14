# 🍎 BuiltbyAbbs - Macro Tracker

BuiltbyAbbs is a streamlined, client-side **AI-Powered Nutrition Assistant** designed to help users manage their dietary goals with precision. This application provides a single-page interface for tracking macronutrients, monitoring weekly performance trends, and interacting with a dedicated AI nutrition coach.

---

## 🚀 Features

* **Dynamic Dashboard:** Real-time progress bars for Protein, Carbs, and Fats with a centralized calorie counter.
* **Weekly Scorecard:** A proprietary scoring algorithm that calculates a "Performance Score" based on consistency and goal accuracy over the last 7 days.
* **Intelligent Logging:** * Manual food and macro entry.
    * Retroactive logging (add meals to specific days in the past).
    * Image upload placeholder for AI-powered nutrition label scanning.
* **AI Nutrition Coach:** A built-in chat interface that provides contextual feedback based on your current daily intake.
* **Privacy-First:** All data is stored locally in your browser’s `localStorage`. No external database is required.

---

## 🛠️ Tech Stack

* **Framework:** Vanilla JavaScript (ES6+)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Persistence:** Browser `localStorage` API
* **Architecture:** State-driven UI rendering

---

## 📂 Getting Started

Since this is a client-side application, getting started is as simple as opening the file.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/macro-tracker.git](https://github.com/your-username/macro-tracker.git)
    ```
2.  **Open the project:**
    Simply open `index.html` in any modern web browser.

---

## ⚙️ How It Works

### The Scoring System
The application calculates your **Weekly Score** using a weighted average of four components per day:
1.  **Protein Accuracy** (capped at 100%)
2.  **Carb Accuracy** (capped at 100%)
3.  **Fat Accuracy** (capped at 100%)
4.  **Caloric Proximity** (100% score if within 10% of the goal; 70% otherwise)

### State Management
The app uses a centralized `state` object to manage:
- User-defined goals
- Food entry history
- Chat logs
- Viewport/Tab navigation

---

## 📝 Roadmap & Future Enhancements

- [ ] **API Integration:** Connect the `AI Coach` to a live LLM (e.g., Claude or OpenAI) for real-time analysis.
- [ ] **OCR Scanning:** Implement Vision API to automatically extract macros from nutrition label photos.
- [ ] **Data Export:** Option to download history as a CSV or PDF report.
- [ ] **Dark Mode:** Add a theme toggle for late-night logging.

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features or improvements, feel free to fork the repository and submit a pull request.

---
