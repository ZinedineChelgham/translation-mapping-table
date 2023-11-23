interface TranslationsFetcher {
  DEEPL_AUTH_KEY: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceLangValues: string[];
  fetchTranslations(): Promise<{ text: string }[]>;
}

export type { TranslationsFetcher };
