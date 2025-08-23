"use client";

import { Nanum_Gothic } from "next/font/google";
import React from "react";
const nanumGothic = Nanum_Gothic({
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Header Component
type HeaderProps = {
  title: string;
  studentName?: string;
  teacherName?: string;
  chapterFrom?: string;
  chapterTo?: string;
};

const SimpleHeader = ({
  title,
  studentName,
  teacherName,
  chapterFrom,
  chapterTo,
}: HeaderProps) => (
  <div
    className={
      "w-full pb-1  bg-white flex justify-between " + nanumGothic.className
    }
  >
    <div className="inline-block text-xs overflow-hidden text-ellipsis whitespace-nowrap bottom-0">
      {chapterFrom || title} {chapterTo ? " ~ " + chapterTo : ""}
    </div>
    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
      {studentName || ""}
    </div>
  </div>
);

export default SimpleHeader;
