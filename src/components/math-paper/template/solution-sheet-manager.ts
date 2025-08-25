class SolutionSheetManager {
  answerSheets: HTMLDivElement;
  currentSheet: HTMLDivElement;
  position = 0;
  title: string;
  lectureTitle: string;
  subjectName: string;
  teacherName: string;
  debug = true;

  constructor(
    answerSheets: HTMLDivElement,
    lectureTitle: string,
    title: string,
    subjectName: string,
    teacherName: string,
  ) {
    this.answerSheets = answerSheets;
    this.title = title;
    this.lectureTitle = lectureTitle;
    this.subjectName = subjectName;
    this.teacherName = teacherName;
    this.currentSheet = this._addAnswerSheet();
  }

  _addAnswerSheet() {
    const answerSheet = document.createElement("div");
    answerSheet.classList.add("solution-sheet", "page");
    this.answerSheets.appendChild(answerSheet);
    const header = document.createElement("div");
    header.classList.add("header");
    header.innerHTML = `
    <table class="header-table">
      <tbody>
        <tr>
          <td width="130px">
            <div class="w-full bg-blue-300 min-w[100px]"> 과목 </div>
          </td>
          <td class="max-w-[500px] relative flex items-center h-[22px] justify-center">
            <span class="bg-blue-400 text-white min-w-[160px] px-2 inline-block text-xs rounded-sm py-0.5 overflow-hidden overflow-ellipsis whitespace-nowrap">
            ${this.title || ""}
            </span>
          </td>
          <td width="100px">
            <div class="w-full bg-blue-300 min-w[100px]"> 담당 </div>
          </td>
        </tr>
        <tr>
          <td>${this.subjectName || ""}</td>
          <td class="text-base">${this.lectureTitle} </td>
          <td>${this.teacherName || ""}</td>
        </tr>
      </tbody>
    </table>
    `;
    const divider = document.createElement("div");
    divider.className = "divider"
    divider.innerHTML=`
        <div class="w-[50%] border-t-4 border-t-blue-600"></div>
        <div class="w-[50%] border-t-4 border-t-blue-400"></div>
    `;
    const body = document.createElement("div");
    body.className = "body border-b border-b-blue-500";
    const footer = document.createElement("div");
    footer.classList.add("footer");
    footer.innerHTML = `<span class="page-num"><span> 페이지 </span><span> ${this.answerSheets.children.length} </span></span>`;
    answerSheet.appendChild(header);
    answerSheet.appendChild(divider);
    answerSheet.appendChild(body);
    answerSheet.appendChild(footer);
    this.position = body.getBoundingClientRect().x;
    return body;
  }

  addAnswer(pTag: Element) {
    this.currentSheet.appendChild(pTag);
    const rect = pTag.getBoundingClientRect();
    const x = rect.x - this.position;
    if (x > 700 || (x > 300 && rect.width > 600)) {
      this.currentSheet.removeChild(pTag);
      this.currentSheet = this._addAnswerSheet();
      this.currentSheet.appendChild(pTag);
    }
  }

  checkBlankPage() {
    if(this.answerSheets.children.length % 2 > 0){
      this.addBlankPage();
    }
  }

  addBlankPage() {
    // 페이징 겉장 만들어 주기
    const blankSheet = document.createElement("div");
    blankSheet.classList.add("page");
    blankSheet.innerHTML = `&nbsp;`;
    this.answerSheets.appendChild(blankSheet);
  }

}

export default SolutionSheetManager;
