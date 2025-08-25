"use client";

import {
  M38UserStudyPaper,
  GeneratedPaper,
  PaperProblem,
  NUM
} from "@/components/math-paper/typings";
import React, { createRef, useEffect, useState } from "react";
import AnswerSheetManager from '@/components/math-paper/template/answer-sheet-manager';

interface Props {
  paper: GeneratedPaper | M38UserStudyPaper;
  showBlankPage?: boolean;
}

const AnswerSummaryPrint = ({ paper, showBlankPage }: Props) => {
  const targetDiv = createRef<HTMLDivElement>();
  const sheetDiv = createRef<HTMLDivElement>();
  const [sheetManager, setSheetManager] = useState<AnswerSheetManager>();
  const lectureTitle =
    (paper as M38UserStudyPaper)["lectureTitle"] || "빠른 답안";

  useEffect(() => {
    if (targetDiv.current && sheetDiv.current && !sheetManager) {
      startDrawing();
    }
  }, [targetDiv, sheetDiv, sheetManager]);

  const startDrawing = async () => {
    const answerSheet = targetDiv.current;
    const sheet = sheetDiv.current;

    if (!paper) return;
    if (!answerSheet) return;
    if (!sheet || sheet.children.length > 0) return;
    if (sheetManager) return;

    const answerSheetManager = new AnswerSheetManager(
      sheet,
      lectureTitle,
      paper.title,
      paper.subjectName || paper.studentName || "&nbsp;",
      paper.teacherName || ""
    );
    setSheetManager(answerSheetManager);

    const problems = paper.pages.flatMap((page) => [
      ...page.leftSet,
      ...(page.rightSet ? page.rightSet : []),
    ]) as PaperProblem[];

    for (const p of problems) {
      const { answerType, answer, choice } = p.problem.content;

      let answerHtml = "";
      if (answerType === "choice") {
        if (choice.multi) {
          answerHtml = choice.answers.map((v) => NUM[v]).join(" , ");
        } else {
          answerHtml = NUM[choice.answer];
        }
      } else {
        answerHtml = answer?.answers
          ?.map(
            (a) =>
              `<span class="answer-value">${a.preDeco || ""} ${a.value} ${a.postDeco || ""}</span>`
          )
          .join("<span>, </span>");
      }

      const html = `
      <span class="p-answer-num">${p.problemNumber}</span>
      <span class="p-answer-value">
        <span>
          ${answerHtml}
        </span>
      </span>
      `;

      const answerDiv = document.createElement("div");
      answerDiv.className = "problem-answer";
      answerDiv.innerHTML = html;
      answerSheet.appendChild(answerDiv);
    }

    setTimeout(() => {
      rearrange(answerSheet, answerSheetManager);
    }, 500);
  };

  const rearrange = async (
    answerSheet: HTMLDivElement,
    answerSheetManager: AnswerSheetManager
  ) => {
    answerSheet!.querySelectorAll(".problem-answer").forEach((pTag) => {
      answerSheetManager.addAnswer(pTag);
    });
    if (showBlankPage) {
      answerSheetManager.checkBlankPage();
    }
  };

  return (
    <>
      <div
        ref={targetDiv}
        className="temp-target hidden"
        style={{ position: "absolute", left: -800 }}
      ></div>
      <div ref={sheetDiv} className="printableArea ml-auto mr-auto"></div>
    </>
  );
};

export default AnswerSummaryPrint;
