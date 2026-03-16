"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { createConsultation } from "@/app/actions";

export default function EstimatePage() {
  const [formData, setFormData] = useState({
    petCleaning: [] as string[],
    cleaningType: [] as string[],
    specialCleaning: [] as string[],
    condition: [] as string[],
    name: "",
    phone: "",
    address: "",
    supplyPyeong: "",
    roomCount: "",
    bathroomCount: "",
    verandaCount: "",
    dogCount: "",
    catCount: "",
    notes: ""
  });

  const handleCheckboxChange = (category: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const current = prev[category] as string[];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createConsultation(formData);
      alert("견적 문의가 접수되었습니다. 명확한 확인을 위해 곧 담당자가 연락드리겠습니다!");
      // Optionally reload or reset form
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("문의 접수 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="estimate-page">
      <div className="page-header">
        <div className="container">
          <motion.h1 {...fadeInUp}>간편 견적 문의</motion.h1>
          <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>정확한 견적을 위해 상세 정보를 입력해주세요.</motion.p>
        </div>
      </div>

      <div className="container section">
        <motion.div
          className="estimate-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="comparison-section">
            <h3 className="section-subtitle center">왜 멍크린이어야 할까요?</h3>
            <p className="section-hint center">일반 업체와 비교할 수 없는 완성도의 차이를 확인해 보세요.</p>

            <div className="comparison-grid">
              <div className="grid-header">
                <div className="header-cell label">구분</div>
                <div className="header-cell general">일반 입주청소 업체</div>
                <div className="header-cell mungclean">반려동물 전문 멍크린</div>
              </div>

              {[
                { label: "청소 시간", general: "오전, 오후 중 한 타임 (대략 4-5시간)", mungclean: "오전 8시 시작 (하루 10-11시간 집중 청소)", highlight: true },
                { label: "전문 인력", general: "팀장만 한국인, 팀원은 외국인", mungclean: "전원 숙련된 한국인 청소 전문가", highlight: true },
                { label: "전문 장비", general: "간단한 기본 청소 도구", mungclean: "컬비, 미코플러 등 고가의 프리미엄 장비", highlight: true },
                { label: "살균 소독", general: "짧은 시간 내 시늉만 하는 스팀 케어", mungclean: "오존 산화 장비 전 공간 살균 + 고압 스팀", highlight: true },
                { label: "냄새 제거", general: "독한 향의 세제로 냄새를 덮는 수준", mungclean: "벽지 속 각질/미세먼지 제거로 근본적 탈취", highlight: true },
                { label: "친환경 세제", general: "말로만 친환경, 실제론 일반 세제", mungclean: "검증된 수입산 프리미엄 친환경 세제", highlight: true },
                { label: "추가 요금", general: "현장에서 불투명한 추가 요금 요구 O", mungclean: "정찰제 기반, 현장 추가 요금 절대 요구 X", highlight: true },
              ].map((row, idx) => (
                <div className="grid-row" key={idx}>
                  <div className="cell label">{row.label}</div>
                  <div className="cell general">{row.general}</div>
                  <div className="cell mungclean">
                    <div className="mungclean-content">
                      <CheckCircle2 size={16} className="check-icon" />
                      <span>{row.mungclean}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-subtitle">전체 청소 견적 항목 선택</h3>
              <p className="section-hint">해당되는 항목에 모두 체크해 주세요.</p>

              <div className="checkbox-grid-group">
                <div className="check-row">
                  {["강아지집 청소", "고양이집 청소"].map(item => (
                    <label key={item} className={`check-item ${formData.petCleaning.includes(item) ? 'active' : ''}`}>
                      <input type="checkbox" checked={formData.petCleaning.includes(item)} onChange={() => handleCheckboxChange('petCleaning', item)} />
                      <div className="custom-check"></div>
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <div className="check-row">
                  {["거주청소 (현재 짐이 있는 상태로 살고 계시다면)", "들어갈 집 이사청소", "나갈집 이사청소"].map(item => (
                    <label key={item} className={`check-item ${formData.cleaningType.includes(item) ? 'active' : ''}`}>
                      <input type="checkbox" checked={formData.cleaningType.includes(item)} onChange={() => handleCheckboxChange('cleaningType', item)} />
                      <div className="custom-check"></div>
                      <span className="checkbox-label-text">
                        {item.includes(" (") ? (
                          <>
                            {item.split(" (")[0]}
                            <br />
                            <small className="label-subtext">({item.split(" (")[1]}</small>
                          </>
                        ) : item}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="check-row">
                  {["아기맞이 청소", "무지개 다리 청소", "상업시설 청소"].map(item => (
                    <label key={item} className={`check-item ${formData.specialCleaning.includes(item) ? 'active' : ''}`}>
                      <input type="checkbox" checked={formData.specialCleaning.includes(item)} onChange={() => handleCheckboxChange('specialCleaning', item)} />
                      <div className="custom-check"></div>
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <div className="check-row">
                  {["털이 심함", "냄새가 심함", "둘다 심함"].map(item => (
                    <label key={item} className={`check-item ${formData.condition.includes(item) ? 'active' : ''}`}>
                      <input type="checkbox" checked={formData.condition.includes(item)} onChange={() => handleCheckboxChange('condition', item)} />
                      <div className="custom-check"></div>
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-divider"></div>

            <div className="form-section">
              <h3 className="section-subtitle">고객 정보 및 상세 정보</h3>

              <div className="input-grid">
                <div className="form-group">
                  <label>성함 *</label>
                  <input type="text" name="name" required placeholder="성함을 입력해주세요" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>연락처 *</label>
                  <input type="tel" name="phone" required placeholder="연락처를 입력해주세요" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group full-width">
                  <label>청소 하실 곳 주소 (동 까지) *</label>
                  <input type="text" name="address" required placeholder="예: 서울특별시 광진구 능동" value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>공급 평수 *</label>
                  <input type="text" name="supplyPyeong" required placeholder="평수(예: 34평)" value={formData.supplyPyeong} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>방 개수 *</label>
                  <input type="text" name="roomCount" required placeholder="방 개수" value={formData.roomCount} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>화장실 개수 *</label>
                  <input type="text" name="bathroomCount" required placeholder="화장실 개수" value={formData.bathroomCount} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>베란다 개수 *</label>
                  <input type="text" name="verandaCount" required placeholder="베란다 개수" value={formData.verandaCount} onChange={handleChange} />
                </div>

                <div className="form-group full-width" style={{ marginTop: '20px' }}>
                  <h3 className="section-subtitle" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>현재 키우고 계신 동물이 있으시다면</h3>
                  <div className="pet-count-row">
                    <div className="pet-input-item">
                      <label>강아지</label>
                      <input type="text" name="dogCount" placeholder="마리수" value={formData.dogCount} onChange={handleChange} />
                      <span className="unit">마리</span>
                    </div>
                    <div className="pet-input-item">
                      <label>고양이</label>
                      <input type="text" name="catCount" placeholder="마리수" value={formData.catCount} onChange={handleChange} />
                      <span className="unit">마리</span>
                    </div>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>특이사항</label>
                  <textarea
                    name="notes"
                    rows={4}
                    placeholder="예: 알레르기가 심합니다 / 반려동물 털 박힘이 심합니다 등"
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="privacy-check">
              <input type="checkbox" id="privacy" required />
              <label htmlFor="privacy">개인정보 수집 및 이용 방침에 동의합니다.</label>
            </div>

            <button type="submit" className="submit-btn">
              견적 문의 신청하기 <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        .estimate-page {
          background-color: #f8fafc;
          min-height: 100vh;
        }
        .page-header {
          background: linear-gradient(135deg, var(--primary) 0%, #0088cc 100%);
          padding: 80px 0;
          color: white;
          text-align: center;
        }
        .page-header h1 {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 15px;
        }
        .page-header p {
          font-size: 1.15rem;
          opacity: 0.9;
        }
        .estimate-card {
          max-width: 1000px;
          margin: -60px auto 0;
          background: white;
          border-radius: 30px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          overflow: hidden;
          padding-bottom: 60px;
        }

        .comparison-section {
          padding: 60px 40px;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .section-subtitle.center {
          text-align: center;
          margin-bottom: 8px;
        }
        .section-hint.center {
          text-align: center;
          margin-bottom: 40px;
        }
        .comparison-grid {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
        }
        .grid-header {
          display: grid;
          grid-template-columns: 140px 1fr 1.2fr;
          background-color: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
        }
        .header-cell {
          padding: 20px;
          font-weight: 800;
          font-size: 1rem;
          color: #475569;
          text-align: center;
        }
        .header-cell.mungclean {
          background-color: var(--primary);
          color: white;
        }
        .grid-row {
          display: grid;
          grid-template-columns: 140px 1fr 1.2fr;
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.2s ease;
        }
        .grid-row:last-child {
          border-bottom: none;
        }
        .grid-row:hover {
          background-color: #fafafa;
        }
        .cell {
          padding: 20px;
          display: flex;
          align-items: center;
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.5;
        }
        .cell.label {
          background-color: #f8fafc;
          font-weight: 700;
          color: #1e293b;
          justify-content: center;
          text-align: center;
          border-right: 1px solid #f1f5f9;
        }
        .cell.general {
          border-right: 1px solid #f1f5f9;
          justify-content: center;
          text-align: center;
          white-space: pre-wrap;
        }
        .cell.mungclean {
          background-color: #f0f9ff;
          color: var(--primary);
          font-weight: 600;
          justify-content: center;
          text-align: center;
        }
        .mungclean-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .check-icon {
          color: var(--primary);
          flex-shrink: 0;
          margin-top: 3px;
        }
        
        @media (max-width: 768px) {
          .comparison-section {
            padding: 40px 20px;
          }
          .grid-header {
            display: none;
          }
          .grid-row {
            grid-template-columns: 1fr;
            border: 1px solid #e2e8f0;
            border-radius: 15px;
            margin-bottom: 20px;
            overflow: hidden;
            background: white;
          }
          .cell {
            padding: 15px;
            justify-content: center;
            text-align: center;
          }
          .cell.label {
            border-right: none;
            border-bottom: 1px solid #f1f5f9;
            background-color: #f1f5f9;
            font-size: 1rem;
          }
          .cell.general {
            border-right: none;
            border-bottom: 1px solid #f1f5f9;
            color: #94a3b8;
          }
          .cell.general::before {
            content: "일반 청소업체: ";
            font-weight: 700;
            margin-right: 8px;
            white-space: nowrap;
          }
          .cell.mungclean::before {
            content: "멍크린: ";
            font-weight: 700;
            margin-right: 8px;
            white-space: nowrap;
          }
        }

        .disclaimer-banner {
          background-color: #fff7ed;
          color: #c2410c;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 1.1rem;
          border-bottom: 1px solid #ffedd5;
        }
        .disclaimer-banner strong {
          color: #9a3412;
          text-decoration: underline;
        }
        form {
          padding: 40px 60px;
        }
        .form-section {
          margin-bottom: 40px;
        }
        .section-subtitle {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 10px;
        }
        .section-hint {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 30px;
        }
        .checkbox-grid-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .check-row {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        .check-item {
          flex: 1;
          min-width: 140px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .check-item input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }
        .custom-check {
          width: 22px;
          height: 22px;
          border: 2px solid #cbd5e1;
          border-radius: 6px;
          transition: all 0.2s ease;
          position: relative;
        }
        .check-item.active {
          border-color: var(--primary);
          background-color: #f0f9ff;
        }
        .check-item.active .custom-check {
          background-color: var(--primary);
          border-color: var(--primary);
        }
        .check-item.active .custom-check::after {
          content: "";
          position: absolute;
          left: 6px;
          top: 2px;
          width: 6px;
          height: 11px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        .check-item span.checkbox-label-text {
          font-size: 1rem;
          font-weight: 600;
          color: #475569;
          line-height: 1.3;
        }
        .label-subtext {
          font-size: 0.82rem;
          font-weight: 500;
          opacity: 0.8;
          display: block;
          margin-top: 2px;
        }
        .check-item.active span.checkbox-label-text {
          color: var(--primary);
        }
        .form-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 40px 0;
        }
        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        .form-group.full-width {
          grid-column: span 2;
        }
        .form-group label {
          display: block;
          font-weight: 700;
          color: #334155;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }
        input[type="text"],
        input[type="tel"],
        textarea {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
          outline: none;
        }
        input:focus,
        textarea:focus {
          border-color: var(--primary);
        }
        .privacy-check {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 40px 0;
        }
        .privacy-check input {
          width: 18px;
          height: 18px;
        }
        .privacy-check label {
          font-size: 0.95rem;
          color: #64748b;
          cursor: pointer;
        }
        .submit-btn {
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 60px;
          background: var(--primary);
          color: white;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 800;
          box-shadow: 0 10px 20px rgba(0, 174, 239, 0.2);
          transition: all 0.3s ease;
        }
        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 174, 239, 0.3);
          background: #0095cc;
        }
        .pet-count-row {
          display: flex;
          gap: 40px;
          align-items: center;
        }
        .pet-input-item {
          display: flex;
          align-items: center;
          gap: 15px;
          flex: 1;
        }
        .pet-input-item input {
          flex: 1;
          width: auto;
        }
        .pet-input-item label {
          margin-bottom: 0;
          white-space: nowrap;
          font-size: 1.1rem;
          min-width: 60px;
        }
        .unit {
          font-size: 1.1rem;
          font-weight: 700;
          color: #334155;
          margin-left: 5px;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          form { padding: 30px 20px; }
          .page-header h1 { font-size: 2.2rem; }
          .input-grid { grid-template-columns: 1fr; }
          .form-group.full-width { grid-column: span 1; }
          .check-item { min-width: 100%; }
          .pet-count-row {
            flex-direction: column;
            gap: 15px;
          }
          .pet-input-item {
            width: 100%;
          }
          .comparison-container {
            grid-template-columns: 1fr;
          }
          .comparison-section {
            padding: 20px 15px;
          }
        }
      `}</style>
    </div>
  );
}
