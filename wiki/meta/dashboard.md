---
type: meta
title: 'Dashboard'
created: 2026-04-26
updated: 2026-04-26
tags: [meta, dashboard]
status: active
---

# Wiki Dashboard

## Recent Activity

```dataview
TABLE type, status, updated FROM "wiki" SORT updated DESC LIMIT 15
```

## Seed Pages (Need Development)

```dataview
LIST FROM "wiki" WHERE status = "seed" SORT updated ASC
```

## Entities Missing Sources

```dataview
LIST FROM "wiki/entities" WHERE !sources OR length(sources) = 0
```

## Open Questions

```dataview
LIST FROM "wiki/questions" WHERE answer_quality = "draft" SORT created DESC
```

## Pages by Domain

```dataview
TABLE length(rows) AS "Count" FROM "wiki" GROUP BY type SORT length(rows) DESC
```
