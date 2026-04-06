"use client";

import { useState } from "react";
import { updateConsultationStatus, deleteConsultation } from "../actions";
import { Trash2 } from "lucide-react";

interface Consultation {
  id: number;
  name: string;
  phone: string;
  type: string | null;
  details: string | null;
  status: string;
  createdAt: any;
}

export default function ConsultationTable({ initialData }: { initialData: Consultation[] }) {
  const [data, setData] = useState<Consultation[]>(initialData);
  const [selectedInquiry, setSelectedInquiry] = useState<Consultation | null>(null);

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "PENDING" ? "COMPLETED" : "PENDING";
    const result = await updateConsultationStatus(id, nextStatus);

    if (result.success) {
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
      );
    } else {
      alert("상태 변경 중 오류가 발생했습니다: " + result.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 이 문의 내역을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.")) return;
    const result = await deleteConsultation(id);

    if (result.success) {
      setData((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("삭제 중 오류가 발생했습니다: " + result.error);
    }
  };

  const openDetails = (item: Consultation) => {
    setSelectedInquiry(item);
  };

  const closeDetails = () => {
    setSelectedInquiry(null);
  };

  return (
    <>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>연락처</th>
            <th>문의 종류</th>
            <th>상세 내용</th>
            <th>상태</th>
            <th>관리</th>
            <th>문의일시</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                문의 내역이 없습니다.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>{item.type || "-"}</td>
                <td className="details-col cursor-pointer" onClick={() => openDetails(item)}>
                  {item.details || "-"}
                </td>
                <td>
                  <span
                    className={`status-badge ${(item.status || "PENDING").toLowerCase()}`}
                  >
                    {item.status === "PENDING" ? "대기중" : "완료"}
                  </span>
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      className={`status-btn ${item.status === "PENDING" ? "btn-complete" : "btn-pending"}`}
                      onClick={() => handleStatusChange(item.id, item.status)}
                    >
                      {item.status === "PENDING" ? "완료 처리" : "대기로 변경"}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
                <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ko-KR") : "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedInquiry && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>상담 상세 내용 (ID: {selectedInquiry.id})</h2>
              <button className="close-btn" onClick={closeDetails}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <label>고객명</label>
                  <span>{selectedInquiry.name}</span>
                </div>
                <div className="info-item">
                  <label>연락처</label>
                  <span>{selectedInquiry.phone}</span>
                </div>
                <div className="info-item">
                  <label>문의 종류</label>
                  <span>{selectedInquiry.type || "-"}</span>
                </div>
                <div className="info-item">
                  <label>상태</label>
                  <span className={`status-badge ${(selectedInquiry.status || "PENDING").toLowerCase()}`}>
                    {selectedInquiry.status === "PENDING" ? "대기중" : "완료"}
                  </span>
                </div>
              </div>
              <div className="info-item full">
                <label>상세 요청 사항</label>
                <div className="details-text">
                  {(selectedInquiry.details || "-").split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .details-col:hover {
          text-decoration: underline;
          color: #2b7fff;
        }
        .status-btn {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.8rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn-complete {
          background-color: #e3f2fd;
          color: #1976d2;
        }
        .btn-complete:hover {
          background-color: #bbdefb;
        }
        .btn-pending {
          background-color: #fce4ec;
          color: #c2185b;
        }
        .btn-pending:hover {
          background-color: #f8bbd0;
        }
        .btn-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .delete-btn {
          padding: 6px;
          border-radius: 4px;
          border: 1px solid #ffcdd2;
          background-color: white;
          color: #d32f2f;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .delete-btn:hover {
          background-color: #ffebee;
          color: #b71c1c;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          width: 90%;
          max-width: 600px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          animation: modalSlideUp 0.3s ease-out;
        }
        @keyframes modalSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8f9fa;
        }
        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #333;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #999;
        }
        .modal-body {
          padding: 24px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        .info-item label {
          display: block;
          font-size: 0.85rem;
          color: #777;
          margin-bottom: 4px;
        }
        .info-item span {
          font-weight: 600;
          color: #333;
        }
        .info-item.full {
          grid-column: span 2;
        }
        .details-text {
          background-color: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          color: #444;
          line-height: 1.6;
          max-height: 400px;
          overflow-y: auto;
          white-space: pre-wrap;
        }
        .details-text p {
          margin: 0 0 8px 0;
        }
      `}</style>
    </>
  );
}
