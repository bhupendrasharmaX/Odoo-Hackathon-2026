# TransitOps Database

## Files

- schema.sql - Database schema
- seed.sql - Sample data
- queries.sql - Test queries

## Setup

1. Install SQLite.
2. Create the database:

```bash
sqlite3 transitops.db
```

3. Execute:

```sql
.read schema.sql
.read seed.sql
```

4. Verify:

```sql
.tables
```