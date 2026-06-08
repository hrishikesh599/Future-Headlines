import os
import json
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)


def build_prompt(year: str, theme: str, mode: str) -> str:
    mode_desc = {
        "Optimistic": "a hopeful, flourishing world where technology and humanity thrive",
        "Neutral":    "a mixed world with both progress and setbacks, realistic and grounded",
        "Dystopian":  "a grim, troubled world with serious societal and environmental problems",
    }.get(mode, "a neutral future")

    return f"""You are a newspaper generator creating a realistic front page from the year {year}.
Theme: {theme}
Future Mode: {mode} — {mode_desc}

Generate a complete, immersive newspaper front page that feels genuinely from {year}.
Return ONLY valid JSON. No markdown, no backticks, no explanation.

{{
  "newspaper_name": "Creative newspaper name fitting the theme and era",
  "tagline": "Short newspaper motto",
  "date": "Full date in {year} (e.g. March 14, {year})",
  "edition": "e.g. MORNING EDITION",
  "price": "Newspaper price in future currency",
  "volume": "e.g. Vol. CXLII, No. 47",
  "ticker": ["5 short breaking news items, each under 12 words"],
  "lead": {{
    "headline": "Dramatic main headline specific to {year} and {theme}",
    "deck": "Subheadline expanding on the main story",
    "byline": "Reporter name and futuristic location",
    "col1": "First column of lead story (70-90 words), vivid and immersive",
    "col2": "Second column continuation (60-80 words)",
    "col3": "Third column (50-70 words), ends with cliff-hanger or key detail",
    "pull_quote": "A compelling quote from the story, attributed to someone"
  }},
  "story2": {{
    "headline": "Second story headline",
    "subhead": "Brief subheadline",
    "byline": "Reporter name",
    "body": "Story body (80-100 words)"
  }},
  "story3": {{
    "headline": "Third story headline",
    "subhead": "Brief subheadline",
    "byline": "Reporter name",
    "body": "Story body (60-80 words)"
  }},
  "weather": {{
    "temp": "Temperature with unit (can be unusual in far future)",
    "condition": "Weather condition",
    "detail": "2-3 sentences of weather detail, potentially strange for the era"
  }},
  "ad1": {{
    "title": "Futuristic product or service name",
    "body": "Ad copy (20-30 words)",
    "cta": "Call to action"
  }},
  "ad2": {{
    "title": "Second ad title",
    "body": "Ad copy (15-20 words)",
    "cta": "Call to action"
  }},
  "trending": ["5 trending topics, each 4-8 words, realistic for {year} and {theme} in {mode} mode"]
}}

Make everything feel genuinely from {year}. Be creative, specific, and immersive."""


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()

    year = data.get("year", "2077")
    theme = data.get("theme", "World")
    mode = data.get("mode", "Neutral")
    api_key = data.get("apiKey", "").strip()

    if not api_key:
        return jsonify({
            "ok": False,
            "error": "Please enter your Gemini API key."
        }), 400

    try:
        genai.configure(api_key=api_key)

        model = genai.GenerativeModel(
            "gemini-2.5-flash-lite"
        )

        response = model.generate_content(
            build_prompt(year, theme, mode)
        )

        raw = response.text.strip()

        # Remove markdown fences if Gemini adds them
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1]

        if raw.endswith("```"):
            raw = raw.rsplit("```", 1)[0]

        # Extract JSON safely
        start = raw.find("{")
        end = raw.rfind("}") + 1

        if start == -1 or end == 0:
            raise ValueError("Model did not return valid JSON.")

        paper = json.loads(raw[start:end])

        return jsonify({
            "ok": True,
            "paper": paper
        })

    except json.JSONDecodeError as e:
        return jsonify({
            "ok": False,
            "error": f"JSON parse error: {e}"
        }), 500

    except Exception as e:
        return jsonify({
            "ok": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)




