import { css, cx } from '@emotion/css';
import React, { useCallback } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

export interface SpaceProps {
  v?: number;
  h?: number;
  layout?: 'block' | 'inline';
}

export const Space = (props: SpaceProps) => {
  const styles = useStyles2(useCallback((theme) => getStyles(theme, props), [props]));

  return <span className={cx(styles.wrapper)} />;
};

Space.defaultProps = {
  v: 0,
  h: 0,
  layout: 'block',
};

const getStyles = (theme: GrafanaTheme2, props: SpaceProps) => ({
  wrapper: css([
    {
      paddingRight: theme.spacing(props.h ?? 0),
      paddingBottom: theme.spacing(props.v ?? 0),
    },
    props.layout === 'inline' && {
      display: 'inline-block',
    },
    props.layout === 'block' && {
      display: 'block',
    },
  ]),
});
