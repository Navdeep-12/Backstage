/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import { createRouter } from '@backstage/plugin-permission-backend';
import {
  AuthorizeResult,
  PolicyDecision,
  isPermission,
  isResourcePermission,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';
import {
  DefaultPlaylistPermissionPolicy,
  isPlaylistPermission,
} from '@backstage/plugin-playlist-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  catalogConditions,
  createCatalogConditionalDecision,
} from '@backstage/plugin-catalog-backend/alpha';
import {
  catalogEntityCreatePermission,
  catalogEntityDeletePermission,
  catalogEntityReadPermission,
  catalogPermissions,
} from '@backstage/plugin-catalog-common';

class ExamplePermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    // LOGIC if any non registed user tris to login into the backsage application
    // He/she would not be able to create or read anything in the application

    if (
      user &&
      Object.keys(user).length &&
      user.identity.ownershipEntityRefs.length
    ) {
      const permission = request.permission as any;
      if (permission.resourceType === 'catalog-entity') {
        if (isPermission(request.permission, catalogEntityDeletePermission)) {
          return createCatalogConditionalDecision(
            request.permission,
            catalogConditions.isEntityOwner({
              claims: user?.identity.ownershipEntityRefs ?? [],
            }),
          );
        }

        //  console.log("user -------" , user.identity.ownershipEntityRefs)
        //  if (isPermission(request.permission, catalogEntityReadPermission)) {
        //    console.log("inside the read function / method ----------")
        //    return createCatalogConditionalDecision(
        //      request.permission,
        //      catalogConditions.isEntityOwner({
        //        claims: user?.identity.ownershipEntityRefs ?? [],
        //      }),
        //    );
        //  }
      }
    }

    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    policy: new ExamplePermissionPolicy(),
    identity: env.identity,
  });
}
