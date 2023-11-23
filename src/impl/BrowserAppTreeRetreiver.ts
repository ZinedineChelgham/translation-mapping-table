import { AppTreeRetreiver } from '../interface/AppTreeRetreiver';
import { businessappManager } from '../../../../../bi.businessapp/managers/businessapp';

/**
 * App configuration retreiver
 */
class BrowserAppTreeRetreiver implements AppTreeRetreiver {
  /**
   * Get the app config tree
   * @return {any}
   */
  getAppTree(): any {
    const elems = Object.values(businessappManager.element_instances);
    console.log(elems);
    const elemsWithoutDupplicate = elems.reduce((acc: any, elem: any) => {
      if (!acc.find((e: any) => e.id === elem.id)) {
        acc.push(elem);
      }
      return acc;
    }, []);

    const appConfig = { ...businessappManager.cache.app_info };
    return { elements: elemsWithoutDupplicate, config: appConfig };
  }

  /**
   * @param {File} file - The file to parse
   * @return {Record<string, Record<string, unknown>>} - The translation tree
   * @memberof BrowserAppTreeRetreiver
   */
  async getTranslationTreeFromFile(file: File): Promise<any> {
    if (!file) {
      return {};
    }
    const fileContent = await file.text();
    const translationObj: Record<string, Record<string, unknown>> = JSON.parse(
      fileContent,
    );
    return translationObj;
  }
}

export { BrowserAppTreeRetreiver };
