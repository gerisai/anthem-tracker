-- Runs once, when the postgres-data volume is first created
-- anthem_test: automated tests (wiped by each test)
-- anthem_shadow: scratch database prisma migrate dev uses to diff the schema
CREATE DATABASE anthem_test;
CREATE DATABASE anthem_shadow;
