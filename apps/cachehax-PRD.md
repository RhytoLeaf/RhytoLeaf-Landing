# Cache Hax - Product Requirements Document

## Product Overview

**Product Name:** Cache Hax  
**Version:** 2.0  
**Last Updated:** February 3, 2026  
**Product Type:** Web-based Financial Literacy Education Tool

### Mission Statement
Cache Hax is a financial literacy exercise designed to help users manage their money wisely using a flexible budgeting framework. It empowers users to understand and customize their budget allocation across essential expenses, discretionary spending, savings, and investments.

---

## Executive Summary

Cache Hax is an interactive web application that teaches financial literacy through personalized budget planning. The tool uses an engaging quiz-based approach to understand users' financial situations and goals, then provides a customizable budget breakdown with real-time visualizations.

### Core Value Proposition
- **Educational:** Teaches budgeting fundamentals through interactive engagement
- **Personalized:** Adapts recommendations based on user profile and goals
- **Visual:** Provides clear, interactive charts for budget understanding
- **Flexible:** Allows real-time budget adjustments and experimentation

---

## User Personas

### Primary Persona: Young Professional
- Age: 22-35
- Recently entered workforce or mid-career
- Wants to build better financial habits
- Limited formal financial education
- Comfortable with digital tools

### Secondary Persona: Financial Literacy Student
- Age: 18-25
- In school or recent graduate
- Learning about personal finance
- Wants hands-on practice with budgeting concepts
- Digitally native

---

## Feature Requirements

### 1. Hero Section & Branding

**Priority:** P0 (Must Have)

**Description:**  
A visually engaging landing section that establishes brand identity and purpose.

**Requirements:**
- App logo display (140x140px, 28% border radius)
- Animated logo with hover effects (scale 1.06, glow effect)
- Hero title: "Cache Hax"
- Tagline: "Smart Money Management"
- Particle.js animated background for visual appeal
- Responsive design (clamp font sizing)
- Fixed "Back" button for navigation (top-left corner)

**Success Metrics:**
- User engagement time on landing page
- Navigation to quiz section

---

### 2. Interactive Financial Quiz

**Priority:** P0 (Must Have)

**Description:**  
A multi-question quiz that gathers user information to personalize budget recommendations.

**Quiz Flow:**
1. **Employment Status** (Question 1)
   - Working full-time
   - Working part-time
   - Self-employed/Freelance
   - Student
   - Unemployed

2. **Debt Situation** (Question 2)
   - No debt
   - Small debt (manageable)
   - Moderate debt
   - Significant debt

3. **Emergency Fund Status** (Question 3)
   - Yes, fully funded
   - Partially funded
   - Just starting
   - No emergency fund

4. **Financial Goals** (Question 4)
   - Building emergency fund
   - Paying off debt
   - Saving for major purchase
   - Investing for future
   - Multiple goals

5. **Monthly Income** (Question 5)
   - Input field for dollar amount

**Technical Requirements:**
- Step-by-step progression with "Next" buttons
- Answer validation before progression
- Smooth animations between questions
- Dynamic budget weight calculation based on responses
- Quiz completion triggers budget view display

**Budget Calculation Logic:**
The quiz results determine initial budget weights using a sophisticated scoring system:

```
Base Budget (Default):
- Fixed Costs: 50%
- Guilt-Free Spending: 35%
- Savings: 5%
- Investments: 10%

Adjustments based on:
- Employment stability
- Debt level (increases Fixed Costs, reduces other categories)
- Emergency fund status (affects Savings allocation)
- Financial goals (prioritizes relevant categories)
```

**Success Metrics:**
- Quiz completion rate
- Average time to complete
- User satisfaction with recommendations

---

### 3. Budget Input & Display

**Priority:** P0 (Must Have)

**Description:**  
Primary interface for viewing and managing budget allocations.

**Components:**

#### 3.1 Salary/Income Input
- Large, centered input field
- Label: "Monthly Income / Profit"
- Real-time currency formatting
- Triggers recalculation on change
- Persistent across sessions (potential future enhancement)

#### 3.2 Budget Categories Display
Four main categories, each with:
- **Category name and icon**
  - 🏠 Fixed Costs (Rent, utilities, insurance)
  - 🎯 Guilt-Free (Entertainment, dining out)
  - 💰 Savings (Emergency fund, goals)
  - 📈 Investments (Stocks, retirement)

