

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
import { catalogConditions, createCatalogConditionalDecision } from '@backstage/plugin-catalog-backend/alpha';
import { catalogEntityDeletePermission, catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';

class ExamplePermissionPolicy implements PermissionPolicy {

  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {

    // LOGIC if any non registed user tris to login into the backsage application
    // He/she would not be able to create or read anything in the application

     if (user === undefined) {
       const visibility = request.permission.name === 'catalog.entity.read'
       const creating = request.permission.name === 'catalog.entity.create'
       if(visibility || creating){
        return { result: AuthorizeResult.DENY }
       }
     }

     if(user && Object.keys(user).length && user.identity.ownershipEntityRefs.length){
       const permission = request.permission as any
       //owner allowed to delete entites that he owns
       if(permission.resourceType === 'catalog-entity'){
        if(isPermission(request.permission, catalogEntityDeletePermission)){
          return createCatalogConditionalDecision(
            request.permission,
            catalogConditions.isEntityOwner({
              claims: user?.identity.ownershipEntityRefs ?? [],
            }),
          );       
        }
       //owner allowed to see entites that he owns
       // if(isPermission(request.permission , catalogEntityReadPermission)){
       //   return createCatalogConditionalDecision(
       //     request.permission,
       //     catalogConditions.isEntityOwner({
       //       claims: user?.identity.ownershipEntityRefs ?? [],
       //     }),
       //   );       
       // }
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