# List columns, filters and sorting

Each person chooses what the lists show. The Workbench's **Instances** and **Pending Tasks**, and **My work**, each
have a **Columns** picker above the list, headings that sort it, and the filter bar.

## Columns

Open **Add columns**. For each model in the list (the one the filter chooses, or every model whose cases are shown),
it offers:

- **What the case's label shows:** each value its [case label](labels.md) names (`${Client = data.clientId}` is
  *Client*). One column reads each model's own path, so *Client* shows `data.clientId` for one model's cases and
  `data.customer.name` for another's.
- **Its form fields, by their labels:** *Leave Type*, *Start Date*. Each is the field of the case's data the form
  saves (`data.LeaveType`).

**Another field** takes any other field of the cases' data by its name (`amount`, `region.name`). Fields added that
way are listed under **Other fields**, to uncheck.

**Show** adds the columns checked; **Reset to the default** goes back to the list as it was. A list has at most 12
columns. A form field's column is headed by its label. Values are shown as text: a date in ISO form, a list joined
with commas, an object as JSON. A case without the field shows nothing.

## Sorting

Click a heading to sort by it, and again for the other way (▲ ascending, ▼ descending). Besides its columns:

| List | Sorts by |
|---|---|
| Instances | Name (the model), Started (the default, newest first), Ended |
| Pending Tasks, My work | Task, Process, Waiting (the default, oldest first), Due |

Numbers sort as numbers and text by its letters; cases without the value come last either way.

Instances are sorted by the database, a page at a time, so a column sorts there when it reads one path in every case:
a data field, or a named value when every model reads it from the same path, or once the filter chooses one model.
Otherwise its heading doesn't sort. Tasks are sorted after they are read, by any column.

## Filters

The filter bar offers the labels' named values, and the data columns the person added. Besides **contains** and
**is**, **more than** and **less than** compare numbers as numbers, and anything else as text (a date kept as ISO text compares
as a date).

## Kept

The view is in the URL: `/?columns=Client,data.amount&sort=data.amount&order=desc#instances` (Pending Tasks' with
`task_`: `task_columns=`, `task_sort=`), so a view can be bookmarked and shared. The person's last view of each list
is kept for their session: opening the page again, or filtering, keeps it.

## What a column shows

What the person may read of the case, as the lists' API answers it:

- Without [security policies](security.md), a case they may see, its data.
- With them, what the case's policy lets them read: a case they see as a line only (`see: summary`) shows its label
  but no columns; a field the policy hides is blank.
- **With security policies on, sorting and filtering on the data are limited to the values the labels name.** Those
  show in every list already; sorting or filtering by another field would tell its values to someone the policy hides
  them from. Such a column is shown, but its heading doesn't sort and the filter bar doesn't offer it.

## In API v3

`GET /api/v3/instances` and `GET /api/v3/tasks` take:

| Parameter | |
|---|---|
| `columns` | Comma-separated: a label's name or a data path. Each item answers `columns`: `{ "Client": "acme", "data.amount": "1200" }` |
| `sort` | Instances: `started`, `ended`, `model`, `status`, or a column. Tasks: `started`, `due`, `model`, `name`, `priority`, or a column |
| `order` | `asc` or `desc` |
| `field` | A label's name, or a data path |
| `op` | `contains`, `is`, `gt`, `lt` |

```
GET /api/v3/instances?name=Claim&columns=Client,data.amount&sort=data.amount&order=desc
GET /api/v3/tasks?field=data.amount&op=gt&value=1000&columns=Client
```

A sorted list's `next` is its position; pass it back as `cursor`. A column that is neither a label's name nor a data
path is 400 `BAD_COLUMN`; a sort the list can't give, 400 `BAD_SORT`; with security policies, a sort or filter on data
no label reads, 400 `SORT_REFUSED` or `FILTER_REFUSED`.

In code: `listColumns(fields, keys, model)`, `columnValues(columns, model, data)` and `sortRecords` (bpmn-server,
`engine/ListColumns.ts`).
