import { PaperProblem } from "../types";
import StartHeader from './start-header4';
import PaperBody from './paper-body4';
import SimpleHeader from "../common/simple-header";
import Footer from "./footer4";

type PaperTemplateProps = {
  title: string;
  chapterFrom?: string;
  chapterTo?: string;
  lectureTitle?: string;
  subjectName: string;
  teacherName?: string;
  studentName?: string;
  academyName?: string;
  academyLogo?: string;
  pageNumber: number;
  totalPages: number;
  leftSet: PaperProblem[];
  rightSet?: PaperProblem[];
  columns: number;
  edit?: boolean;
  showTags?: boolean;
  startHeader?: React.ReactNode;
};

const PaperTemplate4 = ({
  title = "",
  chapterFrom = "",
  chapterTo = "",
  lectureTitle = "",
  subjectName = "",
  teacherName = "",
  studentName = "",
  academyName = "SpMath",
  academyLogo,
  pageNumber = 1,
  totalPages = 1,
  leftSet = [],
  rightSet = [],
  columns = 2,
  edit = false,
  showTags = true,
  startHeader,
}: PaperTemplateProps) => {
  return (
    <div
      className="m-0 p-[10.5mm_8mm_4mm_8mm] text-[9pt] font-[RIDIBatang,Arial,Helvetica,sans-serif]
                 bg-white w-[21cm] min-h-[29.7cm] max-h-[29.7cm] border border-gray-300 shadow-none
                 flex flex-col overflow-hidden
                 mx-auto my-[0.5cm]
                 print:m-0 print:shadow-none"
    >
      {pageNumber === 1 ? (
        startHeader ? (
          startHeader
        ) : (
          <StartHeader
            teacherName={teacherName}
            title={title}
            subjectName={subjectName}
            studentName={studentName}
            lectureTitle={lectureTitle}
            chapterFrom={chapterFrom}
            chapterTo={chapterTo}
          />
        )
      ) : (
        <SimpleHeader
          title={title}
          studentName={studentName}
          teacherName={teacherName}
          chapterFrom={chapterFrom}
          chapterTo={chapterTo}
        />
      )}
      <PaperBody
        leftSet={leftSet}
        rightSet={rightSet}
        columns={columns}
        edit={edit}
        showHeader={pageNumber === 1}
        showTags={showTags}
      />
      <Footer
        academyName={academyName}
        totalPages={totalPages}
        pageNumber={pageNumber}
        academyLogo={academyLogo}
      />
    </div>
  );
};

export default PaperTemplate4;
