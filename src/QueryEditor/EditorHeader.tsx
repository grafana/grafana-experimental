import { css } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

interface EditorHeaderProps {}

export const EditorHeader = ({ children }: React.PropsWithChildren<EditorHeaderProps>) => {
  const styles = useStyles2(getStyles);

  return <div className={styles.root}>{children}</div>;
};

const getStyles = (theme: GrafanaTheme2) => ({
  root: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(3),
    minHeight: theme.spacing(4),
  }),
});
