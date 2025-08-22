// 교재 관련 타입 정의

export interface Textbook {
  id: string;
  title: string;
  publisher: string;
  author: string;
  isbn?: string;
  grade: string;
  subject: string;
  coverImage?: string;
  description?: string;
  totalChapters: number;
  totalProblems: number;
  publishedYear?: number;
  price?: number;
  status: 'active' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

export interface TextbookCreateInput {
  title: string;
  publisher: string;
  author: string;
  isbn?: string;
  grade: string;
  subject: string;
  coverImage?: string;
  description?: string;
  publishedYear?: number;
  price?: number;
}

export interface TextbookUpdateInput extends Partial<TextbookCreateInput> {
  status?: 'active' | 'discontinued';
}

export interface TextbookChapter {
  id: string;
  textbookId: string;
  chapterNumber: number;
  title: string;
  description?: string;
  startPage?: number;
  endPage?: number;
  problemCount: number;
  topics: string[];
  createdAt: string;
  updatedAt: string;
}