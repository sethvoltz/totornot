-- Migration: Restructure votes table and add IP tracking
--
-- votes: replace two-row-per-matchup (dish_id + value) with one row per matchup
--        (winner_id + loser_id), drop fingerprint, add ip column.
--
-- dish_submissions: add submitter_ip column.

-- Step 1: Create the new votes table
CREATE TABLE votes_new (
    id TEXT PRIMARY KEY,
    winner_id TEXT NOT NULL REFERENCES dishes(id),
    loser_id TEXT NOT NULL REFERENCES dishes(id),
    ip TEXT,
    created_at INTEGER NOT NULL
);

-- Step 2: Reconstruct matchup rows from the old two-row format.
-- Each matchup was inserted as a single batch of two rows, so SQLite assigned
-- consecutive rowids: winner (value=1) at rowid R, loser (value=-1) at rowid R+1.
-- Joining on adjacent rowids avoids the cartesian product that a created_at join
-- produces when multiple matchups share the same timestamp.
INSERT INTO votes_new (id, winner_id, loser_id, ip, created_at)
SELECT
    w.id,
    w.dish_id  AS winner_id,
    l.dish_id  AS loser_id,
    NULL       AS ip,
    w.created_at
FROM votes w
JOIN votes l
  ON  l.rowid = w.rowid + 1
 AND  w.value = 1
 AND  l.value = -1;

-- Step 3: Swap tables
DROP TABLE votes;
ALTER TABLE votes_new RENAME TO votes;

-- Step 4: Add submitter IP to dish_submissions
ALTER TABLE dish_submissions ADD COLUMN submitter_ip TEXT;
