import React, { useEffect } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useState } from 'react';
import {
  AutocompleteValue,
  AutoCompleteWithHelper,
} from '../input/AutoCompleteWithHelper';
import { LoadingButton } from '@mui/lab';


interface AutoTranslationPanelProps {
  languages: string[];
  showAlert: (severity: string, biMsgkey: string) => void;
}

/**
 * Auto translation panel UI
 * @param {AutoTranslationPanelProps} props
 * @return {JSX.Element}
 */
function AutoTranslationPanel(props: AutoTranslationPanelProps): JSX.Element {
  const { languages, showAlert } = props;
  const [selectedSourceLanguage, setSelectedSourceLanguage] = useState<string>(
    // eslint-disable-next-line new-cap
    Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0],
  );

  const [selectedTargetLanguages, setSelectedTargetLanguages] = useState<
    string[]
  >([]);

  useEffect(() => {
    setSelectedTargetLanguages([...props.languages]);
  }, [props.languages]);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (file: File | null): void => {
    if (!file) {
      return;
    }
    if (file.type !== 'application/json') {
      return;
    }
    setUploadedFile(file);
  };
  const setSelectedSouceLangurageHandler = (language: AutocompleteValue) => {
    setSelectedSourceLanguage(language as string | '');
  };
  const setSelectedTargetLanguagesHandler = (languages: AutocompleteValue) => {
    setSelectedTargetLanguages(languages as string[]);
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
      <Grid2 container direction={'row'}>
        <Grid2 xs={12}>
          <AutoCompleteWithHelper
            value={selectedSourceLanguage}
            languages={languages}
            label={bi._(
              'dashboard.layout.translation.auto_panel.source_lang_autocomplete.label',
            )}
            placeholder={bi._(
              'dashboard.layout.translation.auto_panel.source_lang_autocomplete.placeholder',
            )}
            onLanguageChange={setSelectedSouceLangurageHandler}
            helperTxt={bi._(
              'dashboard.layout.translation.auto_panel.source_lang_autocomplete.helperTxt',
            )}
          />
        </Grid2>

        <Grid2 xs={12}>
          <AutoCompleteWithHelper
            value={selectedTargetLanguages.filter(
              (lang) => lang !== selectedSourceLanguage,
            )}
            multiple
            languages={languages}
            label={bi._(
              'dashboard.layout.translation.auto_panel.target_lang_autocomplete.label',
            )}
            placeholder={bi._(
              'dashboard.layout.translation.auto_panel.target_lang_autocomplete.placeholder',
            )}
            onLanguageChange={setSelectedTargetLanguagesHandler}
            helperTxt={bi._(
              'dashboard.layout.translation.auto_panel.target_lang_autocomplete.helperTxt',
            )}
          />
        </Grid2>

        <Grid2 xs={12}>
        File
        </Grid2>
      </Grid2>

      <Grid2 alignSelf={'flex-end'}>
        <LoadingButton
          size="small"
          variant="contained"
          loading={loading}
          loadingPosition="end"
          endIcon={<></>} // Necessary due to MUI lab package
          onClick={handleOnTranslateClick}
        >
          {bi._('dashboard.layout.translation.auto_panel.button.translate')}
        </LoadingButton>
      </Grid2>
    </Grid2>
  );
}

export type { AutoTranslationPanelProps };
export { AutoTranslationPanel };
