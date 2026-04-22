-- Support fractional hours beyond 2 decimal places (e.g. 1 min ≈ 0.0167 hr).
-- numeric(5,2) rounded tiny durations incorrectly.

alter table public.events
  alter column hours type numeric(10, 4);
