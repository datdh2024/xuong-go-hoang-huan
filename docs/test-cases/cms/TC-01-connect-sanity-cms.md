# TC-01 — Connect Sanity CMS to All Pages

**Linked Story:** [US-01 — Connect Sanity CMS](../../user-stories/cms/US-01-connect-sanity-cms.md)

---

## Happy Path Cases

### TC-01-01: Homepage displays CMS content
- **Type:** happy_path
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** Homepage sections render content from Sanity CMS
- **Precondition:** Sanity has sample data for hero slides, highlights, projects, house templates, FAQs
- **Steps:**
  1. Navigate to homepage (`/`)
  2. Observe the hero slider area
  3. Scroll down through highlights, projects grid, house templates, FAQ, and quote form sections
- **Expected Result:** All sections display content matching Sanity data — hero slides show CMS images/text, project cards show CMS titles/descriptions/locations/years, house templates show CMS specs, FAQ shows CMS questions/answers

### TC-01-02: About page displays CMS content
- **Type:** happy_path
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** About page renders all sections from CMS
- **Precondition:** Sanity has sample data for about page (stats, story, team)
- **Steps:**
  1. Navigate to `/gioi-thieu`
  2. Observe stats bar (years, projects, provinces, workshop area)
  3. Read the story section
  4. View the team section
- **Expected Result:** Stats numbers, story text, and team descriptions match Sanity CMS data

### TC-01-03: Projects listing page displays CMS projects
- **Type:** happy_path
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** Projects page shows all projects from CMS with working category filter
- **Precondition:** Sanity has multiple project documents across different categories
- **Steps:**
  1. Navigate to `/cong-trinh`
  2. See the grid of project cards
  3. Click a category filter button (e.g., "Nhà gỗ 3 gian")
  4. Observe the filtered results
  5. Click "Tất cả" to show all again
- **Expected Result:** All projects from CMS appear in the grid. Category filter correctly shows only matching projects. Each card shows title, description, location, year, and image from CMS.

### TC-01-04: Project detail page displays CMS data
- **Type:** happy_path
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** Individual project page shows full details from CMS
- **Precondition:** Sanity has at least one project with slug, images, and description
- **Steps:**
  1. Navigate to `/cong-trinh`
  2. Click on a project card
  3. Observe the detail page: hero image, title, metadata, description, image gallery
- **Expected Result:** Project detail shows title, category, location, year, description text, and image gallery — all from CMS data. "Tất cả công trình" link navigates back to listing.

### TC-01-05: Contact page displays CMS contact info
- **Type:** happy_path
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** Contact page shows phone, email, address, hours from CMS
- **Precondition:** Sanity has site settings with contact information
- **Steps:**
  1. Navigate to `/lien-he`
  2. Observe phone number, email, address, working hours
  3. Observe social media links
- **Expected Result:** All contact information matches what is configured in Sanity CMS

### TC-01-06: Header and footer display CMS data
- **Type:** happy_path
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** Shared layout components (header, footer) show CMS-managed content
- **Precondition:** Sanity has site settings with company name, phone, contact info, social links
- **Steps:**
  1. Navigate to any page
  2. Observe the header: logo/brand name, phone number
  3. Scroll to footer: company name, contact info, social links, navigation
- **Expected Result:** Header phone number, footer contact info, and social links all come from CMS and are consistent across all pages

### TC-01-07: Content updated in Sanity Studio reflects on website
- **Type:** happy_path
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** Editing content in Sanity Studio is visible on the website after refresh
- **Precondition:** Sanity Studio is accessible at `/studio`, sample data exists
- **Steps:**
  1. Open Sanity Studio at `/studio`
  2. Edit a piece of content (e.g., change an FAQ question text)
  3. Publish the change
  4. Navigate to the relevant page on the website
  5. Observe the updated content
- **Expected Result:** The edited content appears on the website (may require page refresh depending on caching)

---

## Edge Cases

### TC-01-08: Page renders gracefully with missing optional fields
- **Type:** edge_case
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** Pages don't break when optional CMS fields are empty
- **Precondition:** Some Sanity documents have optional fields left blank (e.g., project without description, template without notes)
- **Steps:**
  1. Navigate to a page where a CMS document has some optional fields empty
  2. Observe the page layout
- **Expected Result:** Page renders without errors. Empty optional fields are either hidden or show graceful placeholder — no broken layout, no "undefined" text

### TC-01-09: Projects page with single category
- **Type:** edge_case
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** Category filter works when all projects are in one category
- **Precondition:** All projects in Sanity belong to the same category
- **Steps:**
  1. Navigate to `/cong-trinh`
  2. Click different category filter buttons
- **Expected Result:** "Tất cả" shows all projects. The matching category shows all projects. Other categories show no results (empty state or message)

### TC-01-10: Project detail for non-existent slug
- **Type:** edge_case
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** Visiting a project URL with a slug that doesn't exist in CMS
- **Precondition:** No project with slug "non-existent-project" in Sanity
- **Steps:**
  1. Navigate to `/cong-trinh/non-existent-project`
- **Expected Result:** User sees a 404 page or is redirected, not a blank/broken page

### TC-01-11: Hero slider with single slide
- **Type:** edge_case
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** Homepage hero slider works with only one slide in CMS
- **Precondition:** Only one hero slide document exists in Sanity
- **Steps:**
  1. Navigate to homepage
  2. Observe the hero slider area
  3. Try clicking prev/next buttons or dots
- **Expected Result:** Single slide displays correctly. Navigation buttons are either hidden or cycling doesn't break the display.

### TC-01-12: FAQ section with no items
- **Type:** edge_case
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** FAQ section handles zero FAQ items gracefully
- **Precondition:** No FAQ documents exist in Sanity
- **Steps:**
  1. Navigate to homepage
  2. Scroll to FAQ section
- **Expected Result:** FAQ section is either hidden or shows an empty state — no broken accordion, no errors

---

## Error Cases

### TC-01-13: Website behavior when Sanity API is unreachable
- **Type:** error_case
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** Pages handle Sanity API connection failure gracefully
- **Precondition:** Sanity API is temporarily unavailable (e.g., invalid project ID or network issue)
- **Steps:**
  1. Navigate to any page while Sanity cannot be reached
- **Expected Result:** Page shows an error state or fallback content — does not crash with an unhandled exception. User sees something meaningful, not a white screen.

### TC-01-14: Website with empty Sanity dataset
- **Type:** error_case
- **Test Result:** PENDING
- **Test Result Note:** —
- **Description:** All pages handle a completely empty CMS dataset
- **Precondition:** Sanity dataset has no documents at all
- **Steps:**
  1. Navigate to homepage
  2. Navigate to about page
  3. Navigate to projects listing
  4. Navigate to contact page
- **Expected Result:** Each page renders without errors. Sections that have no data are hidden or show meaningful empty states. No "Cannot read property of undefined" errors.
