# TC-11 — GA4 Integration Test Cases

| Field            | Value                    |
| ---------------- | ------------------------ |
| **ID**           | TC-11                    |
| **Group**        | Analytics                |
| **Linked Story** | US-11-ga4-integration    |
| **Total Cases**  | 14                       |

---

## Happy Path

### TC-11-01: GA4 script loads on homepage

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | happy_path |
| **Description**   | Verify GA4 gtag.js script is loaded when visiting the site |
| **Precondition**  | Site is running in production mode with `NEXT_PUBLIC_GA_MEASUREMENT_ID` set |

**Steps:**
1. Open the homepage (`/`)
2. Inspect the page for a `<script>` tag with `src` containing `googletagmanager.com/gtag/js`

**Expected Result:** The GA4 script tag is present in the DOM with the correct measurement ID and `strategy="afterInteractive"`.

---

### TC-11-02: Page view fires on initial page load

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | happy_path |
| **Description**   | Verify a page view event is sent when a user first visits the site |
| **Precondition**  | GA4 is configured and site is in production mode |

**Steps:**
1. Open the homepage (`/`)
2. Monitor network requests to `google-analytics.com` or `googletagmanager.com`

**Expected Result:** A page view event (`page_view`) is sent to GA4 with the correct page path `/`.

---

### TC-11-03: Page view fires on client-side navigation

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | happy_path |
| **Description**   | Verify page view events fire when navigating between pages via client-side routing |
| **Precondition**  | GA4 is configured; user is on the homepage |

**Steps:**
1. Open the homepage (`/`)
2. Click "Công trình" in the navigation menu
3. Click "Liên hệ" in the navigation menu
4. Monitor GA4 events after each navigation

**Expected Result:** A `page_view` event is sent for each route change (`/cong-trinh`, `/lien-he`).

---

### TC-11-04: phone_click event on header phone link

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | happy_path |
| **Description**   | Verify a `phone_click` event fires when clicking the phone number in the header |
| **Precondition**  | GA4 is configured; user is on any page |

**Steps:**
1. Open the homepage
2. Click the phone number link "0985241204" in the header

**Expected Result:** A `phone_click` custom event is sent to GA4.

---

### TC-11-05: zalo_click event on floating Zalo CTA

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | happy_path |
| **Description**   | Verify a `zalo_click` event fires when clicking the floating Zalo button |
| **Precondition**  | GA4 is configured; user is on any page |

**Steps:**
1. Open the homepage
2. Click the floating "Chat Zalo" button at the bottom of the page

**Expected Result:** A `zalo_click` custom event is sent to GA4.

---

### TC-11-06: project_view event on project detail page

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | happy_path |
| **Description**   | Verify a `project_view` event fires when viewing a project detail page |
| **Precondition**  | GA4 is configured; user is on the projects listing page |

**Steps:**
1. Open the projects page (`/cong-trinh`)
2. Click on "Nhà gỗ Quốc Oai" project card

**Expected Result:** A `project_view` custom event is sent to GA4 with the project slug or name (e.g., `nha-go-quoc-oai`).

---

### TC-11-07: form_submit event on contact form

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | happy_path |
| **Description**   | Verify a `form_submit` event fires when the contact/quote form is submitted |
| **Precondition**  | GA4 is configured; user is on a page with the contact form |

**Steps:**
1. Open the contact page (`/lien-he`)
2. Fill in required fields: name, phone, house type, province
3. Click "Gửi yêu cầu tư vấn"

**Expected Result:** A `form_submit` custom event is sent to GA4 upon successful form submission.

---

### TC-11-08: form_submit event on homepage quote form

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | happy_path |
| **Description**   | Verify the `form_submit` event also fires from the homepage quote form |
| **Precondition**  | GA4 is configured; user is on the homepage |

**Steps:**
1. Open the homepage (`/`)
2. Scroll down to the "Tư Vấn Miễn Phí" section
3. Fill in required fields and submit the form

**Expected Result:** A `form_submit` custom event is sent to GA4.

---

## Edge Cases

### TC-11-09: Analytics skipped in development mode

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | edge_case |
| **Description**   | Verify GA4 scripts do not load in development environment |
| **Precondition**  | Site is running with `NODE_ENV=development` |

**Steps:**
1. Start the dev server (`npm run dev`)
2. Open the homepage
3. Inspect the page for GA4 script tags

**Expected Result:** No GA4 `<script>` tags are present. No events are sent to Google Analytics. No console errors related to GA.

---

### TC-11-10: Phone click in footer also tracks event

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | edge_case |
| **Description**   | Verify phone click tracking works for the footer phone link too |
| **Precondition**  | GA4 is configured; user is on any page |

**Steps:**
1. Open the homepage
2. Scroll to the footer
3. Click the phone number "0985241204" in the footer contact section

**Expected Result:** A `phone_click` custom event is sent to GA4.

---

### TC-11-11: Phone click on floating CTA tracks event

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | edge_case |
| **Description**   | Verify the floating phone CTA also triggers a `phone_click` event |
| **Precondition**  | GA4 is configured; user is on any page |

**Steps:**
1. Open the homepage
2. Click the floating phone button ("0985 241 204") at the bottom of the page

**Expected Result:** A `phone_click` custom event is sent to GA4.

---

### TC-11-12: Multiple page navigations track correctly

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | edge_case |
| **Description**   | Verify multiple rapid navigations each fire distinct page view events |
| **Precondition**  | GA4 is configured; user is on the homepage |

**Steps:**
1. Open the homepage
2. Click "Giới thiệu" → wait for page load
3. Click "Công trình" → wait for page load
4. Click "Liên hệ" → wait for page load
5. Click "Trang chủ" → wait for page load

**Expected Result:** Four separate `page_view` events are sent, each with the correct page path (`/gioi-thieu`, `/cong-trinh`, `/lien-he`, `/`).

---

## Error Cases

### TC-11-13: Site works without GA measurement ID

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | error_case |
| **Description**   | Verify the site functions normally when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is not set |
| **Precondition**  | `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable is not set or empty |

**Steps:**
1. Start the site without the GA measurement ID env variable
2. Navigate through all pages
3. Submit the contact form
4. Click phone and Zalo links

**Expected Result:** The site works completely normally. No GA4 scripts are loaded. No JavaScript errors in the console related to analytics. All features function without analytics.

---

### TC-11-14: GA4 script failure does not break the site

| Field             | Value |
| ----------------- | ----- |
| **test-result**   | PENDING |
| **test-result-note** | |
| **Type**          | error_case |
| **Description**   | Verify the site remains functional even if GA4 script fails to load |
| **Precondition**  | GA4 is configured but `googletagmanager.com` is blocked (e.g., by ad blocker) |

**Steps:**
1. Block network requests to `googletagmanager.com`
2. Open the homepage
3. Navigate between pages
4. Submit the contact form

**Expected Result:** The site functions completely normally despite GA4 being blocked. No visible errors to the user. No broken interactions.
