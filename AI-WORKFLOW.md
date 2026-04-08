# Claude Code Workflow — Skills

> Workflow: Ý tưởng → Release | Công cụ quản lý task: Jira

---

## Nhóm Planning

### mm:task-explorer

```yaml
name: mm:task-explorer
description: >
  Dùng khi nhận Epic/Story mới, cần đánh giá độ khả thi và cập nhật user-flow.
  Trigger: "nhận task mới", "check feasibility", "explore epic", "xem user flow".
```

- **Input:** Epic/Story lớn
- **Output:** User-flow mới hoặc cập nhật (non-code)
- **Output schema:** `name` · `short description` · `status` (BACKLOG/TODO/RELEASED) · `user-flow` · `related-flow`
- **Trigger khi:** "nhận task mới", "check feasibility", "explore epic", "xem user flow"

**Các bước thực hiện:**

1. Đọc thông tin Epic/Story từ Jira
2. Kiểm tra `docs/user-flows/` xem flow liên quan đã tồn tại chưa
3. Nếu chưa có → dùng playwright-cli explore app tại localhost để hiểu UI hiện tại
4. Đánh giá độ khả thi và impact đến các feature khác
5. Tạo mới hoặc cập nhật user-flow artifact theo schema

---

### mm:task-break

```yaml
name: mm:task-break
description: >
  Dùng khi cần chia nhỏ Epic/Story thành tasks, estimate point,
  rà soát edge case. Trigger: "break task", "estimate", "chia nhỏ story".
```

- **Input:** Epic/Story + user-flow liên quan
- **Output:** Danh sách tasks với detail, estimate point, edge cases
- **Output schema:** `name` · `type (FE/BE/other)` · `estimate` · `edge cases` · `dependencies`
- **Trigger khi:** "break task", "estimate", "chia nhỏ story", "rà soát edge case"

**Các bước thực hiện:**

1. Đọc Epic/Story và user-flow tương ứng
2. Phân tích và chia thành các task theo layer: DB → BE → FE → other (theo thứ tự dependency)
3. Với mỗi task: đặt tên, xác định type, viết detail, estimate point
4. Rà soát edge case cho từng task
5. Xác định dependencies giữa các task
6. Xuất danh sách task theo schema — **dừng bắt buộc, chờ user review và chỉnh sửa**
7. Sau khi user confirm → update các tasks lên Jira

---

### mm:task-testcase

```yaml
name: mm:task-testcase
description: >
  Dùng trước khi implement bất kỳ task nào — viết test cases và implement plan,
  chờ user review trước khi tiếp tục. Trigger: "viết test case", "implement plan".
```

- **Input:** Task cụ thể + user-flow + codebase context
- **Output:** Test cases + acceptance criteria (user review trước khi proceed)
- **Output schema:** `test cases` · `acceptance criteria`
- **Trigger khi:** "viết test case", "acceptance criteria cho task X"

**Các bước thực hiện:**

1. Đọc task detail và user-flow liên quan
2. Khảo sát codebase: xem pattern hiện tại, file liên quan, convention đang dùng
3. Viết test cases bao phủ happy path, edge case, và error case
4. Định nghĩa acceptance criteria rõ ràng
5. Dừng bắt buộc — chờ user review và approve trước khi sang bước implement
6. Cập nhật test cases và implement plan lên Jira

---

## Nhóm Implementation

### mm:db-design

```yaml
name: mm:db-design
description: >
  Dùng khi task yêu cầu thay đổi database — tạo table, thêm column, viết migration.
  Trigger: "thiết kế DB", "viết migration", "thêm table/column", "schema change".
```

- **Input:** Task + user-flow + schema hiện tại
- **Output:** schema changes
- **Checklist:** backward compatibility · index strategy
- **Trigger khi:** "thiết kế DB", "viết migration", "thêm table/column", "schema change"

**Các bước thực hiện:**

1. Đọc schema hiện tại và hiểu data model đang có
2. Thiết kế thay đổi: table mới / column mới / index / relation
3. Kiểm tra backward compatibility với data và code hiện tại
4. Đề xuất index strategy phù hợp với query pattern dự kiến
5. Dừng — chờ user review

---

### mm:task-apply-be

```yaml
name: mm:task-apply-be
description: >
  Dùng để implement task Backend (NestJS) theo TDD — viết test trước, implement sau.
  Trigger: "làm task BE", "implement API", "viết service/controller", "self test BE".
```

- **Input:** Task BE + test cases + implement plan
- **Output:** BE code đã implement + passed unit tests
- **Method:** TDD — viết test trước, implement sau. Tham khảo superpowers TDD skill.
- **Trigger khi:** "làm task BE", "implement API", "viết service/controller", "self test BE"

**Các bước thực hiện:**

1. Đọc task detail, test cases, và implement plan đã được approve
2. Sử dụng /test-driven-development skill để implement task
3. Tạo `api-contract.md` vào `docs/api-contracts/` để lưu lại
4. Nhắc nhở: chạy `mm:document` sau khi PR merge để sync artifacts

---

### mm:task-apply-fe

```yaml
name: mm:task-apply-fe
description: >
  Dùng để implement task Frontend (React/Next.js) theo TDD, có playwright-cli
  explore UI trước. Trigger: "làm task FE", "implement component", "viết UI".
```

