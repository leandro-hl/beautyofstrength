# Known Typos in Codebase

This document tracks known typos in the codebase that should be fixed in a future release.

## Critical Typos (Database Schema)

These typos exist in database column names and require coordinated migration:

### 1. `resistence` → `resistance`

**Affected files:**
- `back/db/models.go` - Model field names
- `back/db/api.go` - Database queries
- `back/db/querymodels.go` - Query models
- `back/web/endpoints.go` - API handlers
- `back/web/payloads.go` - Request/response payloads
- `ui/src/components/PageRoutineDetail.js` - Frontend
- `ui/src/components/PageBlockCreate.js` - Frontend
- `ui/src/components/PageRoutineExecution.js` - Frontend
- `ui/src/components/mui/AccountConfigs.js` - Frontend
- `sql/46.sql` - Database migration

**Impact:** Database column renaming required

**Migration strategy:**
1. Add new correctly-spelled column
2. Copy data from old to new column
3. Update application code to use new column
4. Remove old column after verification

### 2. `restingInteval` → `restingInterval`

**Affected files:**
- Similar to above (database models, queries, API, frontend)

**Impact:** Database column renaming required

**Migration strategy:** Same as above

## Non-Critical Typos

These can be fixed without database changes:

### 3. Code Comments

Search for and fix:
- Spelling errors in comments
- Grammatical issues
- Inconsistent capitalization

## Recommended Fix Strategy

### Phase 1: Add new columns (Non-breaking)
```sql
-- Migration 51.sql
ALTER TABLE blockgroup ADD COLUMN resistance BOOLEAN;
ALTER TABLE blockgroup ADD COLUMN resting_interval INTEGER;

-- Copy data from misspelled columns
UPDATE blockgroup SET resistance = resistence;
UPDATE blockgroup SET resting_interval = "restingInteval";
```

### Phase 2: Update application code
- Update all struct field names
- Update all JSON tags to support both old and new names temporarily
- Update all database queries to use new column names
- Update frontend to use new field names

### Phase 3: Remove old columns (Breaking change)
```sql
-- Migration 52.sql (after Phase 2 deployed)
ALTER TABLE blockgroup DROP COLUMN resistence;
ALTER TABLE blockgroup DROP COLUMN "restingInteval";
```

## Additional Issues Found

1. **Inconsistent naming conventions:**
   - Some fields use camelCase in database (should be snake_case)
   - Some fields use quoted identifiers when not needed

2. **Spanish/English mixing:**
   - Some enum values are in Spanish
   - Some database names use Spanish words
   - Consider internationalization strategy

## Notes

- **DO NOT** fix these typos without a comprehensive migration plan
- Database changes must be coordinated across all environments
- Frontend and backend must be updated simultaneously
- Consider backward compatibility during transition period

## Created By

Auto-generated during codebase analysis - 2025-01-04
