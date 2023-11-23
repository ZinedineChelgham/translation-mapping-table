import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Tooltip } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { IconButton } from '@mui/material';

interface AutoCompleteWithHelperProps {
  languages: string[];
  multiple?: boolean;
  label: string;
  placeholder: string;
  value: AutocompleteValue; // Updated prop for the selected value
  onLanguageChange: (language: AutocompleteValue) => void; // Updated callback prop
  helperTxt?: string;
}

type AutocompleteValue = string | string[] | null;

/**
 * Type guard for autocomplete return value
 * @param {unknown} o
 * @return {boolean}
 */
function isAutocompleteValue(o: unknown): o is AutocompleteValue {
  return typeof o === 'string' || Array.isArray(o) || o === null;
}

/**
 * Customized autocomplete component
 * @param {CustomAutoCompleteProps} props
 * @return {JSX.Element}
 */
function AutoCompleteWithHelper(
  props: AutoCompleteWithHelperProps,
): JSX.Element {
  const {
    languages,
    multiple,
    label,
    placeholder,
    value,
    onLanguageChange,
    helperTxt,
  } = props;

  const handleOnChange = (newValue: AutocompleteValue) => {
    if (isAutocompleteValue(newValue)) {
      if (newValue === null || newValue === '' || newValue.length === 0) {
        onLanguageChange(value);
      } else {
        onLanguageChange(newValue);
      }
    }
  };

  return (
    <Grid2
      container
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      spacing={2}
    >
      <Grid2 xs={10}>
        <Autocomplete
          defaultValue={value}
          value={value} // Use the value prop from the parent component
          multiple={multiple}
          options={languages}
          onChange={(e, newValue) => handleOnChange(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={label}
              placeholder={placeholder}
            />
          )}
        />
      </Grid2>
      {helperTxt ? (
        <Grid2 xs={2}>
          <Tooltip title={helperTxt} placement="top">
            <IconButton>

            </IconButton>
          </Tooltip>
        </Grid2>
      ) : (
        <></>
      )}
    </Grid2>
  );
}

export type { AutocompleteValue };
export { AutoCompleteWithHelper };
