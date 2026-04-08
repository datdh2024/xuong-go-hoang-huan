# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: faq-section.spec.ts >> SR-906: FAQ Section with Sanity CMS >> opening one FAQ closes the previously opened one
- Location: tests\e2e\faq-section.spec.ts:69:7

# Error details

```
Error: expect(locator).toBeHidden() failed

Locator:  locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' }).getByRole('region').first()
Expected: hidden
Received: visible
Timeout:  5000ms

Call log:
  - Expect "toBeHidden" with timeout 5000ms
  - waiting for locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' }).getByRole('region').first()
    9 × locator resolved to <div role="region" id="faq-answer-faq-2" aria-labelledby="faq-btn-faq-2" class="px-5 py-4 text-gray-600 dark:text-wood-200 text-sm leading-relaxed bg-white dark:bg-wood-800 border-t border-wood-100 dark:border-wood-600">Có. Tất cả gỗ đều được xử lý chống mối mọt bằng p…</div>
      - unexpected value "visible"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Xưởng Gỗ Hoàng Huân Giữ hồn kiến trúc Việt" [ref=e4] [cursor=pointer]:
        - /url: /
        - generic [ref=e5]: Xưởng Gỗ Hoàng Huân
        - generic [ref=e6]: Giữ hồn kiến trúc Việt
      - navigation [ref=e7]:
        - link "Trang chủ" [ref=e8] [cursor=pointer]:
          - /url: /
        - link "Giới thiệu" [ref=e9] [cursor=pointer]:
          - /url: /gioi-thieu
        - link "Công trình" [ref=e10] [cursor=pointer]:
          - /url: /cong-trinh
        - link "Liên hệ" [ref=e11] [cursor=pointer]:
          - /url: /lien-he
      - generic [ref=e12]:
        - button "Switch to dark mode" [ref=e13]:
          - img [ref=e14]
        - link "0985241204" [ref=e16] [cursor=pointer]:
          - /url: tel:0985241204
          - img [ref=e17]
          - text: "0985241204"
  - main [ref=e19]:
    - generic [ref=e20]:
      - img "Giữ Hồn Kiến Trúc Việt" [ref=e22]
      - img "Tâm Huyết Với Từng Đường Chạm" [ref=e25]
      - img "Giữ Hồn Kiến Trúc Việt" [ref=e28]
      - img "Xưởng Sản Xuất 1.000m²" [ref=e31]
      - generic [ref=e36]:
        - heading "Tâm Huyết Với Từng Đường Chạm" [level=1] [ref=e37]
        - paragraph [ref=e38]: Đội ngũ nghệ nhân lành nghề với hơn 40 năm kinh nghiệm chạm khắc gỗ truyền thống
        - link "Tư vấn miễn phí" [ref=e39] [cursor=pointer]:
          - /url: /lien-he
      - button "Slide trước" [ref=e40]:
        - img [ref=e41]
      - button "Slide tiếp theo" [ref=e43]:
        - img [ref=e44]
      - generic [ref=e46]:
        - button "Chuyển đến slide 1" [ref=e47]
        - button "Chuyển đến slide 2" [ref=e49]
        - button "Chuyển đến slide 3" [ref=e51]
        - button "Chuyển đến slide 4" [ref=e53]
    - generic [ref=e56]:
      - generic [ref=e57]:
        - generic [ref=e60]: Tại sao chọn chúng tôi
        - heading "Cam Kết Chất Lượng" [level=2] [ref=e62]
        - paragraph [ref=e63]: Mỗi công trình là một tác phẩm nghệ thuật, được thực hiện bởi đội ngũ nghệ nhân tâm huyết với hơn 40 năm kinh nghiệm
      - generic [ref=e64]:
        - generic [ref=e65]:
          - img [ref=e67]
          - heading "40 Năm Kinh Nghiệm" [level=3] [ref=e70]
          - paragraph [ref=e71]: Đội ngũ thợ lành nghề truyền thống, tích lũy hơn 4 thập kỷ kinh nghiệm chạm khắc gỗ
        - generic [ref=e72]:
          - img [ref=e74]
          - heading "Xưởng 1.000m²" [level=3] [ref=e77]
          - paragraph [ref=e78]: Hệ thống xưởng hiện đại, quy mô lớn, đảm bảo tiến độ và chất lượng từng công trình
        - generic [ref=e79]:
          - img [ref=e81]
          - heading "Gỗ Chọn Lọc" [level=3] [ref=e83]
          - paragraph [ref=e84]: Chỉ sử dụng gỗ quý chất lượng cao, được kiểm định kỹ lưỡng trước khi thi công
        - generic [ref=e85]:
          - img [ref=e87]
          - heading "Tư Vấn Miễn Phí" [level=3] [ref=e92]
          - paragraph [ref=e93]: Đội ngũ kiến trúc sư và nghệ nhân tư vấn thiết kế hoàn toàn miễn phí cho khách hàng
        - generic [ref=e94]:
          - img [ref=e96]
          - heading "Bảo Hành Dài Hạn" [level=3] [ref=e98]
          - paragraph [ref=e99]: Cam kết bảo hành công trình dài hạn, đồng hành cùng khách hàng sau khi bàn giao
        - generic [ref=e100]:
          - img [ref=e102]
          - heading "Toàn Quốc" [level=3] [ref=e105]
          - paragraph [ref=e106]: Đã thi công hàng trăm công trình trên khắp cả nước, từ Bắc vào Nam
    - generic [ref=e108]:
      - generic [ref=e109]:
        - generic [ref=e112]: Công trình tiêu biểu
        - heading "Dự Án Đã Thực Hiện" [level=2] [ref=e114]
        - paragraph [ref=e115]: Hàng trăm công trình nhà gỗ cổ truyền trên khắp cả nước, mỗi công trình là một câu chuyện về tâm huyết và nghề
      - generic [ref=e116]:
        - link "Nhà Thờ Họ Nhà thờ họ Nhà Thờ Họ Nhà thờ họ 5 gian uy nghiêm, gỗ lim Lào chọn lọc, chạm khắc thủ công 100% Nghệ An 2022" [ref=e117] [cursor=pointer]:
          - /url: /cong-trinh/nha-tho-ho-nghe-an
          - generic [ref=e118]:
            - img "Nhà Thờ Họ" [ref=e119]
            - generic [ref=e121]: Nhà thờ họ
          - generic [ref=e122]:
            - heading "Nhà Thờ Họ" [level=3] [ref=e123]
            - paragraph [ref=e124]: Nhà thờ họ 5 gian uy nghiêm, gỗ lim Lào chọn lọc, chạm khắc thủ công 100%
            - generic [ref=e125]:
              - generic [ref=e126]:
                - img [ref=e127]
                - text: Nghệ An
              - generic [ref=e130]:
                - img [ref=e131]
                - text: "2022"
        - link "Nhà Gỗ 3 Gian Nhà gỗ 3 gian Nhà Gỗ 3 Gian Công trình nhà gỗ 3 gian với hệ mái tứ hải, bền đẹp theo thời gian Thái Bình 2022" [ref=e133] [cursor=pointer]:
          - /url: /cong-trinh/nha-go-3-gian-thai-binh
          - generic [ref=e134]:
            - img "Nhà Gỗ 3 Gian" [ref=e135]
            - generic [ref=e137]: Nhà gỗ 3 gian
          - generic [ref=e138]:
            - heading "Nhà Gỗ 3 Gian" [level=3] [ref=e139]
            - paragraph [ref=e140]: Công trình nhà gỗ 3 gian với hệ mái tứ hải, bền đẹp theo thời gian
            - generic [ref=e141]:
              - generic [ref=e142]:
                - img [ref=e143]
                - text: Thái Bình
              - generic [ref=e146]:
                - img [ref=e147]
                - text: "2022"
        - link "Nhà Gỗ Sân Vườn Nhà gỗ sân vườn Nhà Gỗ Sân Vườn Nhà gỗ sân vườn kết hợp kiến trúc truyền thống và không gian hiện đại Hải Phòng 2023" [ref=e149] [cursor=pointer]:
          - /url: /cong-trinh/nha-go-san-vuon-hai-phong
          - generic [ref=e150]:
            - img "Nhà Gỗ Sân Vườn" [ref=e151]
            - generic [ref=e153]: Nhà gỗ sân vườn
          - generic [ref=e154]:
            - heading "Nhà Gỗ Sân Vườn" [level=3] [ref=e155]
            - paragraph [ref=e156]: Nhà gỗ sân vườn kết hợp kiến trúc truyền thống và không gian hiện đại
            - generic [ref=e157]:
              - generic [ref=e158]:
                - img [ref=e159]
                - text: Hải Phòng
              - generic [ref=e162]:
                - img [ref=e163]
                - text: "2023"
        - link "Nhà Thờ Họ Nhà thờ họ Nhà Thờ Họ Nhà thờ họ trang nghiêm với kiến trúc cổ điển, đồ thờ chạm khắc tinh xảo Bắc Ninh 2022" [ref=e165] [cursor=pointer]:
          - /url: /cong-trinh/nha-tho-ho-bac-ninh
          - generic [ref=e166]:
            - img "Nhà Thờ Họ" [ref=e167]
            - generic [ref=e169]: Nhà thờ họ
          - generic [ref=e170]:
            - heading "Nhà Thờ Họ" [level=3] [ref=e171]
            - paragraph [ref=e172]: Nhà thờ họ trang nghiêm với kiến trúc cổ điển, đồ thờ chạm khắc tinh xảo
            - generic [ref=e173]:
              - generic [ref=e174]:
                - img [ref=e175]
                - text: Bắc Ninh
              - generic [ref=e178]:
                - img [ref=e179]
                - text: "2022"
        - link "Nhà Gỗ 5 Gian Nhà gỗ 5 gian Nhà Gỗ 5 Gian Nhà gỗ 5 gian với hệ thống cột kèo tinh xảo, chạm khắc hoa văn truyền thống Hưng Yên 2023" [ref=e181] [cursor=pointer]:
          - /url: /cong-trinh/nha-go-5-gian-hung-yen
          - generic [ref=e182]:
            - img "Nhà Gỗ 5 Gian" [ref=e183]
            - generic [ref=e185]: Nhà gỗ 5 gian
          - generic [ref=e186]:
            - heading "Nhà Gỗ 5 Gian" [level=3] [ref=e187]
            - paragraph [ref=e188]: Nhà gỗ 5 gian với hệ thống cột kèo tinh xảo, chạm khắc hoa văn truyền thống
            - generic [ref=e189]:
              - generic [ref=e190]:
                - img [ref=e191]
                - text: Hưng Yên
              - generic [ref=e194]:
                - img [ref=e195]
                - text: "2023"
        - link "Nhà Gỗ 3 Gian Nhà gỗ 3 gian Nhà Gỗ 3 Gian Nhà gỗ 3 gian truyền thống theo lối kiến trúc Bắc Bộ, sử dụng gỗ lim chất lượng cao Hà Nội 2023" [ref=e197] [cursor=pointer]:
          - /url: /cong-trinh/nha-go-3-gian-ha-noi
          - generic [ref=e198]:
            - img "Nhà Gỗ 3 Gian" [ref=e199]
            - generic [ref=e201]: Nhà gỗ 3 gian
          - generic [ref=e202]:
            - heading "Nhà Gỗ 3 Gian" [level=3] [ref=e203]
            - paragraph [ref=e204]: Nhà gỗ 3 gian truyền thống theo lối kiến trúc Bắc Bộ, sử dụng gỗ lim chất lượng cao
            - generic [ref=e205]:
              - generic [ref=e206]:
                - img [ref=e207]
                - text: Hà Nội
              - generic [ref=e210]:
                - img [ref=e211]
                - text: "2023"
      - link "Xem tất cả công trình" [ref=e214] [cursor=pointer]:
        - /url: /cong-trinh
        - text: Xem tất cả công trình
        - img [ref=e215]
    - generic [ref=e218]:
      - generic [ref=e219]:
        - generic [ref=e222]: Mẫu nhà gỗ
        - heading "Catalogue Thiết Kế" [level=2] [ref=e224]
        - paragraph [ref=e225]: Tham khảo các mẫu nhà gỗ cổ truyền phổ biến. Chúng tôi tư vấn và thiết kế theo yêu cầu riêng của từng gia đình
      - generic [ref=e226]:
        - generic [ref=e227]:
          - img "Nhà Gỗ Sân Vườn Hiện Đại" [ref=e229]
          - generic [ref=e230]:
            - heading "Nhà Gỗ Sân Vườn Hiện Đại" [level=3] [ref=e231]
            - generic [ref=e232]:
              - generic [ref=e233]:
                - img [ref=e234]
                - text: 40-60m²
              - generic [ref=e239]:
                - img [ref=e240]
                - text: 3 gian
              - generic [ref=e242]:
                - img [ref=e243]
                - text: 12 cột
            - paragraph [ref=e245]: Kết hợp kiến trúc gỗ truyền thống với không gian sống hiện đại
        - generic [ref=e246]:
          - img "Nhà Thờ Họ 3 Gian" [ref=e248]
          - generic [ref=e249]:
            - heading "Nhà Thờ Họ 3 Gian" [level=3] [ref=e250]
            - generic [ref=e251]:
              - generic [ref=e252]:
                - img [ref=e253]
                - text: 50-70m²
              - generic [ref=e258]:
                - img [ref=e259]
                - text: 3 gian
              - generic [ref=e261]:
                - img [ref=e262]
                - text: 16 cột
            - paragraph [ref=e264]: Mẫu nhà thờ họ trang nghiêm, tôn kính, phù hợp thờ cúng tổ tiên
        - generic [ref=e265]:
          - img "Nhà Gỗ 5 Gian Thông Gian" [ref=e267]
          - generic [ref=e268]:
            - heading "Nhà Gỗ 5 Gian Thông Gian" [level=3] [ref=e269]
            - generic [ref=e270]:
              - generic [ref=e271]:
                - img [ref=e272]
                - text: 120-150m²
              - generic [ref=e277]:
                - img [ref=e278]
                - text: 5 gian
              - generic [ref=e280]:
                - img [ref=e281]
                - text: 32 cột
            - paragraph [ref=e283]: Mẫu nhà 5 gian thông thoáng, không gian rộng rãi cho gia đình lớn
        - generic [ref=e284]:
          - img "Nhà Gỗ 3 Gian 4 Mái" [ref=e286]
          - generic [ref=e287]:
            - heading "Nhà Gỗ 3 Gian 4 Mái" [level=3] [ref=e288]
            - generic [ref=e289]:
              - generic [ref=e290]:
                - img [ref=e291]
                - text: 60-80m²
              - generic [ref=e296]:
                - img [ref=e297]
                - text: 3 gian
              - generic [ref=e299]:
                - img [ref=e300]
                - text: 16 cột
            - paragraph [ref=e302]: Mẫu nhà gỗ 3 gian kinh điển với 4 mái, phù hợp không gian sân vườn
    - generic [ref=e304]:
      - generic [ref=e305]:
        - generic [ref=e308]: Giải đáp thắc mắc
        - heading "Câu Hỏi Thường Gặp" [level=2] [ref=e310]
        - paragraph [ref=e311]: Những câu hỏi phổ biến về quy trình, chi phí và chất lượng công trình nhà gỗ cổ truyền
      - generic [ref=e312]:
        - button "Nên chọn loại gỗ nào để làm nhà cổ truyền bền nhất?" [ref=e314]:
          - generic [ref=e315]: Nên chọn loại gỗ nào để làm nhà cổ truyền bền nhất?
          - img [ref=e316]
        - generic [ref=e318]:
          - button "Xưởng có xử lý chống mối mọt trước khi thi công không?" [expanded] [active] [ref=e319]:
            - generic [ref=e320]: Xưởng có xử lý chống mối mọt trước khi thi công không?
            - img [ref=e321]
          - region [ref=e323]: Có. Tất cả gỗ đều được xử lý chống mối mọt bằng phương pháp ngâm tẩm chuyên dụng trước khi đưa vào thi công. Ngoài ra, sau khi hoàn thiện công trình, chúng tôi còn phun thuốc chống mối cho toàn bộ kết cấu để đảm bảo độ bền lâu dài.
        - button "Nhà gỗ cổ truyền có sử dụng đinh sắt không?" [ref=e325]:
          - generic [ref=e326]: Nhà gỗ cổ truyền có sử dụng đinh sắt không?
          - img [ref=e327]
        - button "Chi phí làm một ngôi nhà gỗ được tính như thế nào?" [ref=e330]:
          - generic [ref=e331]: Chi phí làm một ngôi nhà gỗ được tính như thế nào?
          - img [ref=e332]
        - button "Thời gian thi công một ngôi nhà gỗ thường mất bao lâu?" [ref=e335]:
          - generic [ref=e336]: Thời gian thi công một ngôi nhà gỗ thường mất bao lâu?
          - img [ref=e337]
        - button "Chính sách bảo hành của xưởng như thế nào?" [ref=e340]:
          - generic [ref=e341]: Chính sách bảo hành của xưởng như thế nào?
          - img [ref=e342]
    - generic [ref=e346]:
      - generic [ref=e347]:
        - generic [ref=e350]: Nhận báo giá
        - heading "Tư Vấn Miễn Phí" [level=2] [ref=e352]
        - paragraph [ref=e353]: Để lại thông tin, chúng tôi sẽ liên hệ tư vấn và báo giá trong vòng 24 giờ
      - generic [ref=e354]:
        - generic [ref=e355]:
          - generic [ref=e356]:
            - generic [ref=e357]: Họ và tên *
            - textbox "Nguyễn Văn A" [ref=e358]
          - generic [ref=e359]:
            - generic [ref=e360]: Số điện thoại *
            - textbox "0985 241 204" [ref=e361]
        - generic [ref=e362]:
          - generic [ref=e363]:
            - generic [ref=e364]: Loại nhà muốn làm *
            - combobox [ref=e365]:
              - option "-- Chọn loại nhà --" [selected]
              - option "Nhà Gỗ Sân Vườn Hiện Đại"
              - option "Nhà Thờ Họ 3 Gian"
              - option "Nhà Gỗ 5 Gian Thông Gian"
              - option "Nhà Gỗ 3 Gian 4 Mái"
          - generic [ref=e366]:
            - generic [ref=e367]: Tỉnh / Thành phố *
            - combobox [ref=e368]:
              - option "-- Chọn tỉnh/thành --" [selected]
              - option "Hà Nội"
              - option "TP. Hồ Chí Minh"
              - option "Hải Phòng"
              - option "Đà Nẵng"
              - option "Hưng Yên"
              - option "Thái Bình"
              - option "Bắc Ninh"
              - option "Bắc Giang"
              - option "Nghệ An"
              - option "Thanh Hóa"
              - option "Hà Nam"
              - option "Nam Định"
              - option "Hải Dương"
              - option "Quảng Ninh"
              - option "Vĩnh Phúc"
              - option "Phú Thọ"
              - option "Tỉnh / Thành phố khác"
        - generic [ref=e369]:
          - generic [ref=e370]: Diện tích dự kiến
          - 'textbox "VD: 80m², 5 gian, 32 cột..." [ref=e371]'
        - generic [ref=e372]:
          - generic [ref=e373]: Ghi chú thêm
          - textbox "Yêu cầu đặc biệt, thời gian thi công mong muốn..." [ref=e374]
        - button "Gửi yêu cầu tư vấn" [ref=e375]:
          - img [ref=e376]
          - text: Gửi yêu cầu tư vấn
  - contentinfo [ref=e379]:
    - generic [ref=e381]:
      - generic [ref=e382]:
        - heading "Xưởng Gỗ Hoàng Huân" [level=3] [ref=e383]
        - paragraph [ref=e384]: Nhà gỗ cổ truyền - Tâm huyết từng đường chạm
        - generic [ref=e385]:
          - link "Facebook Xưởng Gỗ Hoàng Huân" [ref=e386] [cursor=pointer]:
            - /url: https://www.facebook.com/profile.php?id=61579605190676
            - img [ref=e387]
          - link "TikTok Xưởng Gỗ Hoàng Huân" [ref=e389] [cursor=pointer]:
            - /url: https://www.tiktok.com/@hoang.minhquang
            - img [ref=e390]
      - generic [ref=e392]:
        - heading "Liên hệ" [level=4] [ref=e393]
        - list [ref=e394]:
          - listitem [ref=e395]:
            - img [ref=e396]
            - generic [ref=e399]: Thôn Yên Quán, xã Hưng Đạo, Hà Nội
          - listitem [ref=e400]:
            - img [ref=e401]
            - link "0985241204" [ref=e403] [cursor=pointer]:
              - /url: tel:0985241204
          - listitem [ref=e404]:
            - img [ref=e405]
            - link "datdh2024@gmail.com" [ref=e408] [cursor=pointer]:
              - /url: mailto:datdh2024@gmail.com
          - listitem [ref=e409]:
            - img [ref=e410]
            - generic [ref=e413]: 7:00 - 18:00 (Thứ 2 - Chủ nhật)
      - generic [ref=e414]:
        - heading "Điều hướng" [level=4] [ref=e415]
        - list [ref=e416]:
          - listitem [ref=e417]:
            - link "Trang chủ" [ref=e418] [cursor=pointer]:
              - /url: /
          - listitem [ref=e419]:
            - link "Giới thiệu" [ref=e420] [cursor=pointer]:
              - /url: /gioi-thieu
          - listitem [ref=e421]:
            - link "Công trình" [ref=e422] [cursor=pointer]:
              - /url: /cong-trinh
          - listitem [ref=e423]:
            - link "Liên hệ & Báo giá" [ref=e424] [cursor=pointer]:
              - /url: /lien-he
    - generic [ref=e425]: © 2026 Xưởng Gỗ Hoàng Huân. All rights reserved.
  - generic [ref=e426]:
    - link "Liên hệ qua Zalo" [ref=e427] [cursor=pointer]:
      - /url: https://zalo.me/0985241204
      - img "Zalo" [ref=e428]
      - generic [ref=e429]: Chat Zalo
    - link "Gọi điện thoại" [ref=e430] [cursor=pointer]:
      - /url: tel:0985241204
      - img [ref=e431]
      - generic [ref=e433]: 0985 241 204
  - button "Open Next.js Dev Tools" [ref=e439] [cursor=pointer]:
    - img [ref=e440]
  - alert [ref=e443]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('SR-906: FAQ Section with Sanity CMS', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/')
  6  |   })
  7  | 
  8  |   test('FAQ section is present on the homepage', async ({ page }) => {
  9  |     const section = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
  10 |     await expect(section).toBeVisible()
  11 |   })
  12 | 
  13 |   test('displays section heading "Câu Hỏi Thường Gặp"', async ({ page }) => {
  14 |     await expect(page.getByRole('heading', { name: 'Câu Hỏi Thường Gặp' })).toBeVisible()
  15 |   })
  16 | 
  17 |   test('displays section label "Giải đáp thắc mắc"', async ({ page }) => {
  18 |     await expect(page.getByText('Giải đáp thắc mắc')).toBeVisible()
  19 |   })
  20 | 
  21 |   test('FAQ answers are collapsed by default', async ({ page }) => {
  22 |     const answers = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' }).getByRole('region')
  23 |     const count = await answers.count()
  24 |     for (let i = 0; i < count; i++) {
  25 |       await expect(answers.nth(i)).toBeHidden()
  26 |     }
  27 |   })
  28 | 
  29 |   test('FAQ items from Sanity CMS are rendered as buttons', async ({ page }) => {
  30 |     const faqSection = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
  31 |     const count = await faqSection.getByRole('button').count()
  32 |     if (count === 0) test.skip(true, 'No FAQ items in Sanity — skipping data-dependent test')
  33 |     expect(count).toBeGreaterThanOrEqual(1)
  34 |   })
  35 | 
  36 |   test('clicking a FAQ question expands its answer', async ({ page }) => {
  37 |     const faqSection = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
  38 |     const count = await faqSection.getByRole('button').count()
  39 |     if (count === 0) test.skip(true, 'No FAQ items in Sanity — skipping data-dependent test')
  40 | 
  41 |     const firstButton = faqSection.getByRole('button').first()
  42 |     await firstButton.click()
  43 |     await expect(faqSection.getByRole('region').first()).toBeVisible()
  44 |   })
  45 | 
  46 |   test('clicking an expanded FAQ question collapses it', async ({ page }) => {
  47 |     const faqSection = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
  48 |     const count = await faqSection.getByRole('button').count()
  49 |     if (count === 0) test.skip(true, 'No FAQ items in Sanity — skipping data-dependent test')
  50 | 
  51 |     const firstButton = faqSection.getByRole('button').first()
  52 |     await firstButton.click()
  53 |     await expect(faqSection.getByRole('region').first()).toBeVisible()
  54 |     await firstButton.click()
  55 |     await expect(faqSection.getByRole('region').first()).toBeHidden()
  56 |   })
  57 | 
  58 |   test('aria-expanded is false by default and true when open', async ({ page }) => {
  59 |     const faqSection = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
  60 |     const count = await faqSection.getByRole('button').count()
  61 |     if (count === 0) test.skip(true, 'No FAQ items in Sanity — skipping data-dependent test')
  62 | 
  63 |     const firstButton = faqSection.getByRole('button').first()
  64 |     await expect(firstButton).toHaveAttribute('aria-expanded', 'false')
  65 |     await firstButton.click()
  66 |     await expect(firstButton).toHaveAttribute('aria-expanded', 'true')
  67 |   })
  68 | 
  69 |   test('opening one FAQ closes the previously opened one', async ({ page }) => {
  70 |     const faqSection = page.locator('section').filter({ hasText: 'Câu Hỏi Thường Gặp' })
  71 |     const count = await faqSection.getByRole('button').count()
  72 |     if (count < 2) test.skip(true, 'Need at least 2 FAQ items — skipping data-dependent test')
  73 | 
  74 |     const buttons = faqSection.getByRole('button')
  75 |     await buttons.nth(0).click()
  76 |     await expect(faqSection.getByRole('region').nth(0)).toBeVisible()
  77 | 
  78 |     await buttons.nth(1).click()
> 79 |     await expect(faqSection.getByRole('region').nth(0)).toBeHidden()
     |                                                         ^ Error: expect(locator).toBeHidden() failed
  80 |     await expect(faqSection.getByRole('region').nth(1)).toBeVisible()
  81 |   })
  82 | })
  83 | 
```