- **Percentage input field** (0-100%)
- **Calculated dollar amount**
- **Color coding:**
  - Fixed Costs: #FF6384 (red/pink)
  - Guilt-Free: #36A2EB (blue)
  - Savings: #FFCE56 (yellow)
  - Investments: #4BC0C0 (teal)

**Business Rules:**
- All percentages must sum to 100%
- No negative values allowed
- No values exceed 100%

**Success Metrics:**
- User interaction rate with budget adjustments
- Time spent customizing budget

---

### 4. Dynamic Budget Rebalancing

**Priority:** P0 (Must Have)

**Description:**  
Intelligent automatic rebalancing system that maintains 100% total when users adjust individual categories.

**Algorithm:**

```javascript
When user changes category percentage:
1. Validate new value (0-100 range)
2. Calculate difference from old value
3. Identify other categories to adjust
4. Distribute difference proportionally across other categories based on their current weights
5. Handle edge cases:
   - If other categories sum to 0, distribute equally
   - If adjustment would create negative values, cap the change
6. Round all values to nearest integer
7. Adjust for rounding errors to ensure exact 100% total
8. Clamp all values to [0, 100] range
```

**User Experience:**
- Immediate visual feedback
- Smooth, proportional adjustments
- No manual calculation required
- Maintains user's intent while enforcing constraints

**Technical Requirements:**
- Real-time calculation (< 100ms)
- Floating-point precision handling
- Rounding error correction
- Edge case handling (zero weights, extreme values)

**Success Metrics:**
- Number of budget adjustments per session
- User errors/frustrations (tracked via support)

---

### 5. Interactive Doughnut Chart

**Priority:** P0 (Must Have)

**Description:**  
Real-time visual representation of budget allocation using Chart.js.

**Specifications:**
- **Type:** Doughnut chart
- **Library:** Chart.js with chartjs-plugin-datalabels
- **Update Frequency:** Real-time (on any input change)

**Visual Features:**
- Color-coded segments matching category colors
- Percentage labels on chart (e.g., "Fixed Costs (50%)")
- Hover effects (15px offset)
- Tooltips showing category name and percentage
- Smooth animations on data changes
- Responsive sizing

**Chart Configuration:**
```javascript
- Responsive: true
- Maintain aspect ratio: true
- Legend: Hidden (separate legend provided)
- Border width: 0
- Animation: Rotate and scale
- Data labels: White text, bold, 14px Montserrat font
```

**Success Metrics:**
- Chart rendering performance
- User interaction with chart (hover events)

---

### 6. Budget Summary Cards

**Priority:** P1 (Should Have)

**Description:**  
Detailed breakdown cards for each budget category with educational content.

**Card Components:**
- Category icon and name
- Percentage allocation (editable)
- Dollar amount (calculated)
- Description of category purpose
- Examples of expenses in category
- Glass morphism styling
- Hover animations

**Educational Content Examples:**

**Fixed Costs Card:**
- "Essential expenses that are difficult to reduce"
- Examples: Rent/mortgage, utilities, insurance, debt payments, groceries

**Guilt-Free Spending Card:**
- "Money for enjoyment and lifestyle"
- Examples: Entertainment, dining out, hobbies, subscriptions

**Savings Card:**
- "Building your financial safety net"
- Examples: Emergency fund, short-term goals, vacation fund

**Investments Card:**
- "Growing wealth for the future"
- Examples: 401(k), IRA, stocks, index funds, crypto

**Success Metrics:**
- User engagement with educational content
- Time spent reading descriptions

---

### 7. Legend and Visual Guides

**Priority:** P1 (Should Have)

**Description:**  
Clear visual indicators explaining the budget breakdown system.

**Components:**
- Color-coded legend matching chart colors
- Category names with icons
- Percentage indicators
- Compact, centered layout
- Responsive grid (2x2 on desktop, stacked on mobile)

**Design Specifications:**
- Glass morphism cards
- Consistent spacing (0.75rem gap)
- Icon size: Font Awesome icons at standard scale
- Typography: Montserrat font family

---

### 8. Retake Quiz Functionality

**Priority:** P1 (Should Have)

**Description:**  
Allows users to restart the quiz and receive new budget recommendations.

**Requirements:**
- Prominent "Retake Quiz" button with redo icon
- Positioned in input section
- Resets all quiz answers
- Clears current budget customizations
- Returns user to Question 1
- Maintains income input for convenience

