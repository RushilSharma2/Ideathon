# Placement Radar

### Know your gap. Fix it first.

**LLOYD Hackathon — Problem Statement 4: Open Innovation (Student Pain Points)**

Placement Radar is a personalized placement-preparation platform designed to help students identify their biggest preparation gap and decide what they should work on next. Instead of giving every student the same generic placement checklist, Placement Radar uses a diagnostic-first approach to assess readiness, prioritize the highest-impact weakness, create a focused plan, and track progress over time.

> **Core loop:** Diagnose → Prioritize → Act → Measure → Re-prioritize

---

## 1. Problem Statement

Students preparing for placements usually work across several areas at the same time:

- DSA / programming
- Technical skills
- Aptitude
- Projects
- Resume
- Interview preparation
- Communication
- Certifications and other role-specific skills

The problem is not simply a lack of resources. Students often do not know **which area is currently holding them back the most**.

A student may spend several hours solving DSA questions when their real weakness is interview readiness, or collect certifications while their technical fundamentals remain weak.

Existing placement-preparation platforms commonly provide content, courses, question banks, roadmaps or job information. Placement Radar focuses on a different question:

> **“What should I fix next?”**

The goal is to turn preparation from a collection of disconnected activities into a personalized improvement loop.

---

# 2. What It Does

Placement Radar asks the student to complete a readiness diagnostic based on their target role and preparation context. It evaluates relevant preparation areas, identifies the most important current bottleneck, and creates a focused preparation plan.

The student can then record daily progress, revisit the diagnostic, and run additional diagnostics without losing previous attempts.

**Problem Statement:** #4 — Open Innovation (Student Pain Points)

---

# 3. Target Users

Placement Radar is designed for students preparing for:

- Campus placements
- Off-campus jobs
- Internships
- Technical interviews
- Non-technical / management roles
- Role-specific career preparation

It can be used by students from different years, branches and colleges because the diagnostic adapts its focus to the selected target role.

---

# 4. Core User Journey

```text
                    ┌───────────────────┐
                    │     Sign In       │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  Student Profile  │
                    │ Role / Year /     │
                    │ College / Time    │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    Diagnostic     │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Readiness Scores  │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Find Biggest Gap  │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Personalized Plan│
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Daily Progress    │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Re-prioritize /   │
                    │ New Diagnostic    │
                    └───────────────────┘
```

---

# 5. Key Features

## Personalized Diagnostic

The student provides basic preparation context such as:

- Name
- College
- Year
- Branch
- Target role
- Company type
- Current preparation level
- Daily preparation time

The diagnostic then focuses on areas relevant to the selected role.

### Supported role areas

**Software Developer**
- Programming
- DSA
- Databases
- Web
- Git
- Problem Solving
- Interview

**Data Analyst**
- Statistics
- SQL
- Data Analysis
- Visualization
- Business Analysis
- Data Quality
- Communication / Interview

**Cybersecurity**
- Security Fundamentals
- Networking
- Web Security
- SOC / Blue Team
- Incident Response
- Cloud Security
- Interview

**Business / Management**
- Business Basics
- Marketing
- Finance
- Strategy
- Operations
- Communication
- Leadership
- Analytics / Case Interview

**Core Engineering**
- Engineering Basics
- Electrical / Electronics
- Problem Solving
- Quality
- Manufacturing
- Safety
- Measurement
- Documentation
- Project Work
- Interview

---

# 6. Biggest Gap / Bottleneck

The central purpose of the diagnostic is not just to produce a score.

Placement Radar identifies the student's most important current bottleneck and uses it to determine what the student should prioritize.

For example:

```text
Overall Readiness: 68 / 100

Strongest:
Technical Fundamentals     78
Projects                   74

Needs Attention:
Interview                  52

Biggest Gap:
Interview Readiness
```

The system then focuses the student's plan around the identified gap.

---

# 7. Adaptive Preparation Plan

The plan duration is adapted according to readiness and available preparation time.

The current prototype uses the following planning logic:

| Condition | Base Plan |
|---|---:|
| Weakest score ≥ 75 | 10 days |
| Weakest score ≥ 60 | 15 days |
| Weakest score ≥ 45 | 20 days |
| Weakest score < 45 | 25 days |

