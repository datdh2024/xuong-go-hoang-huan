---
name: mm:db-design
description: >
  Use when a task requires database changes — creating tables, adding columns, writing migrations.
  Trigger: "design DB", "write migration", "add table/column", "schema change".
---

# Database Design

Design database schema changes with backward compatibility and index strategy.

## Input

- Task + user-flow + current schema

## Output

- Schema changes (tables, columns, indexes, relations)
- **Checklist:** backward compatibility · index strategy

---

## Steps

### 1. Read current schema

Understand the existing data model:
- Read current Sanity schemas from `src/sanity/schemas/`
- Check existing database migrations if any
- Understand current data relationships

```bash
ls src/sanity/schemas/
```

### 2. Design the changes

Based on the task requirements, design:

| Change Type | Details |
|-------------|---------|
| **New table/document** | Name, fields, types, required vs optional |
| **New column/field** | Field name, type, default value, validation |
| **New index** | Fields, type (unique, compound, partial) |
| **New relation** | Reference type, cardinality (1:1, 1:N, N:M) |

Present the design as a clear schema:

```typescript
// Example Sanity schema change
export default defineType({
  name: 'newDocument',
  title: 'New Document',
  type: 'document',
  fields: [
    defineField({
      name: 'fieldName',
      title: 'Field Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
```

### 3. Check backward compatibility

Verify:
- [ ] Existing data is not broken by the change
- [ ] Existing queries still work (check `src/sanity/lib/queries.ts`)
- [ ] No required fields added without defaults on existing documents
- [ ] Removed fields are not referenced in code
- [ ] Migration path exists for existing data if needed

### 4. Propose index strategy

Based on expected query patterns:
- Which fields will be queried/filtered most often?
- Are there GROQ queries that would benefit from ordering?
- Any unique constraints needed?

### 5. **MANDATORY STOP** — Wait for user review

Present the complete schema design with:
1. Schema changes (visual diff if updating existing)
2. Backward compatibility assessment
3. Index strategy rationale

Ask:
> "Here's the proposed schema design — does this match your data model expectations? Any concerns about backward compatibility?"

**Do not implement changes until the user approves.**

---

## Guardrails

- Never add required fields to existing documents without a migration plan
- Always check that GROQ queries in `src/sanity/lib/queries.ts` are compatible
- Consider the impact on Sanity Studio UI (field ordering, validation messages)
- If schema changes affect multiple documents, show the relationship diagram