**User Flow:**
1. User clicks "Retake Quiz"
2. System resets quiz state
3. Chart and budget cards hide
4. Quiz section reappears
5. User completes quiz again
6. New recommendations displayed

**Success Metrics:**
- Retake rate (% of users who retake)
- Comparison of first vs. second budget allocations

---

### 9. Disclaimer System

**Priority:** P2 (Nice to Have)

**Description:**  
Educational disclaimer about the nature of the tool and its limitations.

**Modal Content:**
- **Title:** "Important Disclaimer"
- **Key Points:**
  - Educational exercise, not financial advice
  - Simplified budgeting framework
  - Not a substitute for professional advice
  - User responsibility for financial decisions
  - Encouragement to seek professional guidance

**Trigger:**
- "View Disclaimer" button beneath budget input
- Subtle styling with info icon
- Glass morphism modal overlay

**Modal Behavior:**
- Click overlay to close
- Click X button to close
- Escape key to close
- Backdrop blur effect

---

### 10. Responsive Design

**Priority:** P0 (Must Have)

**Description:**  
Fully responsive layout that works across all device sizes.

**Breakpoints:**

**Mobile (< 768px):**
- Single column layout
- Stacked budget cards
- Smaller font sizes (clamp function)
- Full-width chart
- Touch-optimized inputs
- Simplified navigation

**Tablet (768px - 1024px):**
- Two-column grid where appropriate
- Medium-sized chart
- Balanced spacing

**Desktop (> 1024px):**
- Multi-column layouts
- Large, prominent chart
- Optimal spacing and typography
- Hover effects enabled

**Technical Requirements:**
- CSS clamp() for fluid typography
- Flexbox and Grid layouts
- Media queries for breakpoints
- Touch-friendly tap targets (44x44px minimum)

---

## Technical Architecture

### Frontend Stack
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - Core functionality
- **Chart.js v3+** - Data visualization
- **chartjs-plugin-datalabels** - Chart labels
- **Particles.js** - Background animation
- **Font Awesome 6.5.1** - Icons
- **Google Fonts** - Montserrat & DM Serif Display

### Design System

#### Color Palette
```css
--rhyto-green: #00CE7C (Primary/Brand)
--rhyto-green-hover: #00b56d (Hover state)
--rhyto-green-dark: #009d5e (Active state)
--fixed-costs: #FF6384 (Category color)
--guilt-free: #36A2EB (Category color)
--savings: #FFCE56 (Category color)
--investments: #4BC0C0 (Category color)
```

#### Typography
- **Primary Font:** Montserrat (400, 600, 700, 800 weights)
- **Display Font:** DM Serif Display (Headings)
- **Base Size:** Responsive clamp() functions

#### UI Patterns
- **Glass Morphism:** backdrop-filter: blur(12px) + alpha transparency
- **Card Shadows:** Multi-layer shadows with green glow on hover
- **Animations:** Cubic-bezier easing for smooth transitions
- **Inputs:** Large, centered, with focus states

### Browser Support
- **Modern Browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile Browsers:** iOS Safari 13+, Chrome Mobile
- **Fallbacks:** Graceful degradation for older browsers

---

## Data Model

### Budget Weights Object
```javascript
budgetWeights = {
  fixedCosts: Number (0-100),
  guiltFree: Number (0-100),
  savings: Number (0-100),
  investments: Number (0-100)
}
// Constraint: sum must equal 100
```

### Quiz State Object
```javascript
quizAnswers = {
  employmentStatus: String,
  debtSituation: String,
  emergencyFund: String,
  financialGoals: String,
  monthlyIncome: Number
}
```

### Category Metadata
```javascript
CATEGORY_META = [
  {
    key: 'fixedCosts',
    name: 'Fixed Costs',
    color: '#FF6384',
    icon: '🏠',
    description: String,
    examples: Array<String>
  },
  // ... other categories
]
```

---

## User Flows

### Primary User Flow: Complete Budget Setup

1. **Landing**
   - User arrives at hero section
   - Views app branding and description
   - Particle animation engages user

2. **Quiz Initiation**
   - User automatically presented with Question 1
   - Or clicks "Retake Quiz" if returning

3. **Quiz Completion**
   - User answers all 5 questions sequentially
   - Input validation at each step
   - Progress indication through question count

