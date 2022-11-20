export interface RBACRuleResource {
  bucket?: RegExp | null;
  host?: RegExp | null;
  path?: RegExp | null;
}

export interface RBACRule {
  title?: string;
  entity: {
    kind: string;
    name: string;
  };
  verbs: string[];
  resource: RBACRuleResource;
}
