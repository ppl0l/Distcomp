export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  field: string;
  order: 'ASC' | 'DESC';
}

export interface FilterOptions {
  [key: string]: any;
}

export interface IRepository<T> {
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<T | null>;
  findAll(pagination?: PaginationOptions, sort?: SortOptions, filters?: FilterOptions): Promise<[T[], number]>;
}