import type { issues } from './fixes/index.js';

export type IssuesMap = typeof issues;
export type Issue = keyof IssuesMap;
export type IssueFunction = IssuesMap[Issue];

export type FixerPair<Key extends Issue> = [Key, IssuesMap[Key]];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fixes = (Issue | FixerPair<any>)[];
