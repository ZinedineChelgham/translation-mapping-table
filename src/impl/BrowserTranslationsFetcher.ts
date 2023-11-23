import { TranslationsFetcher } from '../interface/TranslationsFetcher';

/**
 * Has the responsability to fetch the translations by calling the DeepL API.
 */
class BrowserTranslationsFetcher implements TranslationsFetcher {
  /**
   * Creates an instance of BrowserTranslationsFetcher.
   * @param {string} DEEPL_AUTH_KEY - DeepL API key
   * @param {string} sourceLanguage - Source language
   * @param {string} targetLanguage - Target language
   * @param {string[]} sourceLangValues - Source language values
   * @param {boolean} canUseDeepl - Can use DeepL for the translations
   */
  constructor(
    public DEEPL_AUTH_KEY: string,
    public sourceLanguage: string,
    public targetLanguage: string,
    public sourceLangValues: string[],
    public useDeepl: boolean,
  ) {}

  /**
   * Fetches the translations by calling the DeepL API.
   * @return {Promise<{string }[]>} - The translations
   */
  async fetchTranslations(): Promise<{ text: string }[]> {
    if (!this.useDeepl || this.sourceLangValues.length === 0) {
      return new Array(this.sourceLangValues.length).fill('');
    }
    if (this.targetLanguage === 'en') this.targetLanguage = 'en-GB';
    const texts = this.sourceLangValues
      .map((text) => `text=${encodeURIComponent(text)}`)
      .join('&');
    const url = `https://api-free.deepl.com/v2/translate
      ?auth_key=${this.DEEPL_AUTH_KEY}
      &${texts}
      &source_lang=${this.sourceLanguage}
      &target_lang=${this.targetLanguage}`;

    const response = await fetch(url);
    const data = await response.json();
    const result = data.translations;

    const translatedValues = result.map(
      (translation: { text: string }) => translation.text,
    );

    if (translatedValues.length !== this.sourceLangValues.length) {
      console.error(
        'the tagged variables and the original exported file values are not the same length',
      );
      throw new Error('Length mismatch');
    }

    return translatedValues;
  }
}

export { BrowserTranslationsFetcher };