Daily preparation time also affects the plan:

- Less than 1.5 hours/day → additional time
- 4 or more hours/day → shorter plan

The final duration is constrained to a practical range.

The purpose is to avoid giving every student the same fixed timetable.

---

# 8. Daily Progress

Students can record their progress through daily, role-specific practice.

The daily flow is:

```text
Question 1
   ↓
Next Question
   ↓
Question 2
   ↓
Next Question
   ↓
Question 3
   ↓
Submit & Record Progress
```

Daily questions are designed around the student's diagnostic focus and role rather than using exactly the same questions every day.

Progress is saved so students can return later without losing their previous work.

---

# 9. Multiple Diagnostics

A student may have more than one preparation goal.

For example:

```text
Diagnostic 1
Software Developer
Day 8 / 20
Score: 72 / 100

Diagnostic 2
Cybersecurity
Day 3 / 15
Score: 61 / 100
```

Each diagnostic is treated as an independent workspace.

Students can:

- Create a new diagnostic
- Save the current diagnostic
- Continue an existing diagnostic
- Work on multiple diagnostics side by side
- View previous diagnostics
- Delete a diagnostic after finishing with it

A missed day does not delete the diagnostic or its progress.

---

# 10. Diagnostic History

The **View Diagnostics** section stores previous diagnostic attempts.

A saved diagnostic can contain:

- Diagnostic number
- Date
- Target role
- Overall readiness score
- Individual readiness scores
- Biggest bottleneck
- Preparation plan
- Daily progress
- Diagnostic answers / assessment information

This makes it possible to compare preparation over time.

Example:

```text
Diagnostic 1 → 58 / 100
Diagnostic 2 → 71 / 100
Diagnostic 3 → 82 / 100
```

The student's preparation journey therefore becomes measurable instead of being a collection of disconnected practice sessions.

---

# 11. Why This Is Different

Placement Radar is not intended to replace learning platforms, coding platforms, resume builders or interview-question banks.

Those tools answer questions such as:

- “Where can I learn DSA?”
- “Where can I practice aptitude?”
- “How do I create a resume?”
- “Where can I find interview questions?”

Placement Radar focuses on a different question:

> **“Given where I am right now, what should I fix next?”**

The product sits above individual preparation resources as a **prioritization and progress layer**.

---

# 12. What We Added

Beyond the basic diagnostic concept, the prototype includes:

### Independent diagnostic workspaces
Students can maintain multiple preparation tracks at the same time.

### Diagnostic history
Previous assessments remain available instead of being overwritten.

### Resume-anytime workflow
Students can return to an existing diagnostic after missing days.

### Diagnostic deletion
Students can permanently remove an old diagnostic from their diagnostic list.

### Separate login and diagnostic creation
Logging into an existing account does not automatically start a new diagnostic.

### Browser navigation recovery
Returning to the diagnostic list through browser navigation restores the correct available actions.

### Adaptive planning
Plan duration considers both readiness and available daily preparation time.

### Role-specific diagnostics
Different target roles receive different readiness areas.

---

# 13. Evidence of Student Need

Problem Statement 4 specifically requires evidence that students actually need the problem solved. The hackathon brief requires a short survey with results or interviews with at least five students, with the evidence stored in the repository and summarized here.

**Do not submit invented numbers. Replace the section below with the team's actual survey/interview results.**

### Survey / Interview Summary

**Number of students surveyed/interviewed:** `[INSERT ACTUAL NUMBER]`

**Colleges represented:** `[INSERT ACTUAL COLLEGES]`

**Years represented:** `[INSERT ACTUAL YEARS]`

### Key findings

| Finding | Actual result |
|---|---|
| Students who struggle to decide what to prioritize | `[X%]` |
| Students who prepare across multiple disconnected areas | `[X%]` |
| Students who would use personalized preparation guidance | `[X%]` |
| Students who currently track preparation manually | `[X%]` |

### Student Quotes

> “[INSERT REAL STUDENT QUOTE]”

> “[INSERT REAL STUDENT QUOTE]”

