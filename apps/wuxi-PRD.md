# Product Requirement Document: Wuxi Movie Discovery Platform

## 1. Executive Summary
**Product Name:** Wuxi
**Version:** 1.0
**Status:** Live / Beta
**Owner:** RhytoLeaf Inc.

**Wuxi** is a web-based movie discovery application designed to provide users with a visual and accessible interface to explore popular movies and search for specific titles. The platform emphasizes a modern "glassmorphism" aesthetic and includes integrated accessibility features, specifically text-to-speech functionality for movie synopses.

## 2. Product Objectives
* To provide an up-to-date feed of popular movies using external API data.
* To allow users to search for specific movies by title.
* To provide instant visual feedback on movie ratings.
* To enhance accessibility by reading movie overviews aloud via the Web Speech API.
* To ensure a fully responsive experience across mobile, tablet, and desktop devices.

## 3. User Personas
* **The Browser:** A user looking for recommendations on what to watch next based on current popularity.
* **The Searcher:** A user looking for details (plot, rating) on a specific movie.
* **The Accessibility User:** A user who prefers or requires audio descriptions of text content rather than reading small print.

## 4. Functional Requirements

### 4.1. Home Page / Default View
* **FR 1.1:** Upon loading, the application must fetch and display a list of "Recent Releases" (sorted by popularity) from The Movie Database (TMDB) API.
* **FR 1.2:** The application must display a loading spinner animation while fetching data.
* **FR 1.3:** If the API fails, a user-friendly error message ("Error loading movies") must be displayed.

### 4.2. Search Functionality
* **FR 2.1:** The header must contain a search bar with the placeholder "Search for a movie...".
* **FR 2.2:** Submitting the search form must query the TMDB Search API with the user's input.
* **FR 2.3:** The section title must update dynamically to read "Search Results for '[User Input]'" upon a successful search.
* **FR 2.4:** If no results are found, the system must hide the grid and display an "Empty State" message with an illustration and text advising the user to try again.

### 4.3. Movie Card Components
Each movie result must be displayed as a card containing:
* **FR 3.1 Visuals:** The movie poster image fetched from TMDB.
* **FR 3.2 Meta Data:** The movie title (truncated to 2 lines if necessary) and the average vote rating.
* **FR 3.3 Rating Badge:** The vote average must be displayed in a rounded badge with color-coding logic:
    * **Green:** Rating ≥ 8
    * **Orange:** Rating ≥ 5 and < 8
    * **Red:** Rating < 5
* **FR 3.4 Hover Interaction:** Hovering over the card (or tapping on mobile) must slide up an overlay containing the "Overview" section.

### 4.4. Accessibility & Audio Features
Inside the movie card overlay (Overview section):
* **FR 4.1:** The full plot synopsis (overview) must be displayed.
* **FR 4.2:** A "Read Aloud" button must be available. Clicking this triggers the browser's `SpeechSynthesisUtterance` to read the overview text at a rate of 0.9x speed.
* **FR 4.3:** A "Stop" button must be available to immediately cancel any active speech.
* **FR 4.4:** Any active speech must automatically cancel if the user navigates away or unloads the page.

### 4.5. Navigation
* **FR 5.1:** A "Back to Home" link must be present at the top of the page to allow users to return to the main landing page (`index.html`).

## 5. Non-Functional Requirements

### 5.1. UI/UX Design System
* **Theme:** Dark mode with a specific gradient background (`#0f2027` to `#2c5364`).
* **Styling:** Implementation of "Glassmorphism" (semi-transparent backgrounds with blur filters) for containers and cards.
* **Brand Colors:** Primary action color is "Rhyto Green" (`#00CE7C`).
* **Typography:** 'Montserrat' font family for all text elements.

### 5.2. Responsiveness
* The layout must utilize a fluid grid system (Tailwind CSS) that adapts to the viewport:
    * **Mobile:** 1 column
    * **Small Tablet:** 2 columns
    * **Tablet:** 3 columns
    * **Desktop:** 4 columns
    * **Large Desktop:** 5 columns.

### 5.3. Performance
* **Lazy Loading:** Images must utilize `loading="lazy"` to improve initial page load performance.
* **CDN Usage:** Tailwind CSS is loaded via CDN for rapid styling implementation without a build step.

## 6. Technical Stack & Dependencies
* **Frontend:** HTML5, CSS3 (Tailwind CSS CDN), Vanilla JavaScript (ES6+).
* **Data Provider:** The Movie Database (TMDB) API v3.
* **Browser APIs:** Web Speech API (`speechSynthesis`).
* **Fonts:** Google Fonts (Montserrat).

## 7. Data Dictionary
The application relies on the following data points from the TMDB API `results` array:

| Field | Data Type | Description |
| :--- | :--- | :--- |
| `poster_path` | String | URL suffix for the movie poster image. |
| `title` | String | The official title of the movie. |
| `vote_average` | Number | User rating (0-10). |
| `overview` | String | Text summary of the movie plot. |

---

### 8. Future Roadmap (Out of Scope for v1.0)
* *Note based on meta-tags:* Implementation of actual "Collaborative" features mentioned in the header description (e.g., watch parties, shared lists) is not currently present in the code and is reserved for future updates.
* Pagination (currently hardcoded to Page 1).
* Detailed view page (separate from the hover card).