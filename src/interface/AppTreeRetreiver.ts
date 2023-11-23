interface AppTreeRetreiver {
  getAppTree(): Record<string, Record<string, unknown>>;
  getTranslationTreeFromFile(
    file: File | null,
  ): Promise<Record<string, Record<string, unknown>>>;
}

export type { AppTreeRetreiver };
