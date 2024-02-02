import { SubVerticalSystemEntityV1alpha1, SubVerticalSystemEntityV1alpha1Validator as validator, } from './SubVerticalSystemV1alpha1';

describe('SystemV1alpha1Validator', () => {
  let entity: SubVerticalSystemEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'SubVerticalSystem',
      metadata: {
        name: 'test',
      },
      spec: {
        owner: 'me',
        domain: 'domain',
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('silently accepts v1beta1 as well', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta1';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('ignores unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta0';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('ignores unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('rejects missing owner', async () => {
    delete (entity as any).spec.owner;
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects wrong owner', async () => {
    (entity as any).spec.owner = 7;
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects empty owner', async () => {
    (entity as any).spec.owner = '';
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('accepts missing domain', async () => {
    delete (entity as any).spec.domain;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects wrong domain', async () => {
    (entity as any).spec.domain = 7;
    await expect(validator.check(entity)).rejects.toThrow(/domain/);
  });

  it('rejects empty domain', async () => {
    (entity as any).spec.domain = '';
    await expect(validator.check(entity)).rejects.toThrow(/domain/);
  });
});

console.log("no error------------------new kind added")