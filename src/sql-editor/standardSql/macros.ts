import { ArgType, MacroType } from "sql-editor/types";
import { MacrosRegistryItem } from "./types";

export const VALUE_MACROS: MacrosRegistryItem[] = [
  {
    id: "$__time(dateColumn)",
    name: "$__time(dateColumn)",
    text: "$__time",
    args: [ArgType.Column],
    type: MacroType.Value,
    description:
      "Will be replaced by an expression to convert to a UNIX timestamp and rename the column to time_sec. For example, UNIX_TIMESTAMP(dateColumn) as time_sec",
  },
  {
    id: "$__timeEpoch(dateColumn, )",
    name: "$__timeEpoch(dateColumn)",
    text: "$__timeEpoch",
    args: [ArgType.Column],
    type: MacroType.Value,
    description:
      "Will be replaced by an expression to convert to a UNIX timestamp and rename the column to time_sec. For example, UNIX_TIMESTAMP(dateColumn) as time_sec",
  },
  {
    id: "$__timeFilter(dateColumn)",
    name: "$__timeFilter(dateColumn)",
    text: "$___timeFilter",
    args: [ArgType.Column],
    type: MacroType.Filter,
    description:
      "Will be replaced by a time range filter using the specified column name. For example, dateColumn BETWEEN FROM_UNIXTIME(1494410783) AND FROM_UNIXTIME(1494410983)",
  },
  {
    id: "$__timeFrom()",
    name: "$__timeFrom()",
    text: "$__timeFrom",
    args: [],
    type: MacroType.Value,
    description:
      "Will be replaced by the start of the currently active time selection. For example, FROM_UNIXTIME(1494410783)",
  },
  {
    id: "$__timeTo()",
    name: "$__timeTo()",
    text: "$__timeTo",
    args: [],
    type: MacroType.Value,
    description:
      "Will be replaced by the end of the currently active time selection. For example, FROM_UNIXTIME(1494410983)",
  },
  {
    id: "$__timeGroup(dateColumn, '5m')",
    name: "$__timeGroup(dateColumn, '5m')",
    text: "$__timeGroup",
    args: [ArgType.Column, ArgType.RelativeTimeString],
    type: MacroType.Group,
    description:
      "Will be replaced by an expression usable in GROUP BY clause. For example, *cast(cast(UNIX_TIMESTAMP(dateColumn)/(300) as signed)*300 as signed),*",
  },
  {
    id: "$__timeGroup(dateColumn, '5m', fill)",
    name: "$__timeGroup(dateColumn, '5m', fill)",
    text: "$__timeGroup",
    args: [ArgType.Column, ArgType.RelativeTimeString, ArgType.Fill],
    type: MacroType.Group,
    description:
      "Will be replaced by an expression usable in GROUP BY clause. For example, *cast(cast(UNIX_TIMESTAMP(dateColumn)/(300) as signed)*300 as signed),* missing values can be filled with 0, NULL or previous",
  },
  {
    id: "$__timeGroupAlias(dateColumn, '5m')",
    name: "$__timeGroupAlias(dateColumn, '5m')",
    text: "$__timeGroup",
    args: [ArgType.Column, ArgType.RelativeTimeString, ArgType.Fill],
    type: MacroType.Group,
    description:
      "Will be replaced by an expression usable in GROUP BY clause. For example, *cast(cast(UNIX_TIMESTAMP(dateColumn)/(300) as signed)*300 as signed),* with an added column alias",
  },
  {
    id: "$__unixEpochFilter(dateColumn)",
    name: "$__unixEpochFilter(dateColumn)",
    text: "$__unixEpochFilter",
    args: [ArgType.Column],
    type: MacroType.Filter,
    description:
      "Will be replaced by a time range filter using the specified column name with times represented as Unix timestamp. For example, dateColumn > 1494410783 AND dateColumn < 1494497183",
  },
  {
    id: "$__unixEpochFrom()",
    name: "$__unixEpochFrom()",
    text: "$__unixEpochFrom",
    args: [],
    type: MacroType.Value,
    description:
      "Will be replaced by the start of the currently active time selection as Unix timestamp. For example, 1494410783",
  },
  {
    id: "$__unixEpochTo()",
    name: "$__unixEpochTo()",
    text: "$__unixEpochTo",
    args: [],
    type: MacroType.Value,
    description:
      "Will be replaced by the end of the currently active time selection as Unix timestamp. For example, 1494410783",
  },
  {
    id: "$__unixEpochNanoFilter(dateColumn)",
    name: "$__unixEpochNanoFilter(dateColumn)",
    text: "$__unixEpochNanoFilter",
    args: [ArgType.Column],
    type: MacroType.Filter,
    description:
      "Will be replaced by a time range filter using the specified column name with times represented as nanosecond timestamp. For example, dateColumn > 1494410783152415214 AND dateColumn < 1494497183142514872",
  },
  {
    id: "$__unixEpochNanoFrom()",
    name: "$__unixEpochNanoFrom()",
    text: "$__unixEpochNanoFrom",
    args: [],
    type: MacroType.Value,
    description:
      "Will be replaced by the start of the currently active time selection as nanosecond timestamp. For example, 1494410783152415214",
  },
  {
    id: "$__unixEpochNanoTo()",
    name: "$__unixEpochNanoTo()",
    text: "$__unixEpochNanoTo",
    args: [],
    type: MacroType.Value,
    description:
      "Will be replaced by the end of the currently active time selection as nanosecond timestamp. For example, 1494410783152415214",
  },
  {
    id: "$__unixEpochGroup(dateColumn, '5m')",
    name: "$__unixEpochGroup(dateColumn, '5m')",
    text: "$__unixEpochGroup",
    args: [ArgType.Column, ArgType.RelativeTimeString],
    type: MacroType.Group,
    description:
      "Will be replaced by an expression usable in GROUP BY clause. For values stored as unix timestamp.",
  },
  {
    id: "$__unixEpochGroup(dateColumn, '5m', fill)",
    name: "$__unixEpochGroup(dateColumn, '5m', fill)",
    text: "$__unixEpochGroup",
    args: [ArgType.Column, ArgType.RelativeTimeString, ArgType.Fill],
    type: MacroType.Group,
    description:
      "Will be replaced by an expression usable in GROUP BY clause. For values stored as unix timestamp. Missing values can be filled with 0, NULL or previous",
  },
];