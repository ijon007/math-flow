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
import type * as cleanup from "../cleanup.js";
import type * as flashcards from "../flashcards.js";
import type * as graphs from "../graphs.js";
import type * as messages from "../messages.js";
import type * as stepByStep from "../stepByStep.js";
import type * as subscriptions from "../subscriptions.js";
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
  cleanup: typeof cleanup;
  flashcards: typeof flashcards;
  graphs: typeof graphs;
  messages: typeof messages;
  stepByStep: typeof stepByStep;
  subscriptions: typeof subscriptions;
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
