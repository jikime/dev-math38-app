import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import type { BookGroupStats, SkillChapter } from "@/types/cloud"

interface StatsChartsProps {
  bookGroupStats: BookGroupStats | null
  skillChapters: SkillChapter[] | null
  statsData: any[] | null
}

export function StatsCharts({ bookGroupStats, skillChapters, statsData }: StatsChartsProps) {
  // 난이도별 분포 데이터 생성
  const getDifficultyData = () => {
    const difficultyMap: Record<string, string> = {
      '1': '최하',
      '2': '하', 
      '3': '중',
      '4': '상',
      '5': '최상'
    };
    
    const difficultyGroups = bookGroupStats?.problems.reduce((acc, problem) => {
      const difficulty = problem.difficulty || '미분류';
      const displayName = difficultyMap[difficulty] || difficulty;
      acc[displayName] = (acc[displayName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    // 순서대로 정렬
    const order = ['최하', '하', '중', '상', '최상'];
    const sortedData = order.map(name => ({
      name,
      count: difficultyGroups[name] || 0
    }));
    
    // 미분류나 기타 항목 추가
    Object.entries(difficultyGroups).forEach(([name, count]) => {
      if (!order.includes(name)) {
        sortedData.push({ name, count });
      }
    });
    
    return sortedData;
  };

  // 영역별 분포 데이터 생성
  const getLtypeData = () => {
    const ltypeMap: Record<string, string> = {
      'calc': '계산',
      'soln': '해결',
      'resn': '추론', 
      'unds': '이해'
    };
    
    const ltypeGroups = bookGroupStats?.problems.reduce((acc, problem) => {
      const ltype = problem.ltype || '미분류';
      const displayName = ltypeMap[ltype] || ltype;
      acc[displayName] = (acc[displayName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    const colors = [
      '#22C55E', // 계산 (초록)
      '#3B82F6', // 이해 (파랑)
      '#EAB308', // 해결 (노랑)
      '#F97316', // 추론 (주황)
      '#EF4444', // 미분류 (빨강)
    ];
    
    return Object.entries(ltypeGroups).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length]
    }));
  };

  // 단원별 분포 데이터 생성
  const getChapterData = () => {
    if (!statsData || !bookGroupStats) return [];

    // 챕터(부모)별로 하위 스킬들의 데이터를 집계
    const chartData = skillChapters?.map(chapter => {
      // 해당 챕터의 모든 스킬 ID 수집
      const chapterSkillIds = chapter.skills.map(skill => skill.skillId);
      
      // 해당 챕터의 모든 스킬들에 해당하는 문제들을 필터링
      const chapterProblems = bookGroupStats?.problems.filter(p => 
        chapterSkillIds.includes(p.skillId)
      ) || [];
      
      if (chapterProblems.length === 0) return null;

      // 챕터 전체의 난이도별 문제 수 집계
      const difficultyCount = chapterProblems.reduce((acc, problem) => {
        const difficulty = problem.difficulty || 'unclassified';
        acc[difficulty] = (acc[difficulty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = chapterProblems.length;

      return {
        name: chapter.title,
        total: total,
        level1: difficultyCount['1'] || 0,  // 최하
        level2: difficultyCount['2'] || 0,  // 하
        level3: difficultyCount['3'] || 0,  // 중
        level4: difficultyCount['4'] || 0,  // 상
        level5: difficultyCount['5'] || 0,  // 최상
        unclassified: difficultyCount['unclassified'] || 0,
        colorMap: {
          level1: '#3B82F6', // 최하 (파랑)
          level2: '#22C55E', // 하 (초록)
          level3: '#EAB308', // 중 (노랑)
          level4: '#F97316', // 상 (주황)
          level5: '#EF4444', // 최상 (빨강)
          unclassified: '#9CA3AF' // 미분류 (회색)
        }
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null && item.total > 0)
    .sort((a, b) => b.total - a.total) || [];

    return chartData;
  };

  const difficultyData = getDifficultyData();
  const ltypeData = getLtypeData();
  const chapterData = getChapterData();

  return (
    <ScrollArea className="h-[calc(100vh-320px)]">
      <div className="space-y-6 pb-6">
        {/* 난이도별 분포 및 영역별 분포 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 난이도별 분포 - 막대 차트 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">난이도별 분포</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={difficultyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-600" />
                <XAxis 
                  dataKey="name" 
                  className="dark:text-gray-300"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="dark:text-gray-300"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    border: '1px solid var(--border)',
                    borderRadius: '6px'
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="문항 수" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 영역별 분포 - 파이 차트 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">영역별 분포</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ltypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}문항`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ltypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 단원별 문항 분포 - 커스텀 수평 막대 차트 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">단원별 문항 수 분포</h3>
          <div className="space-y-4">
            {(() => {
              // 최대 문항 수 찾기 (상대적 너비 계산을 위해)
              const maxTotal = Math.max(...chapterData.map(item => item.total));
              
              return chapterData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  {/* 단원명과 문항수 */}
                  <div className="w-60 flex-shrink-0">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {item.name}
                    </div>
                  </div>
                  
                  {/* 막대 그래프 */}
                  <div className="flex-1 flex items-center gap-2">
                    {/* 전체 막대의 너비를 최대값 대비 비율로 설정 */}
                    <div 
                      className="h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative"
                      style={{ width: `${(item.total / maxTotal) * 100}%` }}
                    >
                      {(() => {
                        let currentPosition = 0;
                        const segments: React.ReactElement[] = [];
                        
                        (['level1', 'level2', 'level3', 'level4', 'level5', 'unclassified'] as const).forEach(type => {
                          if (item[type] > 0) {
                            const width = (item[type] / item.total) * 100;
                            segments.push(
                              <div 
                                key={type}
                                className="absolute h-full"
                                style={{ 
                                  backgroundColor: item.colorMap[type],
                                  left: `${currentPosition}%`,
                                  width: `${width}%`
                                }}
                              />
                            );
                            currentPosition += width;
                          }
                        });
                        
                        return segments;
                      })()}
                    </div>
                    
                    {/* 나머지 공간 */}
                    <div 
                      className="h-6"
                      style={{ width: `${((maxTotal - item.total) / maxTotal) * 100}%` }}
                    />
                    
                    {/* 총 문항수 */}
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                      {item.total}문항
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
          
          {/* 범례 */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">최하</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22C55E' }}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">하</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EAB308' }}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">중</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F97316' }}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">상</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EF4444' }}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">최상</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9CA3AF' }}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">미분류</span>
            </div>
          </div>
        </div>

        {/* 영역별 난이도 분포 및 문제 유형별 난이도 분포 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[35vh]">
          {/* 영역별 난이도 분포 - 스택 막대 차트 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">영역별 난이도 분포</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={(() => {
                  if (!bookGroupStats) return [];
                  
                  const ltypeMap: Record<string, string> = {
                    'calc': '계산',
                    'soln': '해결',
                    'resn': '추론', 
                    'unds': '이해'
                  };

                  const difficultyMap: Record<string, string> = {
                    '1': '최하',
                    '2': '하',
                    '3': '중',
                    '4': '상',
                    '5': '최상'
                  };

                  const ltypeGroups = bookGroupStats.problems.reduce((acc, problem) => {
                    const ltype = problem.ltype || 'unclassified';
                    const displayName = ltypeMap[ltype] || ltype;
                    const difficulty = problem.difficulty || 'unclassified';
                    const difficultyName = difficultyMap[difficulty] || difficulty;
                    
                    if (!acc[displayName]) {
                      acc[displayName] = { name: displayName, 최하: 0, 하: 0, 중: 0, 상: 0, 최상: 0, 미분류: 0 };
                    }
                    
                    if (difficultyName in acc[displayName]) {
                      acc[displayName][difficultyName as keyof typeof acc[typeof displayName]]++;
                    } else {
                      acc[displayName].미분류++;
                    }
                    
                    return acc;
                  }, {} as Record<string, any>);

                  return Object.values(ltypeGroups);
                })()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-600" />
                <XAxis 
                  dataKey="name" 
                  className="dark:text-gray-300"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="dark:text-gray-300"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    border: '1px solid var(--border)',
                    borderRadius: '6px'
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Legend />
                <Bar dataKey="미분류" stackId="a" fill="#9CA3AF" />
                <Bar dataKey="최하" stackId="a" fill="#3B82F6" />
                <Bar dataKey="하" stackId="a" fill="#22C55E" />
                <Bar dataKey="중" stackId="a" fill="#EAB308" />
                <Bar dataKey="상" stackId="a" fill="#F97316" />
                <Bar dataKey="최상" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 문제 유형별 난이도 분포 - 스택 막대 차트 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">문제 유형별 난이도 분포</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={(() => {
                  const difficultyMap: Record<string, string> = {
                    '1': '최하',
                    '2': '하',
                    '3': '중',
                    '4': '상',
                    '5': '최상'
                  };

                  // 기본적으로 객관식, 주관식 모두 표시 (데이터가 없어도)
                  const choiceGroups: Record<string, any> = {
                    '객관식': { name: '객관식', 최하: 0, 하: 0, 중: 0, 상: 0, 최상: 0, 미분류: 0 },
                    '주관식': { name: '주관식', 최하: 0, 하: 0, 중: 0, 상: 0, 최상: 0, 미분류: 0 }
                  };

                  // 실제 데이터가 있으면 집계
                  if (bookGroupStats) {
                    bookGroupStats.problems.forEach((problem) => {
                      const choiceType = problem.choiceType || 'unclassified';
                      const difficulty = problem.difficulty || 'unclassified';
                      const difficultyName = difficultyMap[difficulty] || difficulty;
                      
                      // choiceType 값에 따라 분류 (choice는 객관식, 그 외는 주관식으로 처리)
                      let displayName: string;
                      if (choiceType === 'choice') {
                        displayName = '객관식';
                      } else {
                        displayName = '주관식';
                      }
                      
                      if (choiceGroups[displayName]) {
                        if (difficultyName in choiceGroups[displayName]) {
                          choiceGroups[displayName][difficultyName]++;
                        } else {
                          choiceGroups[displayName].미분류++;
                        }
                      }
                    });
                  }

                  return Object.values(choiceGroups);
                })()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-600" />
                <XAxis 
                  dataKey="name" 
                  className="dark:text-gray-300"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="dark:text-gray-300"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    border: '1px solid var(--border)',
                    borderRadius: '6px'
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Legend />
                <Bar dataKey="미분류" stackId="a" fill="#9CA3AF" />
                <Bar dataKey="최하" stackId="a" fill="#3B82F6" />
                <Bar dataKey="하" stackId="a" fill="#22C55E" />
                <Bar dataKey="중" stackId="a" fill="#EAB308" />
                <Bar dataKey="상" stackId="a" fill="#F97316" />
                <Bar dataKey="최상" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}