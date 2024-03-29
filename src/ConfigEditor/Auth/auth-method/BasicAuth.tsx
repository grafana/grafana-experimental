import React from 'react';
import { cx, css } from '@emotion/css';
import { InlineField, Input, PopoverContent, SecretInput } from '@grafana/ui';
import { useCommonStyles } from '../styles';

export type Props = {
  user?: string;
  passwordConfigured: boolean;
  userTooltip?: PopoverContent;
  passwordTooltip?: PopoverContent;
  onUserChange: (user: string) => void;
  onPasswordChange: (password: string) => void;
  onPasswordReset: () => void;
  readOnly: boolean;
};

export const BasicAuth: React.FC<Props> = ({
  user,
  passwordConfigured,
  userTooltip = 'The username of the data source account',
  passwordTooltip = 'The password of the data source account',
  onUserChange,
  onPasswordChange,
  onPasswordReset,
  readOnly,
}) => {
  const commonStyles = useCommonStyles();
  const styles = {
    lastInlineField: css({
      marginBottom: 0,
    }),
  };
  return (
    <>
      <InlineField
        className={commonStyles.inlineFieldNoMarginRight}
        label="User"
        labelWidth={24}
        tooltip={userTooltip}
        required
        htmlFor="basic-auth-user-input"
        interactive
        grow
        disabled={readOnly}
      >
        <Input
          id="basic-auth-user-input"
          placeholder="User"
          value={user}
          onChange={(e) => onUserChange(e.currentTarget.value)}
          required
        />
      </InlineField>
      <InlineField
        className={cx(
          commonStyles.inlineFieldNoMarginRight,
          commonStyles.inlineFieldWithSecret,
          styles.lastInlineField
        )}
        label="Password"
        labelWidth={24}
        tooltip={passwordTooltip}
        required
        htmlFor="basic-auth-password-input"
        interactive
        grow
        disabled={readOnly}
      >
        <SecretInput
          id="basic-auth-password-input"
          isConfigured={passwordConfigured}
          onReset={readOnly ? () => {} : onPasswordReset}
          placeholder="Password"
          onChange={(e) => onPasswordChange(e.currentTarget.value)}
          required
        />
      </InlineField>
    </>
  );
};
