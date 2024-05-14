import { css, cx } from '@emotion/css';
import React, { useCallback } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

export interface SpaceProps {
  v?: number;
  h?: number;
  layout?: 'block' | 'inline';
}

/**
 * @deprecated use the Space component from @grafana/ui instead. Available starting from @grafana/ui@10.4.0
 */
export const Space = ({
  v = 0,
  h = 0,
  layout = 'block',
}: SpaceProps) => {
  const styles = useStyles2(useCallback((theme) => getStyles(theme, {
    v,
    h,
    layout,
  }), [v, h, layout]));

  return <span className={cx(styles.wrapper)} />;
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
