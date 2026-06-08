# Future Headlines

An AI-powered time-travel newspaper that lets you explore fictional headlines from the future.

Future Headlines generates an entire newspaper front page based on a topic, year, and narrative mode, creating an immersive reading experience that feels like opening a newspaper from another era.

---

## Inspiration

This project started as an experiment to learn how APIs work in web applications.

What began as a simple idea gradually evolved into a full project involving Python, Flask, JavaScript, API integration, deployment, UI design, and debugging.

The biggest challenge was not the AI integration—it was the newspaper design itself. I experimented with multiple themes including:

* Futuristic newspapers
* Cosmic newspapers
* Time-travel newspapers

After many redesigns and CSS rewrites, I returned to the original vision: an ancient, mythic-inspired newspaper aesthetic.

The result is a vintage newspaper experience that generates stories from the future.

---

## Features

* Generate future news based on any topic
* Select a future year
* Choose different news modes:

  * Optimistic
  * Neutral
  * Dystopian
* AI-generated headlines and articles
* Vintage newspaper-inspired layout
* Responsive design for desktop and mobile
* User-provided Gemini API key support

---

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Python
* Flask

### AI

* Google Gemini API

### Deployment

* Render

---

## What I Learned

Through this project I learned:

* How to work with APIs in web applications
* How frontend and backend communicate
* Using Flask for web development
* Handling JSON responses from APIs
* Debugging deployment issues
* Reading logs and tracing errors
* Working with Git and GitHub
* Deploying applications to Render
* Designing user interfaces with CSS

One of the most valuable lessons was learning that not every error comes from code. During development I spent hours debugging an issue that turned out to be caused by model access limitations and API tier restrictions rather than a programming mistake.

---

## Challenges

### Newspaper Design

The newspaper layout took the longest time to build.

Creating something that felt like a real newspaper while still being readable and responsive required numerous redesigns and CSS experiments.

### Gemini Model Issues

Initially the application used Gemini 2.5 Flash. After deployment I repeatedly encountered usage and access issues.

After extensive debugging, forum research, and code reviews, I discovered that the problem was related to model availability and tier limitations rather than my implementation.

Switching to a compatible model resolved the issue.

### Formatting AI Output

Generating content was only half the challenge.

The AI responses needed to be transformed into a structured newspaper format, which required careful handling of JSON data and layout design.

---

## Future Improvements

* Multiple newspaper themes
* Historical newspaper mode
* PDF newspaper export
* Shareable newspaper links
* Custom illustrations and images
* Additional storytelling modes

---

## Running Locally

1. Clone the repository

```bash
git clone https://github.com/hrishikesh599/Future-Headlines.git
```

2. Install dependencies

```bash
pip install -r requirements.txt
```

3. Run the application

```bash
python app.py
```

4. Open your browser and visit

```text
http://localhost:5000
```

---

## Project Status

Completed and deployed.

Built as a learning project to explore AI APIs, web development, and creative interface design.

---

Created by Hrishikesh
