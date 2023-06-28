# Connection

Contains components to be used for datasource connection configuration.

## ConnectionSettings

### Overview

`ConnectionSettings` component is used to simplify migrating from legacy `DataSourceHttpSettings` component.
Currently renders as a config section with only on field for the URL.

`ConnectionSettings` has the following properties type:

```ts
type Props = {
  // This is passed as `props.options` to datasource's ConfigEditor component
  config: DataSourceConfig;

  // This is passed as `props.onOptionsChange` to datasource's ConfigEditor component
  onChange: DataSourceConfigOnChangeHandler;

  // Optional description for the config section
  description?: ReactNode;

  // Optional  placeholder for the URL input
  urlPlaceholder?: string;

  // Optional tooltip for the URL input
  urlTooltip?: PopoverContent;

  // Optional label for the URL input
  urlLabel?: string;

  // Optional className
  className?: string;
};
```

### Usage

The common scenario if you are just replacing the legacy `DataSourceHttpSettings` component is as simple as:

```tsx
import {ConnectionSettings} from '@grafana/experimental'


export const ConfigEditor = (props: Props) => {

  return (
    {/* ... */}

    <ConnectionSettings
      config={props.options}
      onChange={props.onOptionsChange}
    />

    {/* ... */}
  )
}
```

### How it looks like

<img src="./docs-img/connection-settings.png" width="600">
