## API Report File for "@backstage/plugin-vault-backend"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { BackendFeature } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import { Logger } from 'winston';
import { LoggerService } from '@backstage/backend-plugin-api';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { TaskRunner } from '@backstage/backend-tasks';

// @public
export function createRouter(options: RouterOptions): express.Router;

// @public
export interface RouterOptions {
  // (undocumented)
  config: Config;
  // (undocumented)
  logger: Logger;
  // (undocumented)
  scheduler: PluginTaskScheduler;
}

// @public @deprecated
export interface VaultApi {
  getFrontendSecretsUrl(): string;
  listSecrets(
    secretPath: string,
    options?: {
      secretEngine?: string;
    },
  ): Promise<VaultSecret[]>;
  renewToken?(): Promise<void>;
}

// @public
export class VaultBuilder {
  constructor(env: VaultEnvironment);
  build(): VaultBuilderReturn;
  static createBuilder(env: VaultEnvironment): VaultBuilder;
  enableTokenRenew(schedule?: TaskRunner): Promise<this>;
  setVaultClient(vaultApi: VaultApi): this;
}

// @public
export type VaultBuilderReturn = {
  router: express.Router;
};

// @public
export class VaultClient implements VaultApi {
  constructor(options: { config: Config });
  // (undocumented)
  getFrontendSecretsUrl(): string;
  // (undocumented)
  listSecrets(
    secretPath: string,
    options?: {
      secretEngine?: string;
    },
  ): Promise<VaultSecret[]>;
  // (undocumented)
  renewToken(): Promise<void>;
}

// @public
export interface VaultEnvironment {
  // (undocumented)
  config: Config;
  // (undocumented)
  logger: LoggerService;
  // (undocumented)
  scheduler: PluginTaskScheduler;
}

// @public
const vaultPlugin: () => BackendFeature;
export default vaultPlugin;

// @public @deprecated
export type VaultSecret = {
  name: string;
  path: string;
  showUrl: string;
  editUrl: string;
};

// (No @packageDocumentation comment for this package)
```