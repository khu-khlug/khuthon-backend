CREATE DATABASE IF NOT EXISTS Khuthon;

CREATE TABLE IF NOT EXISTS Khuthon.Event (
    id VARCHAR(100) PRIMARY KEY,
    year INT NOT NULL,
    maxTeamCount INT NOT NULL,
    maxMemberCount INT NOT NULL,
    registerStartAt DATETIME NOT NULL,
    registerEndAt DATETIME NOT NULL,
    eventStartAt DATETIME NOT NULL,
    eventEndAt DATETIME NOT NULL,
    judgeStartAt DATETIME NOT NULL,
    judgeEndAt DATETIME NOT NULL,
    examinerAllot INT NOT NULL,
    participantAllot INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

INSERT INTO Khuthon.Event (
    id, 
    year, 
    maxTeamCount, 
    maxMemberCount, 
    registerStartAt, 
    registerEndAt, 
    eventStartAt, 
    eventEndAt, 
    judgeStartAt, 
    judgeEndAt, 
    examinerAllot, 
    participantAllot, 
    createdAt, 
    updatedAt
) 
VALUES (
    'exampleEvent', 
    2024, 
    10, 
    10, 
    '2024-01-01 00:00:00', 
    '2024-12-31 23:59:59', 
    '2024-01-01 00:00:00', 
    '2024-12-31 23:59:59', 
    '2024-01-01 00:00:00', 
    '2024-12-31 23:59:59', 
    2, 
    50, 
    now(), 
    now()
);
