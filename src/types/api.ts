// src/types/api.ts

export type ApiResponse<T> = {
  message: string;
  data: T;
};

export type PaginatedResponse<T> = {
  message: string;
  data: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
};