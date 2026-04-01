import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const { name, phone, houseType, province, area, note } = data;

  const body = `
Yêu cầu tư vấn mới từ website:

Họ tên: ${name}
SĐT: ${phone}
Loại nhà: ${houseType}
Tỉnh/Thành: ${province}
Diện tích: ${area || "Chưa xác định"}
Ghi chú: ${note || "Không có"}
  `.trim();

  // Send email via Resend
  if (process.env.RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@xuonggohoanghuan.vn",
        to: process.env.CONTACT_EMAIL,
        subject: `[Báo giá] ${name} - ${houseType} - ${province}`,
        text: body,
      }),
    });
  }

  // Notify via Zalo OA (if token configured)
  if (process.env.ZALO_OA_ACCESS_TOKEN) {
    await fetch("https://openapi.zalo.me/v2.0/oa/message", {
      method: "POST",
      headers: {
        access_token: process.env.ZALO_OA_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { user_id: process.env.ZALO_ADMIN_USER_ID },
        message: { text: body },
      }),
    }).catch(() => {}); // silent fail if Zalo not configured
  }

  return NextResponse.json({ ok: true });
}
