import type { Entity } from '../entity/Entity';
import { ajvCompiledJsonSchemaValidator } from './util';
import schema from '../schema/kinds/SubVerticalSystem.v1alpha1.schema.json';

/**
 * Backstage catalog System kind Entity. Systems group Components, Resources and APIs together.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface SubVerticalSystemEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'SubVerticalSystem';
  spec: {
    owner: string;
    domain?: string;
  };
}

/**
 * {@link KindValidator} for {@link SystemEntityV1alpha1}.
 *
 * @public
 */
export const SubVerticalSystemEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(schema);
