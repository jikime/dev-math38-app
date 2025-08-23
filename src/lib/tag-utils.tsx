import { LeveledPaper, PaperType } from "@/components/new-paper/typings";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type columnTitle2 = { title: string; count: number; color: string };

export const ElementaryTag = () => {
  return <Badge variant="outline" className="border-green-500 text-green-700 dark:border-green-900/30 dark:text-green-400 hover:border-green-200 dark:hover:border-green-900/50">초등</Badge>
}
export const MiddleTag = () => {
  return <Badge variant="outline" className="border-purple-500 text-purple-700 dark:border-purple-900/30 dark:text-purple-400 hover:border-purple-200 dark:hover:border-purple-900/50">중등</Badge>
}
export const HighTag = () => {
  return <Badge variant="outline" className="border-pink-500 text-pink-700 dark:border-pink-900/30 dark:text-pink-400 hover:border-pink-200 dark:hover:border-pink-900/50">고등</Badge>
}

export const getSubjectTitle = (subjectId: number | null) => {
  if (!subjectId)
    return {
      title: "",
      color: "text-white",
      tag: <div className="text-white"> </div>,
    };
  if (subjectId === 5)
    return {
      title: "중1",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
      <MiddleTag />
      <div className="text-sm whitespace-nowrap">중1</div>
    </div>,
    };
  if (subjectId === 6)
    return {
      title: "중2",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
      <MiddleTag />
      <div className="text-sm whitespace-nowrap">중2</div>
    </div>,
    };
  if (subjectId === 7)
    return {
      title: "중3",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
          <MiddleTag />
          <div className="text-sm whitespace-nowrap">중3</div>
        </div>,
    };

  if (subjectId === 8)
    return {
      title: "수(상)",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
        <HighTag />
        <div className="text-sm whitespace-nowrap">수(상)</div>
      </div>,
    };
  if (subjectId === 9)
    return {
      title: "수(하)",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
        <HighTag />
        <div className="text-sm whitespace-nowrap">수(하)</div>
      </div>,
    };
  if (subjectId === 16)
    return {
      title: "공통수학1",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
        <HighTag />
        <div className="text-sm whitespace-nowrap">공통수학1</div>
      </div>,
    };
  if (subjectId === 17)
    return {
      title: "공통수학2",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
        <HighTag />
        <div className="text-sm whitespace-nowrap">공통수학2</div>
      </div>,
    };
  if (subjectId === 10)
    return {
      title: "수1",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
        <HighTag />
        <div className="text-sm whitespace-nowrap">수1</div>
      </div>,
    };
  if (subjectId === 11)
    return {
      title: "수2",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
        <HighTag />
        <div className="text-sm whitespace-nowrap">수2</div>
      </div>,
    };
  if (subjectId === 12)
    return {
      title: "미적",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
        <HighTag />
        <div className="text-sm whitespace-nowrap">미적</div>
      </div>,
    };
  if (subjectId === 13)
    return {
      title: "확통",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
        <HighTag />
        <div className="text-sm whitespace-nowrap">확통</div>
      </div>,
    };
  if (subjectId === 14)
    return {
      title: "기벡",
      color: "text-black",
      tag: <div className="flex items-center justify-center gap-2">
        <HighTag />
        <div className="text-sm whitespace-nowrap">기벡</div>
      </div>,
    };

  if (subjectId === 2)
    return {
      title: "초4",
      color: "text-purple-700",
      tag: <div className="flex items-center justify-center gap-2">
        <ElementaryTag />
        <div className="text-sm whitespace-nowrap">초4</div>
      </div>,
    };
  if (subjectId === 3)
    return {
      title: "초5",
      color: "text-purple-700",
      tag: <div className="flex items-center justify-center gap-2">
        <ElementaryTag />
        <div className="text-sm whitespace-nowrap">초5</div>
      </div>,
    };
  if (subjectId === 4)
    return {
      title: "초6",
      color: "text-purple-700",
      tag: <div className="flex items-center justify-center gap-2">
        <ElementaryTag />
        <div className="text-sm whitespace-nowrap">초6</div>
      </div>,
    };

  if (subjectId === 15)
    return {
      title: "모의고사",
      color: "text-red-700",
      tag: <div className="flex items-center justify-center gap-2">
        <HighTag />
        <div className="text-sm whitespace-nowrap">모의고사</div>
      </div>,
    };
  return {
    title: "",
    color: "text-white",
    tag: <div className="text-white"></div>,
  };
};

export const getProbleLevel2 = (text: string, count: number): columnTitle2 => {
  switch (text) {
    case "최상":
      return { title: "최상", count: count, color: "#F44336" };
    case "상":
      return { title: "상", count: count, color: "#FF9800" };
    case "중":
      return { title: "중", count: count, color: "#FFC107" };
    case "하":
      return { title: "하", count: count, color: "#8BC34A" };
    case "최하":
      return { title: "최하", count: count, color: "#4CAF50" };
    default:
      return { title: text, count: count, color: "#5D738C" };
  }
};

export const getLevelTags = (record: LeveledPaper) => {
  const tags: columnTitle2[] = [];
  if (record.level5 > 0) {
    tags.push(getProbleLevel2("최상", record.level5));
  }
  if (record.level4 > 0) {
    tags.push(getProbleLevel2("상", record.level4));
  }
  if (record.level3 > 0) {
    tags.push(getProbleLevel2("중", record.level3));
  }
  if (record.level2 > 0) {
    tags.push(getProbleLevel2("하", record.level2));
  }
  if (record.level1 > 0) {
    tags.push(getProbleLevel2("최하", record.level1));
  }

  return tags;
};

export const getLevelDisplay = (record: LeveledPaper) => {
  if (
    record.type === PaperType.addon_cs ||
    record.type === PaperType.addon_cw ||
    record.type === PaperType.addon_ps ||
    record.type === PaperType.addon_pw
  ) {
    return (
      <div
        style={{
          color: "#111",
        }}
      >
        개별 시험지
      </div>
    );
  }
  const tags: columnTitle2[] = getLevelTags(record);

  return (
    <TooltipProvider>
      <div className="flex justify-center gap-1">
        {tags.map((tag) => (
          <Tooltip key={tag.title}>
            <TooltipTrigger>
              <p
                className="relative cursor-pointer transition-opacity duration-200 hover:opacity-80 rounded-full text-sm"
                style={{
                  color: tag.color,
                }}
              >
                {tag.title}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tag.title}: {tag.count}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};