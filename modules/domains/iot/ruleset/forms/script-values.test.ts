import { describe, expect, it } from 'vitest';
import { defaultScriptOf, formValues, splitFormValues } from './field-utils';
import type { ParamSpec } from '../catalog/types';

const schema: Record<string, ParamSpec> = {
  script: { type: 'code', store: 'script', default: 'return msg;' },
  topic: { type: 'string' },
};
const plain: Record<string, ParamSpec> = { topic: { type: 'string' } };

describe('formValues', () => {
  it('adds the script under the key of the param that is stored in script', () => {
    expect(formValues(schema, { topic: 't' }, 'return 1;')).toEqual({ topic: 't', script: 'return 1;' });
  });
  it('starts a node without a script with the default', () => {
    expect(formValues(schema, undefined, undefined)).toEqual({ script: 'return msg;' });
    expect(formValues({ s: { type: 'code', store: 'script' } }, {}, undefined)).toEqual({ s: '' });
  });
  it('leaves values alone when no param is stored in script', () => {
    expect(formValues(plain, { topic: 't' }, 'ignored')).toEqual({ topic: 't' });
    expect(formValues(undefined, undefined, undefined)).toEqual({});
  });
  it('does not change the config it was given', () => {
    const config = { topic: 't' };
    formValues(schema, config, 'x');
    expect(config).toEqual({ topic: 't' });
  });
});

describe('splitFormValues', () => {
  it('takes the script out of the params', () => {
    expect(splitFormValues(schema, { topic: 't', script: 'return 2;' })).toEqual({ config: { topic: 't' }, script: 'return 2;' });
  });
  it('gives no script when the value is not text or there is no such param', () => {
    expect(splitFormValues(schema, { topic: 't', script: undefined })).toEqual({ config: { topic: 't' }, script: undefined });
    expect(splitFormValues(plain, { topic: 't', script: 'x' })).toEqual({ config: { topic: 't', script: 'x' }, script: undefined });
  });
  it('round trips with formValues', () => {
    const values = formValues(schema, { topic: 't' }, 'a');
    expect(splitFormValues(schema, values)).toEqual({ config: { topic: 't' }, script: 'a' });
  });
});

describe('defaultScriptOf', () => {
  it('is the default of the param stored in script', () => {
    expect(defaultScriptOf(schema)).toBe('return msg;');
    expect(defaultScriptOf(plain)).toBeUndefined();
    expect(defaultScriptOf(undefined)).toBeUndefined();
    expect(defaultScriptOf({ s: { type: 'code', store: 'script' } })).toBeUndefined();
  });
});