- **Input:** Task FE + test cases + implement plan + API contract từ BE
- **Output:** FE code đã implement + passed component tests
- **Method:** TDD + playwright-cli explore UI hiện tại trước khi viết code
- **Trigger khi:** "làm task FE", "implement component/page", "viết UI", "self test FE"

**Các bước thực hiện:**

1. Đọc task detail, test cases, implement plan, và API contract từ BE
2. Dùng playwright-cli explore UI hiện tại tại localhost để hiểu context trước khi viết code
3. Sử dụng /test-driven-development skill để implement task
4. Nhắc nhở: chạy `mm:self-test` để verify flow trên UI trước khi tạo PR
5. Nhắc nhở: chạy `mm:document` sau khi PR merge để sync artifacts

---

### mm:self-test

```yaml
name: mm:self-test
description: >
  Dùng sau khi hoàn thành implementation hoặc fix, để kiểm tra lại Feature như người dùng cuối.
  Trigger: "self-test", "test lại feature".
```

- **Input:** Feature đã được implement + test cases đã approve
- **Output:** Kết quả test theo từng case + danh sách lỗi nếu có + regression check
- **Output schema:** `status (PASS/FAIL)` · `cases passed` · `cases failed` · `regression risk` · `notes`
- **Trigger khi:** "self-test", "test lại feature", "verify trước khi tạo PR"

**Các bước thực hiện:**

1. Đọc test cases đã được approve từ `mm:task-testcase`
2. Dùng playwright-cli test trên frontend local, đi theo từng test case
3. Thực hiện test: happy path trước, sau đó edge case, sau đó error case
4. Ghi nhận kết quả từng case: PASS / FAIL + mô tả ngắn nếu FAIL
5. Kiểm tra regression: thử các flow liên quan đã hoạt động trước đó
6. Nếu có case FAIL → phân tích root cause, fix, sau đó chạy lại test case đó
7. Xuất kết quả tổng hợp theo output schema trước khi kết thúc

---

## Nhóm Bug & Release

### mm:fix-bug

```yaml
name: mm:fix-bug
description: >
  Dùng khi có bug report cần điều tra và fix. Quy trình: reproduce → root cause →
  plan → user review → code. Trigger: "fix bug", "bug report", "lỗi ở X".
```

- **Input:** Mô tả ngắn gọn về bug hiện tại
- **Output:** Fix plan (user review) → code đã chỉnh sửa
- **Method:** Điều tra code → reproduce bug → root cause → plan → user review → update code. Có thể dùng `mm:task-explorer` hoặc playwright-cli khi cần.
- **Trigger khi:** "fix bug", "bug report", "lỗi ở X", "sửa chỗ Y"

**Các bước thực hiện:**

1. Đọc bug report, hiểu expected vs actual behavior
2. Reproduce bug — xác nhận bug tồn tại trước khi điều tra
3. Điều tra code: trace từ symptom đến root cause (dùng playwright-cli hoặc mm:task-explorer nếu cần)
4. Xác định root cause — không chỉ fix symptom
5. Lập fix plan: file cần sửa, approach, risk nếu có
6. Dừng — chờ user review fix plan
7. Implement fix theo plan đã được approve
8. Viết hoặc cập nhật test case để cover bug này
9. Self-test: xác nhận bug đã fix và không có regression
10. Nhắc nhở: chạy `mm:document` sau khi PR merge để sync artifacts

---

## Nhóm Documentation

### mm:document

```yaml
name: mm:document
description: >
  Dùng sau khi hoàn thành implementation hoặc fix, để sync artifacts với code đã
  thay đổi. Input là git diff. Trigger: "cập nhật document", "sync artifacts".
```

- **Input:** Git diff + commit messages + danh sách files thay đổi
- **Output:** Toàn bộ artifacts được update: user-flow, test cases, unit test, E2E test
- **Checklist:** Kiểm tra index file user-flow sau khi update
- **Trigger khi:** "cập nhật document", "update docs", "sync artifacts sau PR", "viết lại user-flow"

**Các bước thực hiện:**

1. Đọc git diff và commit messages để xác định phạm vi thay đổi
2. Xác định artifacts nào bị ảnh hưởng: user-flow, test cases, unit test, E2E test
3. Cập nhật user-flow nếu có thay đổi về flow hoặc UI behavior
4. Cập nhật test cases nếu có thay đổi về logic hoặc acceptance criteria
5. Cập nhật unit test docs nếu có test mới hoặc thay đổi
6. Cập nhật E2E test nếu có thay đổi về user journey
7. Kiểm tra index file `docs/user-flows/` — đảm bảo mục lục không bị lỗi thời
8. Kiểm tra index file `docs/api-contracts/` — đảm bảo mục lục không bị lỗi thời

---

## Artifacts

- **user-flows:** `docs/user-flows/[group]/UF-[name].md` — có file index để làm mục lục
- **api-contracts:** `docs/api-contracts/[group]/contract-[name].md` — có file index để làm mục lục
- **e2e-test:** ngoài root folder
- **unit-test:** cấu trúc theo NestJS folder structure
