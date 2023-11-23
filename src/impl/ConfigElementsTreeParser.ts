const specialCases: string[] = [
  // Some properties that can be handled the same way
  'delete_modal',
  'delete_text',
  'submit_text',
  'cancel_text',
  'text',
  'button_text',
  'button_input_label',
  'x_text',
  'y_text',
];

/**
 * Creates a tag prefix based on the configuration object type and the element_id.
 * @param {Object} config - The configuration object.
 * @param {Object} element - The element object.
 * @return {string} The generated tag prefix.
 */
function createTagPrefix(config: any, element: any): string {
  switch (config.object) {
    case 'widget':
      return `Widget_${element.id}`; // Dont add the $/ because a widget is inside a page that already has a $/
    case 'page':
      return `$/Page_${element.id}`;
    case 'layout':
      return `$/Layout_${element.id}`;
  }
  return '';
}

/**
 * Checks the format of a tag, replaces spaces with underscores,
 * @param {string} tag - The tag to check and format.
 * @return {string} The formatted tag.
 */
function checkFormat(tag: string): string {
  return tag.replace(/\s/g, '_').replace('__', '_');
}

/**
 * Adds a prefix and postfix identification tag to a translatable label based on the configuration and element_id,
 * and checks the format of the resulting tag.
 * @param {string} label - The label to add the prefix and postfix to.
 * @param {Object} config - The configuration object.
 * @param {Object} element - The element object.
 * @return {string} The formatted tag with the added prefix and postfix.
 */
function addPrefixAndPostfix(label: string, config: any, element: any) {
  if (isAlreadyVariablified(label)) {
    return label;
  }
  const tagPrefix = createTagPrefix(config, element);
  if (config.object !== 'page') {
    return checkFormat(`$/Page_${element.parent.id}_${tagPrefix}_${label}/`);
  }
  return checkFormat(`${tagPrefix}_${label}/`);
}

/**
 * Check if a tag is already variablified.
 * @param {string} tag - The tag to check.
 * @return {boolean} - True if the tag is already variablified, false otherwise.
 */
function isAlreadyVariablified(tag: string): boolean {
  console.log(tag);
  return tag.startsWith('$/') || tag === '';
}

/**
 * Process special cases in the configuration and element object to generate some translations tags
 * and populate the translation object with the initial values of the App.
 * @param {Object} config - The configuration object.
 * @param {Object} element - The element object.
 * @param {Object} translations - The translation object.
 * @param {string} sourceLanguage - The source language of the App.
 */
function processSpecialCases(
  config: any,
  element: any,
  translations: any,
  sourceLanguage: string,
) {
  for (const prop in config) {
    if (prop.startsWith('notif_')) {
      const sourceValue = config[prop];
      if (sourceValue?.length > 0) {
        config[prop] = addPrefixAndPostfix(`${prop}`, config, element);
        const translationTag = config[prop].replace(/[$/]/g, '');
        translations[sourceLanguage][translationTag] = sourceValue;
      }
    } else if (specialCases.includes(prop)) {
      const sourceValue = config[prop];
      if (sourceValue?.length > 0) {
        config[prop] = addPrefixAndPostfix(`${prop}`, config, element);
        const translationTag = config[prop].replace(/[$/]/g, '');
        translations[sourceLanguage][translationTag] = sourceValue;
      }
    } else if (prop === 'tooltips') {
      config.tooltips = config.tooltips.map((tips: string) => {
        const sourceValue = tips;
        if (sourceValue?.length > 0) {
          const tag = addPrefixAndPostfix(`tooltip_${tips}`, config, element);
          const translationTag = tag.replace(/[$/]/g, '');
          translations[sourceLanguage][translationTag] = sourceValue;
          return tag;
        }
        return tips;
      });
    } else if (prop === 'actionOptions') {
      config.actionOptions = config.actionOptions.map((options: any) => {
        return Object.fromEntries(
          Object.entries(options).map(([key, val]) => {
            if ((val as string)?.startsWith('#')) return [key, val]; // Skip colors
            if ((val as string)?.length > 0) {
              options[key] = addPrefixAndPostfix(
                `actionOption_${key}`,
                config,
                element,
              );
              const translationTag = options[key].replace(/[$/]/g, '');
              translations[sourceLanguage][translationTag] = val;
            }
            return [key, options[key]];
          }),
        );
      });
    } else if (prop === 'advanced') {
      config.advanced = config.advanced.map((adv: any) => {
        if (adv?.category?.length > 0) {
          // Some advanced options don't have a category
          adv.category = addPrefixAndPostfix(
            `advanced_category_${config.advanced.indexOf(adv)}`,
            config,
            element,
          );
          const translationTag = adv.category.replace(/[$/]/g, '');
          translations[sourceLanguage][translationTag] = adv.category;
        }
        return adv;
      });
    } else if (prop === 'links') {
      config.links = config.links.map((link: any) => {
        const sourceValue = link.text;
        if (sourceValue?.length > 0) {
          link.text = addPrefixAndPostfix(
            `linktext_${link.label}`,
            config,
            element,
          );
          const translationTag = link.text.replace(/[$/]/g, '');
          translations[sourceLanguage][translationTag] = sourceValue;
        }
        return link;
      });
    } else if (prop === 'fields') {
      const fieldKeys = Object.keys(config.fields);
      for (const fieldKey of fieldKeys) {
        const fieldData = config.fields[fieldKey];
        if (fieldData.hasOwnProperty('label')) {
          const sourceValue = fieldData.label;
          if (sourceValue?.length > 0) {
            fieldData.label = addPrefixAndPostfix(
              fieldData.label,
              config,
              element,
            );
            const translationTag = fieldData.label.replace(/[$/]/g, '');
            translations[sourceLanguage][translationTag] = sourceValue;
          }
        }
      }
    } else if (prop === 'items') {
      config.items = config.items.map((item: any) => {
        const sourceValue = item.text;
        if (sourceValue?.length > 0) {
          item.text = addPrefixAndPostfix(
            `item_test_${item.text}`,
            config,
            element,
          );
          const translationTag = item.text.replace(/[$/]/g, '');
          translations[sourceLanguage][translationTag] = sourceValue;
        }
        return item;
      });
    }
  }
}