> “[INSERT REAL STUDENT QUOTE]”

Full evidence should be placed in:

```text
evidence/
├── survey-results.csv
├── interview-notes.md
└── README.md
```

---

# 14. Architecture

The current prototype is a lightweight web application.

```text
┌──────────────────────────────────────┐
│              Frontend                │
│                                      │
│  Home → Login → Profile → Diagnosis  │
│                 ↓                    │
│        Dashboard / My Plan            │
│                 ↓                    │
│       Progress / Diagnostics         │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│          Application Logic            │
│                                      │
│ Diagnostic scoring                   │
│ Role-specific question banks         │
│ Bottleneck identification            │
│ Adaptive plan duration               │
│ Progress tracking                    │
│ Diagnostic management                │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│         Browser Storage              │
│                                      │
│ User/session state                   │
│ Diagnostic history                   │
│ Diagnostic-specific progress         │
│ Plans and assessment information     │
└──────────────────────────────────────┘
```

The prototype intentionally keeps the architecture lightweight so that the core user experience can be demonstrated quickly during the hackathon.

---

# 15. Why This Architecture

The prototype uses a simple frontend architecture because the main hackathon objective is to validate the student problem and demonstrate the complete user flow.

Benefits:

- Easy to run locally
- Fast iteration during the hackathon
- No unnecessary backend complexity for the prototype
- Diagnostic history can be demonstrated immediately
- Easy to deploy as a static web application

A production version can move persistent user and diagnostic data to a secure backend/database.

---

# 16. Project Structure

```text
placement-radar/
│
├── index.html
├── profile.html
├── diagnosis.html
├── analyzing.html
├── dashboard.html
├── plan.html
├── progress.html
├── diagnostics.html
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── evidence/
│   ├── survey-results.csv
│   ├── interview-notes.md
│   └── README.md
│
├── README.md
└── .gitignore
```

---

# 17. How to Run

## Option 1 — Run locally

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd placement-radar
```

Because the prototype is frontend-based, it can be served using a simple local server.

For example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## Option 2 — VS Code Live Server

1. Open the project in VS Code.
2. Install the Live Server extension if required.
3. Open `index.html`.
4. Select **Open with Live Server**.

---

# 18. Test Login

If the demo authentication is enabled in the submitted prototype:

```text
Username: demo
Password: RadarDemo123
```

> Replace these credentials if the final deployed version uses a different authentication configuration.

Logging in through the **Log In** option should return the user to the home experience without starting a new diagnostic.

The **Start Your Diagnostic** action is separate and is used when the student actually wants to create a diagnostic.

---

# 19. Tools and AI Used

### Frontend

- HTML
- CSS
- JavaScript
- Browser Local Storage for prototype persistence

### Development

- Visual Studio Code
- Git
- GitHub

### AI-assisted development

AI coding assistance was used during development for tasks such as:

- UI iteration
- debugging
- code generation
- logic refinement
- documentation assistance

AI should be clearly identified in the project's final documentation according to the hackathon requirements.

If an AI model or external AI API is connected in the final version, document:

- Model/provider
- API/service used
- What the model is responsible for
- What data is sent to it
- How users are informed that AI is involved

---

# 20. Data and Privacy

Placement Radar should collect only the information necessary for the preparation experience.

The hackathon guidelines require teams not to collect more personal data than the application needs and to clearly tell users when they are interacting with AI.

The prototype therefore focuses on preparation-related information such as:

- Target role
- Preparation level
- Daily preparation time
- Diagnostic answers
- Progress

Do not commit:

```text
.env
API keys
Passwords
Private credentials
node_modules/
Build output
```

Use environment variables and provide a `.env.example` if the production architecture requires environment configuration.

---

# 21. Done / Left / Plan

## Done

- [x] Landing page
- [x] Login flow
- [x] Student profile
- [x] Role-specific diagnostics
- [x] Readiness scoring
- [x] Bottleneck identification
- [x] Adaptive preparation duration
- [x] Personalized plan
- [x] Daily progress tracking
- [x] Diagnostic history
- [x] Multiple independent diagnostics
- [x] Continue diagnostic
- [x] Delete diagnostic
- [x] Separate login and new-diagnostic flows
- [x] Browser navigation recovery
- [x] Responsive UI foundation

## Left

- [ ] Complete and document real student survey/interview evidence
- [ ] Add final evidence files to the repository
- [ ] Finalize production authentication
- [ ] Add secure backend persistence
- [ ] Add final deployment URL
- [ ] Final accessibility review
- [ ] Final mobile testing
- [ ] Final security review

## Plan

1. Validate the workflow with real students.
2. Add the actual survey/interview evidence.
3. Deploy the final version.
4. Test the complete flow on desktop and mobile.
5. Fix usability and accessibility issues.
6. Finalize README and presentation.
7. Prepare the 6-minute final demonstration.

---

# 22. Hackathon Demo Flow

For the live demonstration, the recommended flow is:

### 1. Problem

Explain that students have many preparation resources but often do not know their biggest current preparation gap.

### 2. Diagnose

Open Placement Radar and start a diagnostic.

### 3. Personalization

Show the student profile and target role.

### 4. Result

Show the readiness breakdown and biggest bottleneck.

### 5. Plan

Show how the system converts the bottleneck into a focused preparation plan.

### 6. Progress

Record a daily practice session.

### 7. Multiple diagnostics

Open **View Diagnostics** and demonstrate that multiple preparation tracks can exist independently.

### 8. Continue

Open an existing diagnostic and show that the student can continue where they left off.

### 9. Re-prioritize

Explain that the long-term goal is a continuous:

```text
Diagnose
   ↓
