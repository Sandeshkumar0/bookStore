export interface User {
  id: string;
  fullname: string;
  email: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface Book {
  _id: string;
  name: string;
  title: string;
  image: string;
  price: number;
  category: string;
}

export interface CatalogResponse {
  books: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    categories: string[];
    sort: string;
  };
}

export interface AuthResponse extends Session {
  message: string;
}

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}
