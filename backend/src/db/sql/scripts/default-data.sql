INSERT INTO channels (channel, createdAt, updatedAt, deletedAt)
VALUES ('WhatsApp', NOW(), NOW(), NULL),
       ('SMS', NOW(), NOW(), NULL),
       ('Email', NOW(), NOW(), NULL),
       ('Voicebot', NOW(), NOW(), NULL);

INSERT INTO file_vias (via, createdAt, updatedAt, deletedAt)
VALUES ('remote', NOW(), NOW(), NULL),
       ('manual', NOW(), NOW(), NULL);

INSERT INTO file_status (status, createdAt, updatedAt, deletedAt)
VALUES
    ('uploading', NOW(), NOW(), NULL),
    ('finished', NOW(), NOW(), NULL),
    ('failed', NOW(), NOW(), NULL);