import { businessappManager } from '../../../../../bi.businessapp/managers/businessapp';
import { translationManager } from '../../../../../bi.businessapp/managers/translation';

/**
 * A class that saves the configuration of an app.
 */
class ConfigSaver {
  /**
   * Saves the configuration of an app.
   * @param {any} tree - The configuration tree of the app.
   * @return {Promise<boolean>} - A promise that resolves to a boolean indicating whether the configuration was successfully saved.
   */
  async saveAppConfig(tree: any): Promise<void> {
    const elements = tree.elements;
    elements.forEach(async (elem: any) => {
      const elementInstance = businessappManager.getElementInstance(elem.id);
      if (elementInstance) {
        try {
          await businessappManager.saveElement(
            tree.config.businessapp_id,
            elem.id,
            elem.config,
          );
        } catch (error) {
          throw new Error('Saving element failed');
        }
      }
    });
    // businessappManager.cache.app_info = { ...tree.config };
    if (tree.config.businessapp_id) {
      try {
        await businessappManager.saveAppName(
          tree.config.businessapp_id,
          tree.config.businessapp_name,
        );
      } catch (error) {
        throw new Error('Saving element failed');
      }
    }
  }

  /**
   * Saves the translations of an app.
   *
   * @param {number | string} id - The ID of the app.
   * @param {any} translationTree - The translation tree to be saved.
   * @return {Promise<boolean>} - A promise that resolves to a boolean indicating whether the translations were successfully saved.
   */
  async saveTranslations(
    id: number | string,
    translationTree: Record<string, Record<string, unknown>>,
  ): Promise<void> {
    const file = new File(
      [JSON.stringify(translationTree)],
      'translation.json',
    );

    const res = await businessappManager.saveElementFile(
      id,
      file,
      'translation',
    );
    translationManager.cache = { ...translationTree };
    if (!res.includes('translation')) {
      throw new Error('Saving translation failed');
    }
  }
}

export { ConfigSaver };
