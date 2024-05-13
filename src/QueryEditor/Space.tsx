import { css, cx } from '@emotion/css';
import React from 'react';

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
  const styles = useStyles2(getStyles, v, h, layout);

  return <span className={cx(styles.wrapper)} />;
};

const getStyles = (theme: GrafanaTheme2, v: SpaceProps['v'], h: SpaceProps['v'], layout: SpaceProps['layout']) => ({
  wrapper: css([
    {
      paddingRight: theme.spacing(h ?? 0),
      paddingBottom: theme.spacing(v ?? 0),
    },
    layout === 'inline' && {
      display: 'inline-block',
    },
    layout === 'block' && {
      display: 'block',
    },
  ]),
});
