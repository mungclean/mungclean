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

  // 2. 이메일 알림 전송 (환경 변수가 설정된 경우에만)
  if (process.env.NAVER_EMAIL_ID && process.env.NAVER_EMAIL_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.naver.com",
        port: 465,
        secure: true, // SSL
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
        to: `${process.env.NAVER_EMAIL_ID}@naver.com`, // 알림을 받을 이메일 (자신에게 보내기)
        subject: "[새로운 문의 알림] 고객 문의가 접수되었습니다.",
        html: `
          <h2>새로운 고객 문의가 접수되었습니다.</h2>
          <ul>
            <li><strong>고객명:</strong> ${data.name}</li>
            <li><strong>연락처:</strong> ${data.phone}</li>
            <li><strong>문의내용:</strong><br />
              <pre style="font-family: inherit; margin-top: 8px; white-space: pre-wrap;">${details}</pre>
            </li>
          </ul>
          <p>관리자 페이지에서 확인해주세요.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("이메일 발송 실패:", error);
      // 이메일 발송이 실패하더라도 DB 저장은 유지합니다.
    }
  } else {
    console.warn("이메일 알림 전송 실패: 네이버 이메일 환경 변수가 설정되지 않았습니다.");
  }

  return consultation;
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
