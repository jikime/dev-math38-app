import React from "react";
import designOptions from './design-options';

type FooterProps = {
  academyName: string;
  pageNumber: number;
  academyLogo?: string;
  totalPages: number;
  style?: React.CSSProperties;
  designOption?: keyof typeof designOptions;
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
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  };

  return (
    <div
      className="flex justify-center items-center w-full h-auto text-center relative text-[11pt] mt-1 text-sm min-h-[50px] pb-6"
      style={combinedStyle as React.CSSProperties}
    >
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
      <div className="flex justify-center font-mono text-xs">
        <span>page &nbsp;</span>
        <span>
          {pageNumber} / {totalPages}
        </span>
      </div>
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