4. **Budget Recommendation**
   - System calculates initial budget weights
   - Quiz section fades out
   - Budget display fades in with animation
   - Chart renders with initial data

5. **Budget Customization**
   - User views recommended budget
   - Reads category descriptions
   - Adjusts percentages as desired
   - Observes real-time chart updates

6. **Income Input**
   - User enters monthly income
   - Dollar amounts calculate automatically
   - All displays update in real-time

7. **Refinement** (Optional)
   - User experiments with different allocations
   - Views updated visualizations
   - Learns about budget trade-offs

8. **Completion**
   - User satisfied with budget plan
   - Takes screenshot or notes
   - Can retake quiz for different scenarios

---

## Success Metrics & KPIs

### Engagement Metrics
- **Quiz Completion Rate:** Target > 70%
- **Average Session Duration:** Target 3-5 minutes
- **Budget Adjustment Count:** Target 3-5 per session
- **Retake Rate:** Baseline measurement

### Educational Effectiveness
- **Time on Educational Content:** Target > 30 seconds per category
- **Category Hover Interactions:** Track engagement with tooltips
- **Disclaimer Views:** Target > 30%

### Technical Performance
- **Page Load Time:** Target < 2 seconds
- **Chart Render Time:** Target < 100ms
- **Input Responsiveness:** Target < 50ms
- **Mobile Performance Score:** Target > 90 (Lighthouse)

### User Satisfaction
- **Usability:** Measured via user testing
- **Visual Appeal:** Measured via surveys
- **Educational Value:** Measured via follow-up surveys

---

## Future Enhancements

### Phase 2 Features (Potential)

1. **Budget Persistence**
   - Save budget to browser localStorage
   - User accounts for cross-device sync
   - Budget history and tracking

2. **Export Capabilities**
   - Download budget as PDF
   - Export to Excel/CSV
   - Share via link

3. **Advanced Categories**
   - Custom category creation
   - Subcategory breakdown
   - More granular tracking

4. **Expense Tracking**
   - Manual expense entry
   - Category assignment
   - Actual vs. budget comparison

5. **Educational Content Expansion**
   - Video tutorials
   - Interactive guides
   - Financial literacy resources library

6. **Gamification**
   - Achievement badges
   - Progress tracking
   - Challenges and goals

7. **Multi-Income Support**
   - Multiple income sources
   - Variable income handling
   - Irregular income smoothing

8. **Debt Payoff Calculator**
   - Snowball vs. avalanche methods
   - Payoff timeline visualization
   - Interest calculations

9. **Goal Setting Module**
   - Specific savings goals
   - Timeline tracking
   - Milestone celebrations

10. **Social Features**
    - Anonymous budget comparisons
    - Community insights
    - Peer benchmarking

---

## Design Principles

### User Experience Principles

1. **Simplicity First**
   - Minimize cognitive load
   - Clear visual hierarchy
   - One primary action per screen

2. **Immediate Feedback**
   - Real-time calculations
   - Smooth animations
   - Clear state changes

3. **Educational by Design**
   - Contextual help text
   - Examples and explanations
   - Non-judgmental language

4. **Visual Clarity**
   - High contrast for readability
   - Color-coded categories
   - Large, readable typography

5. **Accessibility**
   - Keyboard navigation support
   - Screen reader friendly
   - WCAG 2.1 AA compliance target

### Visual Design Principles

1. **Modern & Engaging**
   - Contemporary UI patterns
   - Smooth animations
   - Particle effects for interest

2. **Professional Yet Approachable**
   - Balanced color palette
   - Clean layouts
   - Friendly copy

3. **Consistent**
   - Reusable components
   - Uniform spacing
   - Predictable interactions

4. **Responsive**
   - Mobile-first approach
   - Fluid layouts
   - Touch-optimized

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

1. **Perceivable**
   - Sufficient color contrast (4.5:1 for normal text)
   - Text alternatives for icons
   - Visible focus indicators

2. **Operable**
   - Keyboard accessible
   - No keyboard traps
   - Sufficient time for interactions

3. **Understandable**
   - Clear labels and instructions
   - Error identification and suggestions
   - Consistent navigation

4. **Robust**
   - Valid HTML markup
   - Compatible with assistive technologies
   - Semantic HTML elements

### Specific Implementations
- ARIA labels for interactive elements
- Role attributes for custom components
- Alt text for decorative vs. informative images
- Focus management in quiz flow
- Form validation with clear error messages

