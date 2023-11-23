import { BrowserTranslationsFetcher } from './BrowserTranslationsFetcher';

const DEEPL_AUTH_KEY = 'ad508369-2b75-40c5-990c-61e8594109e4:fx';

/**
 * Translates the given values from the source language to the target language.
 * @param {string} sourceLangValues - The values to translate
 * @param {string} sourceLang - The source language
 * @param {string} targetLang - The target language
 * @param {string} canUseDeepl - Whether to use deepl or not
 * @return {string[]}  The translated values
 */
async function fetchTranslationsForTargetLanguage(
  sourceLangValues: string[],
  sourceLang: string,
  targetLang: string,
  canUseDeepl: boolean,
): Promise<{ text: string }[]> {
  const translationFetcher = new BrowserTranslationsFetcher(
    DEEPL_AUTH_KEY,
    sourceLang,
    targetLang,
    sourceLangValues,
    canUseDeepl,
  );
  return translationFetcher.fetchTranslations();
}

/**

Processes and fills a nested translation file with translations.
@param {Record<string, any>} sourceTranslations - The source translations as a nested JSON object.
@param {Record<string, any>} targetTranslations - The target translations object to be filled.
@param {string} sourceLang - The source language of the translations.
@param {string} targetLang - The target language for translation.
@param {boolean} canUseDeepl - Specifies whether to use Deepl for translation.
@return {Promise<void>} - A promise that resolves when the targetTranslations object is filled with translations.
*/
async function processAndFillNestedJson(
  sourceTranslations: Record<string, any>,
  targetTranslations: Record<string, any>,
  sourceLang: string,
  targetLang: string,
  canUseDeepl: boolean,
) {
  const valuesToTranslate: string[] = []; // Array to store values for batch translation
  for (const key of Object.keys(sourceTranslations)) {
    const sourceValue = sourceTranslations[key];
    if (typeof sourceValue === 'object') {
      targetTranslations[key] = {};
      await processAndFillNestedJson(
        sourceValue,
        targetTranslations[key],
        sourceLang,
        targetLang,
        canUseDeepl,
      );
    } else {
      valuesToTranslate.push(sourceValue); // Add non-object values to the batch array
    }
  }

  if (valuesToTranslate.length > 0) {
    try {
      const translatedValues = await fetchTranslationsForTargetLanguage(
        valuesToTranslate,
        sourceLang,
        targetLang,
        canUseDeepl,
      );
      let index = 0;
      for (const key of Object.keys(sourceTranslations)) {
        const sourceValue = sourceTranslations[key];
        if (typeof sourceValue !== 'object') {
          targetTranslations[key] = translatedValues[index].text;
          index++;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * Generate the translation file by populating the @translations Obj
 * for each target language based on the source language.
 * The translation file is then generated with the updated translation object.
 * @param {object} translations The object containing the translations for each language
 * @param {string} sourceLanguage The language that will be used as the source for the translations
 * @param {string[]} targetLanguages The languages that will be translated
 * @param {boolean} useDeepl Whether or not to use deepl to translate the values (juridical reasons)
 */
async function generateTranslationFile(
  translations: Record<string, any>,
  sourceLanguage: string,
  targetLanguages: string[],
  useDeepl: boolean,
): Promise<any> {
  const taggedVariables = Object.keys(translations[sourceLanguage]);
  const sourceLanguageTranslations: string[] = Object.values(
    translations[sourceLanguage],
  );

  if (taggedVariables.length !== sourceLanguageTranslations.length) {
    console.error(
      'the tagged variables and the original exported file values are not the same length',
    );
    process.exit(1);
  }

  const containsObject = sourceLanguageTranslations.some(
    (obj) => typeof obj === 'object',
  );

  for (const targetLang of targetLanguages) {
    translations[targetLang] = {};
    try {
      if (containsObject) {
        await processAndFillNestedJson(
          translations[sourceLanguage],
          translations[targetLang],
          sourceLanguage,
          targetLang,
          useDeepl,
        );
      } else {
        await fillTranslationsForTargetLanguage(
          translations,
          sourceLanguage,
          targetLang,
          useDeepl,
          taggedVariables,
          sourceLanguageTranslations,
        );
      }
    } catch (error) {
      // Handle the error here
      console.error(
        `An error occurred while processing translations for target language ${targetLang}:`,
        error,
      );
    }
  }

  return translations;
}

/**
 * Fills translations for the target language in a nested JSON object.
 *
 * @param {Record<string, Record<string, any>>} translations - The translations object with nested structure.
 * @param {string} sourceLanguage - The source language of the translations.
 * @param {string} targetLanguage - The target language for translation.
 * @param {boolean} canUseDeepl - Specifies whether to use Deepl for translation.
 * @param {string[]} taggedVariables - An array of tagged variables used in the translations.
 * @param {string[]} sourceLanguageTranslations - An array of source language translations.
 * @return {Promise<void>} - A promise that resolves when the translations for the target language are filled.
 */
async function fillTranslationsForTargetLanguage(
  translations: Record<string, Record<string, any>>,
  sourceLanguage: string,
  targetLanguage: string,
  canUseDeepl: boolean,
  taggedVariables: string[],
  sourceLanguageTranslations: string[],
) {
  try {
    const targetLangTranslations = await fetchTranslationsForTargetLanguage(
      sourceLanguageTranslations,
      sourceLanguage,
      targetLanguage,
      canUseDeepl,
    );
    taggedVariables.forEach((key, i) => {
      translations[targetLanguage][key] = targetLangTranslations[i];
    });
  } catch (error) {
    console.error(
      `An error occurred while processing translations for target language ${targetLanguage}:`,
      error,
    );
  }
}

export { generateTranslationFile };
