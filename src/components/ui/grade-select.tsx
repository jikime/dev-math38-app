"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface GradeSelectProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  width?: number | string;
  name?: string;
  required?: boolean;
  label?: string;
  className?: string;
}

export const GradeSelect = ({
  value,
  defaultValue,
  onChange,
  placeholder = "학년 선택",
  size = "small",
  width = 100,
  className,
}: GradeSelectProps) => {
  return (
    <Select
      value={value?.toString()}
      defaultValue={defaultValue?.toString()}
      onValueChange={(val) => {
        const num = val === "0" ? 0 : Number(val);
        onChange && onChange(num);
      }}
    >
      <SelectTrigger 
        className={`bg-white font-pretendard font-bold ${className || ''}`}
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">전체</SelectItem>
        <SelectGroup>
          <SelectLabel>고등학교</SelectLabel>
          <SelectItem value="12">고 3학년</SelectItem>
          <SelectItem value="11">고 2학년</SelectItem>
          <SelectItem value="10">고 1학년</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>중학교</SelectLabel>
          <SelectItem value="9">중 3학년</SelectItem>
          <SelectItem value="8">중 2학년</SelectItem>
          <SelectItem value="7">중 1학년</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>초등학교</SelectLabel>
          <SelectItem value="6">초 6학년</SelectItem>
          <SelectItem value="5">초 5학년</SelectItem>
          <SelectItem value="4">초 4학년</SelectItem>
          <SelectItem value="3">초 3학년</SelectItem>
          <SelectItem value="2">초 2학년</SelectItem>
          <SelectItem value="1">초 1학년</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export const GradeSelector = ({
  name,
  required,
  label = "학년",
  ...props
}: GradeSelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}{required && " *"}</Label>
      <GradeSelect {...props} />
    </div>
  );
};

// 인라인 라벨이 있는 버전 (원본 패턴 유지)
export const GradeSelectWithLabel = ({
  label = "학년",
  width = "100%",
  ...props
}: GradeSelectProps) => {
  return (
    <div className="flex items-center w-full gap-1">
      <label className="space-x-2 mx-2 text-nowrap font-pretendard text-sm">{label}</label>
      <GradeSelect width={width} {...props} />
    </div>
  );
};