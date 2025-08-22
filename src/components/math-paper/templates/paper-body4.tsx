import { PaperProblem } from "../types";
import React from "react";

interface Props {
  leftSet: PaperProblem[];
  rightSet: PaperProblem[];
  columns: number;
  edit: boolean;
  showHeader: boolean;
  showTags: boolean;
}

const ProblemColumn = ({
  problems,
  columns,
  edit,
  showTags,
}: {
  problems: PaperProblem[];
  columns: number;
  edit?: boolean;
  showTags?: boolean;
}) => (
  <div className="flex flex-col justify-between h-full">
    {problems?.map((p) =>
      p.problem ? (
        <div
          key={p.problem.problemId}
          className={`relative ${edit ? 'edit' : ''}`}
        >
          <div className="problem" style={{ width: columns === 1 ? 740 : 360, marginBottom: 0 }} id={p.problem.problemId}>
            <div className="problem-header">
              <div className="flex items-center gap-2">
                {p.problemNumber && (
                  <span className="problem-number font-bold text-lg">
                    {p.problemNumber.padStart(2, '0')}
                  </span>
                )}
                {showTags && (
                  <>
                    <span className="skill-name text-sm text-gray-600">
                      {p.skillName}
                    </span>
                    <span className="level text-xs text-gray-500">
                      {p.level || '-'}
                    </span>
                    <span className="ltype text-xs text-gray-500">
                      {p.ltype === 'calc' ? '계산' : p.ltype === 'unds' ? '이해' : p.ltype === 'resn' ? '추론' : '해결'}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="content">
              <div
                className="problem-content"
                dangerouslySetInnerHTML={{ __html: p.problem.content.value }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div key={"p-" + p.problemNumber}> 문제가 삭제되었습니다. </div>
      )
    )}
    <div className="empty-problem"></div>
  </div>
);

const PaperBody4 = ({
  leftSet,
  rightSet,
  columns,
  edit,
  showHeader,
  showTags,
}: Props) => {
  return (
    <>
      {showHeader && (
        <div className="w-full h-[6px] flex">
          <div className="w-1/2 border-t-1 border-gray-600"></div>
        </div>
      )}
      <div
        className={`flex-1 flex flex-row items-center border-b border-gray-600 ${
          showHeader ? "h-[861px]" : "h-[1010px] border-t"
        }`}
      >
        <div
          className={`${
            showHeader ? "h-[860px]" : "h-[1010px] pt-2"
          } flex-1 text-[9pt] w-[357px]`}
        >
          <ProblemColumn
            problems={leftSet}
            columns={columns}
            edit={edit}
            showTags={showTags}
          />
        </div>
        {columns > 1 && rightSet && (
          <>
            <div
              className={`${
                showHeader ? "h-[860px]" : "h-[1010px]"
              } w-px border-l border-dashed border-gray-600`}
            ></div>
            <div
              className={`flex-1 ${
                showHeader ? "h-[860px]" : "h-[1010px] pt-2"
              } text-[9pt] w-[357px] ml-1`}
            >
              <ProblemColumn
                problems={rightSet}
                columns={columns}
                edit={edit}
                showTags={showTags}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PaperBody4;
