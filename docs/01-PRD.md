# 📋 Product Requirements Document (PRD)
## Advanced Personal Page — v1.3

---

## 1. Product Overview

| Parameter | Details |
|---|---|
| **Project Name** | Advanced Personal Page |
| **Type** | Professional Portfolio & Brand Website |
| **Core Objective** | Deliver a premium digital identity that showcases projects, narrates the developer's journey, engages visitors dynamically, and manages content via an admin dashboard. |
| **Target Audience** | Potential clients, employers, and the tech community. |
| **General Aesthetic** | Luxury & Serenity |

---

## 2. Functional Requirements (FR)

### FR-01: Home Page (The Hook)

| ID | Requirement | Priority |
|---|---|---|
| FR-01.1 | "About Me" section with a floating text animation. | **High** |
| FR-01.2 | Two-and-a-half dimensional (2.5D) parallax character image with realistic physics. | **High** |
| FR-01.3 | Parallax depth effect: The character follows card movement with inertia/lag without leaving the boundaries. | **High** |
| FR-01.4 | Short "My Projects" section with cards that cycle automatically every 5 seconds. | **High** |
| FR-01.5 | Project cards: Floating images + subtle blur + brief summary. | **High** |
| FR-01.6 | Clicking a project card redirects to its detailed project page. | **High** |

---

### FR-02: Journey (The Story)

| ID | Requirement | Priority |
|---|---|---|
| FR-02.1 | Accessed by clicking the "About Me" card from the Home page. | **High** |
| FR-02.2 | Interactive chronological timeline presented as sequential cards. | **High** |
| FR-02.3 | Each card contains: date of achievement/learning, age at that time, and skill/project image. | **High** |
| FR-02.4 | Storytelling summary displayed on the right focusing on human context: motivations, circumstances, and personal impact. | **High** |
| FR-02.5 | Focus on the human narrative, avoiding overly complex technical jargon. | **Medium** |

---

### FR-03: Portfolio

| ID | Requirement | Priority |
|---|---|---|
| FR-03.1 | Main showcase layout: Project summary on the right, images on the left. | **High** |
| FR-03.2 | Images can be static or cycle automatically. | **High** |
| FR-03.3 | Clicking a project opens its detailed page. | **High** |
| FR-03.4 | Project live preview link. | **High** |
| FR-03.5 | Image gallery with manual navigation or auto-slide every 5 seconds. | **High** |
| FR-03.6 | Fullscreen image zoom functionality maintaining aspect ratio and quality. | **High** |
| FR-03.7 | Detailed description including: development story, challenges and solutions, build duration, skills/technologies, and motivation. | **High** |

---

### FR-04: Engagement & Contact

| ID | Requirement | Priority |
|---|---|---|
| FR-04.1 | **Interactive Survey:** Card-based UI asking visitors how they discovered the developer and their goals. | **High** |
| FR-04.2 | Survey provides pre-defined options + free text fields. | **High** |
| FR-04.3 | Option to skip individual questions or the entire survey. | **High** |
| FR-04.4 | **Chat/Contact:** A contact section allowing visitors to message the owner directly. | **High** |
| FR-04.5 | **Feedback/Support:** A channel for visitors to submit tips, complaints, or technical notes. | **High** |

---

### FR-05: Admin Dashboard (CMS)

| ID | Requirement | Priority |
|---|---|---|
| FR-05.1 | Secure login restricted exclusively to the owner's account. | **Critical** |
| FR-05.2 | Ability to manage and update social links. | **High** |
| FR-05.3 | Analytics panel summarizing survey responses categorized by target groups. | **High** |
| FR-05.4 | Option to export user responses and accounts details in JSON format. | **High** |
| FR-05.5 | Inbox to read messages sent via the contact form. | **High** |
| FR-05.6 | Automated message forwarding to the owner's email address. | **High** |
| FR-05.7 | Behavioral analytics tracking via **Vercel Analytics** (without database read/write overhead). | **High** |

---

### FR-06: Navigation & Shared Components

| ID | Requirement | Priority |
|---|---|---|
| FR-06.1 | Social link shortcuts (WhatsApp, LinkedIn, Mostaql) persistently available in the Footer. | **High** |
| FR-06.2 | Flexible footer architecture allowing dynamic additions of new platforms in the future. | **Medium** |
| FR-06.3 | Clicking the "About Me" card redirects to the "Journey" page. | **High** |

---

## 3. Non-Functional Requirements (NFR)

| ID | Requirement | Priority |
|---|---|---|
| NFR-01 | **Performance:** Maximum optimization for load speeds and minimized page weight. | **Critical** |
| NFR-02 | **Responsive Design:** Independent, tailored layouts for Desktop, Mobile, and Tablet devices. | **Critical** |
| NFR-03 | **Visual Identity:** Luxury & Serenity theme with professional, harmonious color palettes. | **High** |
| NFR-04 | **Animations:** Subtle micro-interactions on general components, with premium animation density on main landing pages. | **High** |
| NFR-05 | **Scalability:** System architecture designed to support adding new content and social integrations smoothly. | **Medium** |
| NFR-06 | **API Security:** Rate limiting via **Upstash** to prevent spam (max 5 messages/IP/hour). | **High** |
| NFR-07 | **Data Security:** Row-Level Security (RLS) enabled on all database tables + disabled public signup (owner account only). | **Critical** |
