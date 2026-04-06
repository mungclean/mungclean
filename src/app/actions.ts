"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

export async function createConsultation(data: any) {
  const details = `주소: ${data.address}
평수/구조: ${data.supplyPyeong} / 방${data.roomCount} 화${data.bathroomCount} 베${data.verandaCount}
반려동물: 강아지 ${data.dogCount || 0} / 고양이 ${data.catCount || 0}
청소종류: ${[...data.petCleaning, ...data.cleaningType, ...data.specialCleaning].join(", ")}
상태: ${data.condition.join(", ")}
특이사항: ${data.notes}`.trim();

  // 1. DB에 문의 정보 저장
  const consultation = await prisma.consultation.create({
    data: {
      name: data.name,
      phone: data.phone,
      type: "견적 문의",
      details: details,
    },
  });

  // 2. 이메일 알림 전송 결과 추적
  let emailStatus = { success: false, error: null as string | null };

  if (process.env.NAVER_EMAIL_ID && process.env.NAVER_EMAIL_PASSWORD) {
    try {
      console.log("이메일 발송 시도 중...");
      const transporter = nodemailer.createTransport({
        host: "smtp.naver.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.NAVER_EMAIL_ID,
          pass: process.env.NAVER_EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `${process.env.NAVER_EMAIL_ID}@naver.com`,
        to: `${process.env.NAVER_EMAIL_ID}@naver.com`, // 자신에게 보내기
        subject: "[새로운 문의 알림] 고객 문의가 접수되었습니다.",
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
            <h2 style="color: #00aeef; border-bottom: 2px solid #00aeef; padding-bottom: 10px;">신규 견적 문의 접수</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <p><strong>고객명:</strong> ${data.name}</p>
              <p><strong>연락처:</strong> ${data.phone}</p>
              <p><strong>접수 시간:</strong> ${new Date().toLocaleString("ko-KR")}</p>
              <div style="margin-top: 20px; padding: 15px; background: white; border: 1px solid #eee; border-radius: 4px;">
                <strong>문의 상세 내용:</strong><br />
                <pre style="white-space: pre-wrap; margin-top: 10px;">${details}</pre>
              </div>
            </div>
            <p style="margin-top: 30px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin" 
                 style="background-color: #00aeef; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                 관리자 페이지에서 확인하기
              </a>
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("이메일 발송 성공:", info.messageId);
      emailStatus.success = true;
    } catch (error: any) {
      console.error("이메일 발송 상세 에러:", error);
      emailStatus.error = error.message || String(error);
    }
  } else {
    console.warn("이메일 알림 실패: 서버 환경 변수(NAVER_EMAIL_ID / PASSWORD)가 설정되어 있지 않습니다.");
    emailStatus.error = "Environment variables missing";
  }

  // Next.js serialization을 위해 Date 객체 등을 문자열로 변환한 객체 반환
  return JSON.parse(JSON.stringify({ 
    ...consultation, 
    emailStatus 
  }));
}

export async function loginAdmin(password: string) {
  if (password === "admin1234") {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", { path: "/", httpOnly: true });
    return true;
  }
  return false;
}

export async function updateConsultationStatus(id: number, status: string) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_auth")?.value === "true";
    if (!isAdmin) throw new Error("Unauthorized");

    const updated = await prisma.consultation.update({
      where: { id },
      data: { status },
    });
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Update Status Error:", error);
    return { success: false, error: error.message || String(error) };
  }
}

export async function deleteConsultation(id: number) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_auth")?.value === "true";
    if (!isAdmin) throw new Error("Unauthorized");

    await prisma.consultation.delete({
      where: { id },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Delete Consultation Error:", error);
    return { success: false, error: error.message || String(error) };
  }
}
