"use client";

import {
  M38UserStudyPaper,
  GeneratedPaper,
  PaperProblem,
} from "@/components/math-paper/typings";
import React, { createRef, useEffect, useState } from "react";
import SolutionSheetManager from '@/components/math-paper/template/solution-sheet-manager';

interface Props {
  paper: GeneratedPaper | M38UserStudyPaper;
  showBlankPage?: boolean;
}

const SolutionPagesPrint = ({ paper, showBlankPage = true }: Props) => {
  const targetDiv = createRef<HTMLDivElement>();
  const sheetDiv = createRef<HTMLDivElement>();
  const [sheetManager, setSheetManager] = useState<SolutionSheetManager>();
  const lectureTitle = (paper as M38UserStudyPaper)["lectureTitle"] || "템플릿";

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

    const solutionSheetManager = new SolutionSheetManager(
      sheet,
      lectureTitle,
      paper.title,
      paper.subjectName || paper.studentName || "&nbsp;",
      paper.teacherName || ""
    );
    setSheetManager(solutionSheetManager);

    const problems = paper.pages.flatMap((page) => [
      ...page.leftSet,
      ...(page.rightSet ? page.rightSet : []),
    ]) as PaperProblem[];

    for (const p of problems) {
      const { solution } = p.problem;
      const { value } = solution || { value: "" };
      const answerDiv = document.createElement("div");
      answerDiv.className = "answer";
      answerDiv.innerHTML = value;
      answerSheet.appendChild(answerDiv);

      const problemNumberSpan = document.createElement("span");
      problemNumberSpan.className = "problem-number";
      problemNumberSpan.innerHTML = `${p.problemNumber}`;

      const firstChild = answerDiv.childNodes[0];
      if (firstChild) {
        if (firstChild.nodeName === "IMG") {
          const img = firstChild as HTMLImageElement;
          const problemNumberDiv = document.createElement("div");
          problemNumberDiv.className = "problem-number";
          problemNumberDiv.innerHTML = `${p.problemNumber}`;
          img.parentNode!.insertBefore(problemNumberDiv, img);
          problemNumberDiv.appendChild(img);
        } else {
          firstChild.insertBefore(problemNumberSpan, firstChild.firstChild);
        }
      }
    }

    setTimeout(() => {
      rearrange(answerSheet, solutionSheetManager);
    }, 500);
  };

  const rearrange = async (
    answerSheet: HTMLDivElement,
    solutionSheetManager: SolutionSheetManager
  ) => {
    answerSheet!
      .querySelectorAll(
        ".answer > p, .answer > div, .answer > ul, .answer > img, .answer > table"
      )
      .forEach((pTag) => {
        solutionSheetManager.addAnswer(pTag);
      });
    if (showBlankPage) {
      solutionSheetManager.checkBlankPage();
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

export default SolutionPagesPrint;
