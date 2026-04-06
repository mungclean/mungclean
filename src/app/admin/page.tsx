import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import AdminLogin from "./AdminLogin";
import ConsultationTable from "./ConsultationTable";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  if (!isAdmin) {
    return <AdminLogin />;
  }

  let consultations: any[] = [];
  let fetchError = null;

  try {
    consultations = await prisma.consultation.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error: any) {
    console.error("Admin Page Prisma Error:", error);
    fetchError = error.message || String(error);
  }

  if (fetchError) {
    return (
      <div className="admin-container">
        <h1>서버 오류가 발생했습니다.</h1>
        <p style={{ color: "red" }}>{fetchError}</p>
        <p>데이터베이스 연결 또는 스키마 설정을 확인해주세요.</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>관리자 페이지 - 상담 문의 목록</h1>
      
      <ConsultationTable initialData={JSON.parse(JSON.stringify(consultations))} />

      <style>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
          min-height: 80vh;
        }
        .admin-container h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 30px;
          color: #333;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
        }
        .admin-table th,
        .admin-table td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .admin-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #555;
        }
        .admin-table tr:hover {
          background-color: #fcfcfc;
        }
        .details-col {
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .status-badge.pending {
          background-color: #fff3cd;
          color: #856404;
        }
        .status-badge.completed {
          background-color: #d4edda;
          color: #155724;
        }
        .text-center {
          text-align: center !important;
        }
        .py-4 {
          padding-top: 2rem !important;
          padding-bottom: 2rem !important;
        }
      `}</style>
    </div>
  );
}
