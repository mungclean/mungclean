import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import AdminLogin from "./AdminLogin";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth")?.value === "true";

  if (!isAdmin) {
    return <AdminLogin />;
  }

  const consultations = await prisma.consultation.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="admin-container">
      <h1>관리자 페이지 - 상담 문의 목록</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>연락처</th>
            <th>문의 종류</th>
            <th>상세 내용</th>
            <th>상태</th>
            <th>문의일시</th>
          </tr>
        </thead>
        <tbody>
          {consultations.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                문의 내역이 없습니다.
              </td>
            </tr>
          ) : (
            consultations.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>{item.type || "-"}</td>
                <td className="details-col">{item.details || "-"}</td>
                <td>
                  <span
                    className={`status-badge ${item.status.toLowerCase()}`}
                  >
                    {item.status === "PENDING" ? "대기중" : item.status === "COMPLETED" ? "완료" : item.status}
                  </span>
                </td>
                <td>{item.createdAt.toLocaleDateString("ko-KR")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Styled-JSX is typically deprecated in App Router if not client component, 
          but we are using plain CSS or globals.css. 
          Actually, since App Router doesn't support styled-jsx in server components without "use client", 
          we should use inline styles or standard CSS. Let's make it plain client component for styled-jsx,
          or just use a basic css file or tailwind. Wait, Next.js supports a separate CSS module.
      */}
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
