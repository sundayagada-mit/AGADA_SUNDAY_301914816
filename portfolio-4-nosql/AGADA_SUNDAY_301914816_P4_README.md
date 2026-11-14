# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection sick_bay_events for arrival and assessment events. These are fictional event examples based on visit, pupil, staff_member.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related pupil details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "arrival",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "visit",
        "key": {
            "visit_id": 3001
        },
        "snapshot": {
            "visit_id": 3001,
            "pupil_id": 1001,
            "staff_id": 2001,
            "arrival_at": "2026-10-12T09:15:00Z",
            "symptoms": "headache",
            "outcome": null,
            "status": "open"
        }
    },
    "embedded": {
        "pupil": [
            {
                "key": {
                    "pupil_id": 1001
                },
                "snapshot": {
                    "pupil_id": 1001,
                    "grade_level": 7
                },
                "via": [
                    "visit.pupil_id → pupil"
                ]
            }
        ]
    },
    "references": {
        "staff_member": [
            {
                "key": {
                    "staff_id": 2001
                },
                "via": [
                    "visit.staff_id → staff_member"
                ]
            }
        ]
    },
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 1 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 2 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("sick_bay_events").find({"eventType":"arrival"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "arrival",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "visit_id": 3001
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("sick_bay_events").find({"source.key.visit_id":3001}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "arrival",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "visit_id": 3001
    }
  },
  {
    "_id": "event_000002",
    "eventType": "assessment",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "visit_id": 3001
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("sick_bay_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "arrival",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "visit_id": 3001
    }
  },
  {
    "_id": "event_000002",
    "eventType": "assessment",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "visit_id": 3001
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("sick_bay_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| arrival | 1 |
| assessment | 1 |

## Validation and suitability

MongoDB inserted 2 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 2 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run AGADA_SUNDAY_301914816_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/AGADA_SUNDAY_301914816_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

