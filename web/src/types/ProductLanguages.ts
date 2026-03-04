export interface ProductLanguages {
  [language: string]: {
    [id: number]: {
      name: string;
      description: string;
    };
  };
}