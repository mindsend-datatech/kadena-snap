import { InternalError, InvalidParamsError } from '@metamask/snaps-sdk';

type DefinitionValue = "string" | "number" | "boolean" | "object";

export type ValidateDefinition = {
  [key: string]: DefinitionValue;
};

type Obj = Record<string, unknown>

/**
 * Create a validator function for a given validation definition.
 * @param def - The validation definition specifying expected types.
 * @returns A function that validates objects against the definition.
 */
export function makeValidator<ObjectType extends Obj>(def: ValidateDefinition): (obj: ObjectType) => void {
  return (obj: ObjectType) => validateParams(def, obj);
}

/**
 * Validate an object against a validation definition.
 * @param def - The validation definition specifying expected types.
 * @param obj - The object to validate.
 * @throws InvalidParamsError if validation fails.
 */
export function validateParams<ObjectType extends Obj>(def: ValidateDefinition, obj: ObjectType): void {
  const errors = [];
  for(const [key, expectedType] of Object.entries(def)) {
    if (!(validateField(obj[key], expectedType))) {
      errors.push(key);
    }
  }

  if (errors.length) {
    const fieldMessage = errors.map(key => {
      const expectedType = def[key];
      const suffix = expectedType.endsWith('[]') ? '' : ` received ${typeof obj[key]}`;
      return `"${key}: expected ${expectedType}${suffix}"`
    }).join(', ');

    const prefix = `${errors.length} parameter validation error${errors.length > 1 ? 's':''}: `;

    throw new InvalidParamsError(`${prefix}${fieldMessage}`);
  }
}

/**
 * Validate a single field against its expected type.
 * @param value - The value to validate.
 * @param defValue - The expected type definition.
 * @returns True if validation passes, false otherwise.
 */
function validateField(value: unknown, defValue: DefinitionValue): boolean {
  switch(defValue) {
    case 'boolean':
      return validateBoolean(value);
    case 'number':
      return validateNumber(value);
    case 'string':
      return validateString(value);
    case 'object':
      return validateObject(value);
    default:
      throw new InternalError(`Unexpected validation type: ${defValue as string}`);
  }
}

/**
 * Validate that a value is a boolean.
 * @param n - The value to validate.
 * @returns True if the value is a boolean.
 */
function validateBoolean(n: unknown): n is boolean {
  return typeof n === "boolean";
}

/**
 * Validate that a value is a finite number.
 * @param n - The value to validate.
 * @returns True if the value is a finite number.
 */
function validateNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/**
 * Validate that a value is a string.
 * @param s - The value to validate.
 * @returns True if the value is a string.
 */
function validateString(s: unknown): s is string {
  return typeof s === "string";
}

/**
 * Validate that a value is an object.
 * @param arr - The value to validate.
 * @returns True if the value is an object.
 */
function validateObject(arr: unknown): arr is object {
  return typeof arr === "object" && arr !== null;
}
