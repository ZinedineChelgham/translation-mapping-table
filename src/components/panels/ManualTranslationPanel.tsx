import React, { useMemo } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { DoubleEntryTranslationsTable } from '../../../../../work/translation-table/src/table/DoubleEntryTranslationsTable';
import { Button } from '@mui/material';
import { AppTreeRetreiver } from '../../interface/AppTreeRetreiver';
import { BrowserAppTreeRetreiver } from '../../impl/BrowserAppTreeRetreiver';
import {FileUploadComponent} from "../../../../../work/translation-table/src/table/FileUploadComponent";

interface ManualTranslationPanelProps {
  initialData: Record<string, Record<string, unknown>>;
  onTranslationChange: (
    translation: Record<string, Record<string, unknown>>,
  ) => void;
  onUploadTranslationClick: () => void;
  onDownloadTranslationClick: () => void;
  showAlert: (severity: string, biMsgkey: string) => void;
}

/**
 * Manual translation panel UI
 * @param {ManualTranslationPanelProps} props
 * @return {JSX.Element}
 */
function ManualTranslationPanel(
  props: ManualTranslationPanelProps,
): JSX.Element {
  const {
    initialData,
    onTranslationChange,
    onUploadTranslationClick,
    onDownloadTranslationClick,
    showAlert,
  } = props;
  const browserAppTreeRetreiver: AppTreeRetreiver = useMemo(
    () => new BrowserAppTreeRetreiver(),
    [],
  );

  const handleFileSubmit = async (file: File) => {
    if (!file) {
      return;
    }
    if (file.type !== 'application/json') {
      return;
    }
    try {
      const tree = await browserAppTreeRetreiver.getTranslationTreeFromFile(
        file,
      );
      onTranslationChange(tree as Record<string, Record<string, unknown>>);
    } catch (error: any) {
      showAlert(
        'error',
        'dashboard.layout.translation.manual.translation_submit_error',
      );
    }
  };

  return (
    <Grid2
      container
      direction={'column'}
      spacing={2}
      flexWrap={'nowrap'}
      justifyContent={'space-between'}
      width={'100%'}
      height={'100%'}
    >
      <Grid2 xs={12}>
        <DoubleEntryTranslationsTable
          data={initialData}
          onDataChange={onTranslationChange}
          showAlert={props.showAlert}
        />
        <Grid2 xs={4} marginTop={'1rem'}>
         < />


        </Grid2>
      </Grid2>

      <Grid2 xs={12} alignSelf={'flex-end'}>
        <Grid2
          container
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          wrap={'nowrap'}
        >
          <Grid2>
            <Button
              size="small"
              variant="contained"
              onClick={onUploadTranslationClick}
            >
              {"upload"}
            </Button>
          </Grid2>

          <Grid2>
            <Button
              size="small"
              variant="contained"
              onClick={onDownloadTranslationClick}
            >
              {"download"}
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export type { ManualTranslationPanelProps };
export { ManualTranslationPanel };
