export interface DefaultStoreValues <T> {
  reset: () => void;
  updateItem: (key: keyof T, value: T[keyof T]) => void;
  populate?: (state: T) => void;
}