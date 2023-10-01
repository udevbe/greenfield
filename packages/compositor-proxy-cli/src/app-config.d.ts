/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The application mapping config file
 */
export interface AppConfigSchema {
  /**
   * An application mapping entry whose key is an http path
   *
   * This interface was referenced by `AppConfigSchema`'s JSON-Schema definition
   * via the `patternProperty` "^\/((?:[\w-]+\/)*[\w-]+)?$".
   */
  [k: string]: {
    /**
     * human-readable application name
     */
    name: string
    executable: string
    args: string[]
    env: {
      [k: string]: string
    }
  }
}
