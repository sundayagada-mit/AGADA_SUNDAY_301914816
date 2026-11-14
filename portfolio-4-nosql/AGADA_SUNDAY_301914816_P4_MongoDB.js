// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("sick_bay_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("sick_bay_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "arrival",
                    "assessment"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "visit"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "visit_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("sick_bay_events").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "assessment",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "visit",
                    "key": {
                        "visit_id": 3001
                    },
                    "field": "symptoms",
                    "value": "headache"
                }
            ],
            "examples": {
                "treatment_details": "illustrative treatment_details",
                "notes": "illustrative notes"
            }
        }
    }
]));
  await db.getCollection("sick_bay_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("sick_bay_events").find({"eventType":"arrival"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("sick_bay_events").find({"source.key.visit_id":3001}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("sick_bay_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("sick_bay_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("sick_bay_events").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("sick_bay_events").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("sick_bay_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
