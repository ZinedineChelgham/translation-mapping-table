interface FileGenerator {
  generateFile(fileName: string, rawData: any, options?: any): void;
}

export type { FileGenerator };
