/**
 * Highlight metadata for config migration annotations.
 */

import { GLOBAL_PERMISSION_KEYS } from './constants.js';

/**
 * @param {string} dotPath
 * @returns {string}
 */
export function outputLeafFromPath(dotPath) {
  return dotPath.split('.').pop() ?? '';
}

/**
 * @param {string} flatKey
 * @param {string} dotPath
 */
export function userDefaultsMoveHighlight(flatKey, dotPath) {
  return {
    inputPath: `userDefaults.${flatKey}`,
    outputPath: `userDefaults.${dotPath}`,
    inputKey: flatKey,
    outputKey: outputLeafFromPath(dotPath),
  };
}

/**
 * @param {string} subKey
 * @param {string} dotPath
 */
export function previewSubfieldHighlight(subKey, dotPath) {
  return {
    inputPath: `userDefaults.preview.${subKey}`,
    outputPath: `userDefaults.${dotPath}`,
    inputKey: subKey,
    outputKey: outputLeafFromPath(dotPath),
  };
}

/**
 * @param {string} key
 */
export function serverToHttpHighlight(key) {
  return {
    inputPath: `server.${key}`,
    outputPath: `http.${key}`,
    inputKey: key,
    outputKey: key,
  };
}

/**
 * @param {string} key
 */
export function authToHttpHighlight(key) {
  return {
    inputPath: `auth.${key}`,
    outputPath: `http.${key}`,
    inputKey: key,
    outputKey: key,
  };
}

/**
 * @param {string} inputKey
 * @param {string} outputKey
 * @param {string} inputRulesPath
 */
export function renamedRuleFieldHighlight(inputKey, outputKey, inputRulesPath) {
  return {
    inputPath: `${inputRulesPath}.${inputKey}`,
    outputPath: `server.sources[].config.rules[].${outputKey}`,
    inputKey,
    outputKey,
  };
}

/** Global permission keys keep the same name under account.permissions — summary only, no line tint. */
export { GLOBAL_PERMISSION_KEYS };

/** @type {Set<string>} */
export const GLOBAL_PERMISSION_KEY_SET = new Set(GLOBAL_PERMISSION_KEYS);
