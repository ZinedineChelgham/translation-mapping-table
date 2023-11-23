import React from 'react';
import { AutoTranslationPanel } from './AutoTranslationPanel';
import { ManualTranslationPanel } from './ManualTranslationPanel';
import { AutoTranslationPanelProps } from './AutoTranslationPanel';
import { ManualTranslationPanelProps } from './ManualTranslationPanel';

interface PanelFactoryProps {
  panelIndex: number;
  manualTranslationPanelProps: ManualTranslationPanelProps;
  autoTranslationPanelProps: AutoTranslationPanelProps;
}

/**
 * Panel factory
 * @param {number} props panel index
 * @return {JSX.Element}
 */
function PanelFactory(props: PanelFactoryProps): JSX.Element {
  switch (props.panelIndex) {
    case 0:
      return <ManualTranslationPanel {...props.manualTranslationPanelProps} />;
    case 1:
      return <AutoTranslationPanel {...props.autoTranslationPanelProps} />;
    default:
      return <></>;
  }
}

export { PanelFactory };
