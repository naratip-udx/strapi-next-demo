export interface Thumbnail {
  id: number;
  documentId: string;
  name: string;
  url: string;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
}

export interface Blog {
  id: number;
  documentId: string;
  title: string;
  description: string;
  publishedAt: string;
  author?: Author;
  thumbnail?: Thumbnail;
}

export interface ApiBlogsResponse {
  data: Blog[];
};

export interface ApiBlogResponse {
  data: Blog;
};

export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
}

export interface ApiErrorResponse {
  error: {
    status: number;
    name: string;
    message: string;
  };
}
