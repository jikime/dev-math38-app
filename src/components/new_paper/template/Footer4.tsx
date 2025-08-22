import React from "react";
import designOptions from './designOptions';

// Footer Component with customizable styles
type FooterProps = {
  academyName: string; // 학원 또는 기관 이름
  pageNumber: number; // 현재 페이지 번호
  academyLogo?: string; // 선택적 학원 로고
  totalPages: number; // 총 페이지 수
  style?: React.CSSProperties; // 추가 사용자 정의 스타일
  designOption?: keyof typeof designOptions; // 미리 정의된 디자인 옵션 중 하나 선택
};

const Footer4 = ({
  academyName,
  pageNumber,
  academyLogo,
  totalPages,
  style,
  designOption = "default",
}: FooterProps) => {
  const combinedStyle = {
    ...designOptions[designOption],
    ...style,
    WebkitPrintColorAdjust: "exact", // 인쇄 시 배경 이미지 출력
    printColorAdjust: "exact",
  };

  return (
    <div
      className="flex justify-center items-center w-full h-auto text-center relative text-[11pt] mt-1 text-sm min-h-[50px] pb-6"
      style={combinedStyle as React.CSSProperties}
    >
      {/* 왼쪽: 학원 이름 또는 로고 */}
      <div className="flex items-center absolute left-0">
        <span className="text-xs font-mono">
          출력시간 :{" "}
          {new Date()
            .toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .substring(0, 12)
            .replace(/\. /g, "-")}{" "}
          {new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </span>
      </div>
      {/* 중앙: 페이지 번호 */}
      <div className="flex justify-center font-mono text-xs">
        <span>page &nbsp;</span>
        <span>
          {pageNumber} / {totalPages}
        </span>
      </div>
      {/* 오른쪽에 학원 로고 표시, 로고가 없으면 학원 이름으로 대체 */}
      <div className="flex justify-end items-center absolute right-0">
        {academyLogo ? (
          <span>
            <img src={academyLogo} alt="logo" width="100" height="100" />
          </span>
        ) : (
          <span className="font-[RIDIBatang,Arial,Helvetica,sans-serif]">
            {academyName || ""}
          </span>
        )}
      </div>
    </div>
  );
};

export default Footer4;
