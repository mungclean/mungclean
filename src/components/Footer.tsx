"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-links">
            <Link href="/admin">admin</Link>
            <Link href="/terms">이용약관</Link>
            <Link href="/privacy">개인정보처리방침</Link>
          </div>
          <div className="footer-customer-service">
            <span>멍크린 고객센터</span>
            <span className="footer-phone">1661-0959</span>
          </div>
        </div>

        <div className="footer-info">
          <p>
            본사주소: 인천광역시 중구 하늘달빛로64번길6-3, 302호(중산동, 스카이 메디컬프라자) &nbsp; | &nbsp; 전화: 1661-0959 &nbsp; | &nbsp; 이메일: 3800sv@naver.com
          </p>
          <p>
            대표: 김동환 &nbsp; | &nbsp; 사업자등록번호: 341-28-01786
          </p>
          <p className="copyright">Copyright © 멍크린 all rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: #f8f9fa;
          color: #666;
          padding: 40px 0;
          border-top: 1px solid #eee;
        }
        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #eeeff1;
          padding-bottom: 20px;
        }
        .footer-links {
          display: flex;
          gap: 25px;
        }
        .footer-links a {
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
        }
        .footer-customer-service {
          text-align: right;
        }
        .footer-customer-service span {
          display: block;
          font-size: 0.8rem;
          color: #999;
        }
        .footer-phone {
          font-size: 1.5rem !important;
          font-weight: 800;
          color: #333 !important;
        }
        .footer-info {
          font-size: 0.85rem;
          line-height: 1.8;
          color: #888;
        }
        .copyright {
          margin-top: 10px;
        }
        
        @media (max-width: 768px) {
          .footer-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .footer-customer-service {
            text-align: left;
          }
        }
      `}</style>
    </footer>
  );
}
