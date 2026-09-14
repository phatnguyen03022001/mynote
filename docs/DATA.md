# Data Model and Persistence

MongoDB is the application datastore. Better Auth owns its own auth collections through the official adapter; application code owns note-domain collections.

## Note document

Planned V1 shape:

```text
_id: ObjectId
userId: string
content: string
tags: string[]
urls: string[]
pinned: boolean
archived: boolean
deletedAt: Date | null
createdAt: Date
updatedAt: Date
```

Derived preview metadata can be embedded only while it stays bounded and changes with the note. If metadata becomes independently refreshed/unbounded, reconsider that boundary with evidence.

## Ownership invariant

Every user-note operation includes `userId` in the MongoDB predicate, for example `{ _id, userId, deletedAt: null }`. Never fetch by `_id` and authorize afterward. This is both security policy and query design.

## Index plan

Create indexes based on actual query shapes, expected V1 starting with:

- `{ userId: 1, archived: 1, deletedAt: 1, createdAt: -1 }` for inbox/history pagination.
- `{ userId: 1, pinned: -1, deletedAt: 1, createdAt: -1 }` for pinned/recent views.
- tag multikey support only when tag filters ship.
- a text/search index aligned with the implemented search strategy; do not maintain unused indexes.

Use cursor/keyset pagination based on stable sort keys for growing feeds; avoid large offset/skip pagination.

## Migrations

MongoDB is schema-flexible, not schema-free. New code must tolerate the supported historical document shapes during rollout or run an explicit migration before relying on new required fields. Migrations must be restartable, observable, and never execute destructively as a side effect of app startup.

## Retention and backup

Trash retention and eventual purge are product policy, not an implicit database TTL until semantics are finalized. Production requires tested backup/restore procedures appropriate to the Atlas tier before data is treated as durable user storage.
