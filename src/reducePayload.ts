export type KeyKind = 'uuid' | 'type' | 'name';

type ActionEntry = {
  type?: string;
  [key: string]: unknown;
};

type ActionPayload = Record<string, ActionEntry>;

const defaultUuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function defaultIsUuidKey(key: string): boolean {
  return defaultUuidRegex.test(key);
}

function defaultIsTypeKey(key: string, value: ActionEntry): boolean {
  return typeof value.type === 'string' && key === value.type;
}

function classifyKey(key: string, value: ActionEntry): KeyKind {
  if (defaultIsUuidKey(key)) {
    return 'uuid';
  }

  if (defaultIsTypeKey(key, value)) {
    return 'type';
  }

  return 'name';
}

export function reducePayload(
  payload: ActionPayload,
  keepKinds: Array<KeyKind> = ['uuid', 'name', 'type'],
  excludeTypes: Array<string> = []
): ActionPayload {
  const includeSet = new Set(keepKinds);
  const result: ActionPayload = {};

  for (const [key, value] of Object.entries(payload)) {
    const kind = classifyKey(key, value);
    if (includeSet.has(kind) && !excludeTypes.includes(value.type as string)) {
      result[key] = value;
    }
  }

  return result;
}