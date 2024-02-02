

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
import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common/alpha';

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
       if(permission.resourceType === 'catalog-entity'){
        if(isPermission(request.permission, catalogEntityDeletePermission)){
          return createCatalogConditionalDecision(
            request.permission,
            catalogConditions.isEntityOwner({
              claims: user?.identity.ownershipEntityRefs ?? [],
            }),
          );       
        }
      }
     }


    // LOGIC for not allowing user to delete a entity
    //lets say there is a user who is not part of the team but has been given the access to just
    // view the application will not be able to delete any entity

    // if(user === undefined){
    //   if(request && request.permission.name === 'catalog.entity.delete'){
    //    return { result : AuthorizeResult.DENY}
    //    } 
    // }


    // LOGIC for not deleting and refreshing the component user gets into 
    // if (user === undefined) {
    //   const requestName = request.permission.name
    //   const deletition = requestName === 'catalog.entity.delete'
    //   const update = requestName === 'catalog.entity.refresh'
    //   if (deletition) {
    //     console.log("inside delete if conition------------")
    //     return { result: AuthorizeResult.DENY }
    //   }

    //   if (update) {
    //     console.log("inside update if conition------------")
    //     return { result: AuthorizeResult.DENY }
    //   }
    // }


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