Prioritize
   ↓
Act
   ↓
Measure
   ↓
Re-prioritize
```

---

# 23. Accessibility and Mobile

The final submission should be checked for:

- Readable contrast
- Clearly labelled controls
- Keyboard usability
- Responsive layout
- Mobile navigation
- Touch-friendly buttons
- Clear error messages
- No broken layouts on smaller screens

These checks are important because the hackathon brief explicitly expects accessibility basics and mobile-friendly behavior.

---

# 24. Deployment

**Live URL:** `[INSERT FINAL PUBLIC URL]`

**GitHub Repository:** `[INSERT GITHUB REPOSITORY URL]`

Before submission, verify that:

- The URL is publicly accessible.
- Judges can use the application without assistance.
- No API keys are exposed.
- The application works on a phone.
- Invalid input does not break the application.
- A test login is provided if required.

---

# 25. Future Roadmap

The current prototype can evolve into a full placement-readiness platform.

Potential future additions:

- Secure backend/database
- Real AI-powered diagnostic generation
- Resume analysis
- Job-description matching
- Interview simulation
- DSA performance integration
- Aptitude performance integration
- Skill-gap trend analysis
- College-level dashboards
- Mentor / faculty dashboards
- Placement-drive recommendations
- Evidence-based readiness predictions
- Notifications and reminders
- Progress comparisons across diagnostic attempts

---

# 26. Why Students Would Come Back

The product is designed around a recurring need rather than a one-time assessment.

A student can:

1. Diagnose their current readiness.
2. Work on the highest-impact gap.
3. Record progress.
4. Reassess later.
5. See whether the gap improved.
6. Identify the next bottleneck.

That creates a continuous preparation cycle rather than a one-time checklist.

---

# 27. Submission Checklist

Before the final hackathon submission:

- [ ] Public GitHub repository
- [ ] Problem Statement #4 clearly mentioned
- [ ] Actual survey/interview evidence included
- [ ] Real numbers and student quotes added
- [ ] README completed
- [ ] No API keys committed
- [ ] `.env` files excluded
- [ ] Live public URL added
- [ ] Test login added if needed
- [ ] Mobile testing completed
- [ ] Accessibility basics checked
- [ ] PPT completed
- [ ] Demo flow rehearsed
- [ ] Backup recorded demo prepared

---

## License

Add the team's chosen license before publishing the repository.

---

## Team

**Team Name:** ReconX

**Team Leader:** Rushil Sharma

**Team Member:** Sam Thakuri

**Project:** Placement Radar

**Problem Statement:** #4 — Open Innovation (Student Pain Points)

**Tagline:** **Know your gap. Fix it first.**

