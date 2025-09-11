/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as billing from "../billing.js";
import type * as cleanup from "../cleanup.js";
import type * as flashcards from "../flashcards.js";
import type * as graphs from "../graphs.js";
import type * as messages from "../messages.js";
import type * as practiceTests from "../practiceTests.js";
import type * as sharing from "../sharing.js";
import type * as stepByStep from "../stepByStep.js";
import type * as studyGuides from "../studyGuides.js";
import type * as threads from "../threads.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  billing: typeof billing;
  cleanup: typeof cleanup;
  flashcards: typeof flashcards;
  graphs: typeof graphs;
  messages: typeof messages;
  practiceTests: typeof practiceTests;
  sharing: typeof sharing;
  stepByStep: typeof stepByStep;
  studyGuides: typeof studyGuides;
  threads: typeof threads;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
