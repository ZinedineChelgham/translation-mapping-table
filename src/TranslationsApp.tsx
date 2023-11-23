import React from 'react';
import { useState, useMemo } from 'react';
import { FileGenerator } from './interface/FileGenerator';
import { BrowserFileGenerator } from '../../../work/translation-table/src/table/BrowserFileGenerator';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AppTreeRetreiver } from './interface/AppTreeRetreiver';
import { BrowserAppTreeRetreiver } from './impl/BrowserAppTreeRetreiver';
import { processTargetExportFile } from './impl/ConfigElementsTreeParser';
import { generateTranslationFile } from './impl/Translator';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { TranslationAppAlert } from '../../../work/translation-table/src/table/TranslationAppAlert';
import { ConfigSaver } from './impl/ConfigSaver';
import { DataPresenter } from '../../../work/translation-table/src/table/DataPresenter';
import { PanelFactory } from './components/panels/PanelFactory';
import { AlertColor } from '@mui/material';

/**
 * translationsApp is the app that allows the user to edit the translations
 * @return {JSX.Element}
 * @constructor
 * @param {number} layoutId
 * @return {JSX.Element}
 */
function TranslationsApp({
  layoutId,
}: {
  layoutId: string | number;
}): JSX.Element {
  const dataPresenter = useMemo(() => new DataPresenter(), []);
  const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de'];
  const defaultHelperTranslations = {
    en: {
      exempleProperty: 'exemple value',
      exempleObject: {},
    },
  };
  const initialTranslationsDatas = dataPresenter.sortJSONbyLanguages(
    structuredClone(defaultHelperTranslations),
  );

  const [translationsDatas, setTranslationsDatas] = useState(
    initialTranslationsDatas,
  );

  const fileGenerator: FileGenerator = new BrowserFileGenerator(); // useMemo
  const [panelValue, setPanelValue] = useState(0);
  const [showAlert, setShowAlert] = useState<{
    severity: string;
    biMsgkey: string;
  } | null>(null);
  const browserAppTreeRetreiver: AppTreeRetreiver = useMemo(
    () => new BrowserAppTreeRetreiver(),
    [],
  );
  const configSaver: ConfigSaver = useMemo(() => new ConfigSaver(), []);

  const handlePanelChange = (e: React.SyntheticEvent, newValue: number) => {
    setPanelValue(newValue);
  };
  const handleTranslationDatasChange = (
    translation: Record<string, Record<string, unknown>>,
  ) => {
    setTranslationsDatas(dataPresenter.sortJSONbyLanguages(translation));
  };


  const handleCloseAlert = () => {
    setShowAlert(null);
  };

  const handleShowAlert = (severity: string, biMsgkey: string) => {
    setShowAlert({ severity, biMsgkey });
  };

  const handleManualTranslationUpload = async () => {
    try {
      await configSaver.saveTranslations(layoutId, translationsDatas);
    } catch (e) {
      handleShowAlert(
        'error',
        'dashboard.layout.translation.error_translation_save',
      );
      return;
    }
    handleShowAlert('success', 'dashboard.layout.translation_upload_success');
  };

  const genTranslationFileName = () => {
    const appTree = browserAppTreeRetreiver.getAppTree(); // App name will always be the first property of the first language because of DataPresenter.sortJSONbyLanguages
    const appName = appTree.config.businessapp_name as string;
    return `${appName.replace(/^\$\/(.*)\/$/, '$1')}_translation.json`;
  };

  const handleDownloadTranslation = () => {
    fileGenerator.generateFile(genTranslationFileName(), translationsDatas);
  };

  return (
    <>
      <Grid2
        container
        direction={'column'}
        width={'80vw'}
        height={'80vh'}
        sx={{ flexWrap: 'nowrap !important' }}
        spacing={3}
      >
        {showAlert ? (
          <TranslationAppAlert
            severity={showAlert.severity as AlertColor}
            biMsgkey={showAlert.biMsgkey}
            open={showAlert !== null}
            onClose={handleCloseAlert}
          />
        ) : (
          <React.Fragment />
        )}
        <Grid2>
          <Tabs
            value={panelValue}
            onChange={handlePanelChange}
            aria-label="translation app tabs"
          >
            <Tab label={"manual"} />
            <Tab label={"automatic"} />
          </Tabs>
        </Grid2>

        <PanelFactory
          panelIndex={panelValue}
          manualTranslationPanelProps={{
            initialData: translationsDatas,
            onTranslationChange: handleTranslationDatasChange,
            onUploadTranslationClick: handleManualTranslationUpload,
            onDownloadTranslationClick: handleDownloadTranslation,
            showAlert: handleShowAlert,
          }}
          autoTranslationPanelProps={{
            languages: SUPPORTED_LANGUAGES,
            showAlert: handleShowAlert,
          }}
        />
      </Grid2>
    </>
  );
}

export { TranslationsApp };