---

## Security & Privacy

### Data Handling
- **No Server Storage:** All data remains client-side
- **No User Tracking:** No analytics beyond aggregate usage
- **No Personal Data Collection:** Income data never transmitted
- **Browser Storage:** LocalStorage only (if Phase 2 implemented)

### Disclaimer Requirements
- Clear statement about educational purpose
- No liability for financial decisions
- Recommendation to consult professionals
- Age-appropriate content notice

---

## Testing Requirements

### Functional Testing
- Quiz flow completion
- Budget calculation accuracy
- Percentage rebalancing logic
- Chart rendering correctness
- Input validation
- Edge cases (zero income, extreme percentages)

### Cross-Browser Testing
- Chrome (Windows, Mac, Android)
- Firefox (Windows, Mac)
- Safari (Mac, iOS)
- Edge (Windows)

### Device Testing
- Desktop (1920x1080, 1366x768)
- Tablet (iPad, Android tablets)
- Mobile (iPhone, Android phones)
- Orientation changes

### Performance Testing
- Load time measurement
- Chart rendering performance
- Memory leak detection
- Animation smoothness

### Accessibility Testing
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- Color contrast verification
- Touch target sizing

---

## Dependencies & Third-Party Services

### JavaScript Libraries
- **Chart.js** (v3.9+): MIT License
- **chartjs-plugin-datalabels** (v2.2+): MIT License
- **Particles.js**: MIT License

### Web Fonts
- **Google Fonts API**: Free for commercial use
  - Montserrat
  - DM Serif Display

### Icon Library
- **Font Awesome** (v6.5.1): Free tier, Font Awesome Free License

### CDN Services
- **cdnjs.cloudflare.com**: For library delivery
- **fonts.googleapis.com**: For web fonts

---

## Deployment & Hosting

### Requirements
- **Static Hosting:** Any web server or CDN
- **HTTPS:** Required for modern browser features
- **No Backend:** Pure client-side application

### Recommended Platforms
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any standard web hosting

### File Structure
```
/
├── index.html (cachehax.html)
├── /images
│   └── logo-icon.png
└── /assets (if separated)
    ├── /css
    ├── /js
    └── /fonts
```

---

## Support & Maintenance

### User Support
- **Contact Method:** Email or feedback form
- **Response Time:** 48 hours for inquiries
- **Documentation:** Inline help and disclaimer

### Maintenance Schedule
- **Bug Fixes:** As needed
- **Security Updates:** Library updates quarterly
- **Feature Updates:** Per roadmap

### Known Limitations
- Client-side only (no data persistence without Phase 2)
- Requires JavaScript enabled
- Modern browser required for optimal experience
- No offline functionality

---

## Appendix

### Glossary

**Budget Weights:** The percentage allocation for each budget category, always summing to 100%.

**Glass Morphism:** A UI design pattern using backdrop filters and transparency to create a "frosted glass" effect.

**Rebalancing:** The automatic adjustment of budget percentages to maintain a 100% total when one category changes.

**Fixed Costs:** Essential, recurring expenses that are difficult to reduce (rent, utilities, insurance).

**Guilt-Free Spending:** Discretionary income for lifestyle and enjoyment without financial guilt.

**Emergency Fund:** Savings set aside for unexpected expenses or income loss (typically 3-6 months of expenses).

### References

**Financial Literacy Resources:**
- The 50/30/20 budgeting rule (Elizabeth Warren)
- "The Total Money Makeover" by Dave Ramsey
- "Your Money or Your Life" by Vicki Robin

**Design Inspiration:**
- Apple's design language
- Modern fintech applications
- Educational gaming interfaces

### Version History

**Version 2.0** (Current)
- Dynamic budget rebalancing algorithm
- Interactive quiz with scoring system
- Real-time chart updates
- Responsive design implementation
- Accessibility improvements
- Retake quiz functionality

**Version 1.0** (Initial)
- Basic budget calculator
- Static percentage inputs
- Simple chart visualization

---

## Document Control

**Document Owner:** Product Team  
**Last Review Date:** February 3, 2026  
**Next Review Date:** May 3, 2026  
**Approval Status:** Approved  

**Change Log:**
- 2026-02-03: Complete PRD created based on v2.0 implementation
- Features documented: Quiz system, dynamic rebalancing, chart visualization, responsive design

---

**End of Document**