/**
 * Process a multiple select choices' property.
 * @param {Array} selectChoices - The array of select choices.
 * @param {Object} config - The configuration object.
 * @param {Object} element - The element object.
 * @param {Object} translations - The translations object.
 * @param {string} sourceLanguage - The source language of the App.
 * @return {Array} The processed array of select choices with translated labels and values.
 */
function processMultipleSelectChoices(
  selectChoices: any,
  config: any,
  element: any,
  translations: any,
  sourceLanguage: string,
) {
  return config.selectChoices.map((choices: any) => {
    return choices.map((choice: any) => {
      const { label, value } = choice;
      if (label === '' && value === '') return choice;
      const tmp = {
        label: addPrefixAndPostfix(`label_${label}`, config, element),
        value: addPrefixAndPostfix(`value_${value}`, config, element),
      };
      const translationTagLabel = tmp.label.replace(/[$/]/g, '');
      const translationTagValue = tmp.value.replace(/[$/]/g, '');
      translations[sourceLanguage][translationTagLabel] = label;
      translations[sourceLanguage][translationTagValue] = value;
      return tmp;
    });
  });
}

/**
 * Process an element by handling its configuration and generating translations of translatable properties.
 * @param {Object} element - The element object to be processed.
 * @param {Object} translations - The translations object that will be filled with the source language default values.
 * @param {String} sourceLanguage - Initial natural language used for the App .
 */
function processElement(
  element: any,
  translations: any,
  sourceLanguage: string,
) {
  const config = element.config;
  if (!config) return;
  processSpecialCases(config, element, translations, sourceLanguage);

  if (config.title) {
    const sourceValue = config.title;
    console.log(sourceValue);
    if (sourceValue?.length > 0) {
      config.title = addPrefixAndPostfix('title', config, element);
      console.log(sourceValue);

      const translationTag = config.title.replace(/[$/]/g, '');
      translations[sourceLanguage][translationTag] = sourceValue;
    }
  }

  if (config.labels) {
    config.labels = config.labels.map((label: string) => {
      const sourceValue = label;
      if (sourceValue?.length > 0) {
        label = addPrefixAndPostfix(`label_${label}`, config, element);
        const translationTag = label.replace(/[$/]/g, '');
        translations[sourceLanguage][translationTag] = sourceValue;
        return label;
      }
      return label;
    });
  }

  if (config.values) {
    config.values = config.values.map((value: string) => {
      const sourceValue = value;
      if (sourceValue?.length > 0) {
        value = addPrefixAndPostfix(`value_${value}`, config, element);
        const translationTag = value.replace(/[$/]/g, '');
        translations[sourceLanguage][translationTag] = sourceValue;
        return value;
      }
      return value;
    });
  }

  if (config.label) {
    const sourceValue = config.label;
    if (sourceValue?.length > 0) {
      config.label = addPrefixAndPostfix(
        `label_${config.label}, config, element`,
        config,
        element,
      );
      const translationTag = config.label.replace(/[$/]/g, '');
      translations[sourceLanguage][translationTag] = sourceValue;
    }
  }

  if (config.select_choices) {
    config.select_choices = processMultipleSelectChoices(
      config.select_choices,
      config,
      element,
      translations,
      sourceLanguage,
    );
  }
}

/**
 * Handle the business app name case because it is outside the elements array.
 * @param {Object} config - The configuration object.
 * @param {Object} translations - The translations object.
 * @param {String} sourceLanguage - Initial natural language used for the App.
 */
function handleBusinessAppName(
  config: any,
  translations: any,
  sourceLanguage: string,
) {
  if (isAlreadyVariablified(config.businessapp_name)) return;
  const sourceAppName = config.businessapp_name;
  config.businessapp_name = `$/App_${sourceAppName}/`.replace(/\s/g, '_');
  const translationTag = config.businessapp_name.replace(/[$/]/g, '');
  translations[sourceLanguage][translationTag] = sourceAppName;
}

/**
 * Process each element of the target export file.
 * @param {Object} originExport - the json to import
 * @param {Object} originTranslations - the translations
 * @param {String} sourceLanguage - the source language
 * @return {Object} the new json to import
 */
function processTargetExportFile(
  originExport: Record<string, Record<string, unknown>>,
  originTranslations: Record<string, Record<string, unknown>>,
  sourceLanguage: string,
): {
  processedTree: Record<string, Record<string, unknown>>;
  processedTranslations: Record<string, Record<string, unknown>>;
} {
  console.log('Processing target export file...');
  originTranslations[sourceLanguage]
    ? null
    : (originTranslations[sourceLanguage] = {}); // initialize the source language object if its not already initialized
  const elements = originExport.elements;

  Object.values(elements).forEach((element) => {
    processElement(element, originTranslations, sourceLanguage);
  });
  handleBusinessAppName(
    originExport.config,
    originTranslations,
    sourceLanguage,
  );
  return {
    processedTree: originExport,
    processedTranslations: originTranslations,
  };
}

export { processTargetExportFile };
