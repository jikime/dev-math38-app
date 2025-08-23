import { PaperProblem } from "../typings";
import React from "react";
import ProblemColumn from "./ProblemColumn";

interface Props {
  leftSet: PaperProblem[];
  rightSet: PaperProblem[];
  columns: number;
  edit: boolean;
  showHeader: boolean;
  showTags: boolean;
}

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
          {/* <div className="w-1/2 border-t-1 border-gray-500"></div> */}
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
