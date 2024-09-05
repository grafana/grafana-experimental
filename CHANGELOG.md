# Change Log

All notable changes to this project will be documented in this file.

## v2.0.0

- Auth: Refactoring and renaming some inputs so this can be a breaking change

## v1.8.0

- Auth: add ability to customize labels and placeholders for user/password fields

## v1.7.13

- Switched from "react-beautiful-dnd" to "@hello-pangea/dnd"

## v1.7.12

- Auth: Fix "TLS Client Authentication" fields are not being cleared when setting is toggled off

## v1.7.11

- Replace usage of React's deprecated `defaultProps`

## v1.7.10

- Tweaks in type definitions for the `SQLEditor` component on the `blur` method

## v1.7.9

- Fix bug in `OperationEditor` component causing re-mounting issue
- Update e2e selectors in `LabelFilters` to ensure easy testing

## v1.7.8

- Fix bug in `LabelFilters` component that caused creating incorrect query

## v1.7.7

- Remove a need to pass `innerQueryPlaceholder` prop to `OperationHeader`, `OperationList` and `OperationListExplained` and instead specify it in QueryModeller

## v1.7.6

- Release Visual query builder components

## v1.7.5

- Add new ConfigDescriptionLink component

## v1.7.4

- Add support for filtered vector search
- Handle error messages in OpenAI chat completion streams
- Fix expected field names in type in health check details
- LLM: use new, more detailed health check results

## v1.7.3

- Add UUID to streaming OpenAI requests
- Add health check in enabled functions

## v1.7.2

- Fix API return code matching in vector search support

## v1.7.1

- Add vector search support for LLM integration

## v1.7.0

- Add experimental LLM support

## v1.6.2

- #Feature: Allow customizing the list of built-in authentication methods

## v1.6.1

- Fix type changes in EditorList

## v1.6.0

- Add new `ConnectionSettings` and `AdvancedHttpSettings` components to simplify migration from `DataSourceHttpSettings` component.
- Improve docs for some components.

## v1.5.1

- Fix Auth component to prevent it from failing when it is used in Grafana 8

## v1.5.0

- Introduce treeshaking by rewriting rollup build configs to include both cjs and esm builds

## v1.4.3

- `Auth` and `DataSourceDescription` components: change asterisk color (for marking required fields) from red to default

## v1.4.2

- Update `GenericConfigSection` component type for prop `description` to `ReactNode`

## v1.4.1

- Fix types for `Auth` component - allow any `jsonData`

## v1.4.0

- `DataSourceDescription` config editor component: added possibility to pass `className` + minor styling changes

## v1.3.0

- Add Auth component

## v1.2.0

- Add new ConfigSection, ConfigSubSection and DataSourceDescription components

## v1.1.0

- EditorList now accepts a ref to the Button for adding items

## v1.0.2

- Make EditorField tooltip selectable via keyboard

## v1.0.1

- Specify Grafana packages as dev- and peer dependencies

## v1.0.0

- Add back QueryEditor components

## v0.0.1

- Initial Release
