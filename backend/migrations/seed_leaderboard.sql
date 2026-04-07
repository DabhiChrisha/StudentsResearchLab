-- ============================================================
-- Leaderboard migration
-- 1. Create leaderboard_stats (pre-aggregated per period)
-- 2. Seed 38 students × 5 periods = 190 rows from CSV
-- 3. Truncate stale attendance & debate_scores tables
-- ============================================================

CREATE TABLE IF NOT EXISTS leaderboard_stats (
  id            SERIAL PRIMARY KEY,
  serial_no     SMALLINT NOT NULL,
  student_name  TEXT NOT NULL,
  enrollment_no TEXT NOT NULL,
  period        TEXT NOT NULL,   -- 'Nov-Dec 2025' | 'Jan 2026' | 'Feb 2026' | 'Mar 2026' | 'All Time'
  attendance    SMALLINT  DEFAULT 0,
  hours         NUMERIC(8,4) DEFAULT 0,
  debate_score  INTEGER   DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (serial_no, period)
);

CREATE INDEX IF NOT EXISTS idx_lb_period       ON leaderboard_stats(period);
CREATE INDEX IF NOT EXISTS idx_lb_enrollment   ON leaderboard_stats(enrollment_no);

-- ---- SEED DATA ------------------------------------------------
-- Columns: serial_no, student_name, enrollment_no, period, attendance, hours, debate_score

INSERT INTO leaderboard_stats (serial_no, student_name, enrollment_no, period, attendance, hours, debate_score)
VALUES
-- ── 1. Aayush Viral Pandya ──────────────────────────────────
(1,'Aayush Viral Pandya','24BECE30541','Nov-Dec 2025',16,41,87),
(1,'Aayush Viral Pandya','24BECE30541','Jan 2026',11,25.5,25),
(1,'Aayush Viral Pandya','24BECE30541','Feb 2026',15,39,59),
(1,'Aayush Viral Pandya','24BECE30541','Mar 2026',9,19.5,-1),
(1,'Aayush Viral Pandya','24BECE30541','All Time',51,125,170),

-- ── 2. Arnab Ghosh ──────────────────────────────────────────
(2,'Arnab Ghosh','23BECE30532','Nov-Dec 2025',0,0,0),
(2,'Arnab Ghosh','23BECE30532','Jan 2026',0,0,0),
(2,'Arnab Ghosh','23BECE30532','Feb 2026',0,0,0),
(2,'Arnab Ghosh','23BECE30532','Mar 2026',4,2,0),
(2,'Arnab Ghosh','23BECE30532','All Time',4,2,0),

-- ── 3. Chavda Yashvi Surendrasinh ───────────────────────────
(3,'Chavda Yashvi Surendrasinh','23BECE30036','Nov-Dec 2025',8,21,27),
(3,'Chavda Yashvi Surendrasinh','23BECE30036','Jan 2026',8,14,32),
(3,'Chavda Yashvi Surendrasinh','23BECE30036','Feb 2026',4,7.5,19),
(3,'Chavda Yashvi Surendrasinh','23BECE30036','Mar 2026',2,5,0),
(3,'Chavda Yashvi Surendrasinh','23BECE30036','All Time',22,47.5,78),

-- ── 4. Dabhi Chrisha Manish ─────────────────────────────────
(4,'Dabhi Chrisha Manish','24BECE30489','Nov-Dec 2025',20,43,83),
(4,'Dabhi Chrisha Manish','24BECE30489','Jan 2026',11,35.5,17),
(4,'Dabhi Chrisha Manish','24BECE30489','Feb 2026',15,43,55),
(4,'Dabhi Chrisha Manish','24BECE30489','Mar 2026',13,19.5625,3),
(4,'Dabhi Chrisha Manish','24BECE30489','All Time',59,141.0625,158),

-- ── 5. Devda Rachita Bharatsinh ─────────────────────────────
(5,'Devda Rachita Bharatsinh','23BECE30059','Nov-Dec 2025',15,37,43),
(5,'Devda Rachita Bharatsinh','23BECE30059','Jan 2026',8,14,32),
(5,'Devda Rachita Bharatsinh','23BECE30059','Feb 2026',2,6.5,19),
(5,'Devda Rachita Bharatsinh','23BECE30059','Mar 2026',1,2.5,0),
(5,'Devda Rachita Bharatsinh','23BECE30059','All Time',26,60,94),

-- ── 6. Gajjar Antra Ashvinkumar ─────────────────────────────
(6,'Gajjar Antra Ashvinkumar','24BECE30081','Nov-Dec 2025',22,59.5,86),
(6,'Gajjar Antra Ashvinkumar','24BECE30081','Jan 2026',11,34.5,23),
(6,'Gajjar Antra Ashvinkumar','24BECE30081','Feb 2026',15,46,55),
(6,'Gajjar Antra Ashvinkumar','24BECE30081','Mar 2026',13,23,-6),
(6,'Gajjar Antra Ashvinkumar','24BECE30081','All Time',61,163,158),

-- ── 7. Ghetiya Poojan Rahulbhai ─────────────────────────────
(7,'Ghetiya Poojan Rahulbhai','25MECE30003','Nov-Dec 2025',3,13,62),
(7,'Ghetiya Poojan Rahulbhai','25MECE30003','Jan 2026',1,5,18),
(7,'Ghetiya Poojan Rahulbhai','25MECE30003','Feb 2026',2,10,18),
(7,'Ghetiya Poojan Rahulbhai','25MECE30003','Mar 2026',2,9.5,0),
(7,'Ghetiya Poojan Rahulbhai','25MECE30003','All Time',8,37.5,98),

-- ── 8. Heny Patel ───────────────────────────────────────────
(8,'Heny Patel','23BECE30521','Nov-Dec 2025',11,27,38),
(8,'Heny Patel','23BECE30521','Jan 2026',8,17.5,19),
(8,'Heny Patel','23BECE30521','Feb 2026',9,24.5,33),
(8,'Heny Patel','23BECE30521','Mar 2026',10,34,-4),
(8,'Heny Patel','23BECE30521','All Time',38,103,86),

-- ── 9. Hetvi Hinsu ──────────────────────────────────────────
(9,'Hetvi Hinsu','23BECE30449','Nov-Dec 2025',7,16,54),
(9,'Hetvi Hinsu','23BECE30449','Jan 2026',3,10.5,23),
(9,'Hetvi Hinsu','23BECE30449','Feb 2026',6,25,52),
(9,'Hetvi Hinsu','23BECE30449','Mar 2026',2,11.5,0),
(9,'Hetvi Hinsu','23BECE30449','All Time',18,63,129),

-- ── 10. Honey Modha ─────────────────────────────────────────
(10,'Honey Modha','224SBECE30016','Nov-Dec 2025',4,26,37),
(10,'Honey Modha','224SBECE30016','Jan 2026',1,5,17),
(10,'Honey Modha','224SBECE30016','Feb 2026',5,15,33),
(10,'Honey Modha','224SBECE30016','Mar 2026',7,23,0),
(10,'Honey Modha','224SBECE30016','All Time',17,69,87),

-- ── 11. Jadeja Bhagyashree Vanrajsinh ───────────────────────
(11,'Jadeja Bhagyashree Vanrajsinh','24BECE30099','Nov-Dec 2025',0,0,0),
(11,'Jadeja Bhagyashree Vanrajsinh','24BECE30099','Jan 2026',0,0,0),
(11,'Jadeja Bhagyashree Vanrajsinh','24BECE30099','Feb 2026',16,35,78),
(11,'Jadeja Bhagyashree Vanrajsinh','24BECE30099','Mar 2026',13,23.5,-4),
(11,'Jadeja Bhagyashree Vanrajsinh','24BECE30099','All Time',29,58.5,74),

-- ── 12. Janki Chitroda ──────────────────────────────────────
(12,'Janki Chitroda','23BECE30040','Nov-Dec 2025',15,33,30),
(12,'Janki Chitroda','23BECE30040','Jan 2026',7,9,16),
(12,'Janki Chitroda','23BECE30040','Feb 2026',4,13.5,49),
(12,'Janki Chitroda','23BECE30040','Mar 2026',2,5,0),
(12,'Janki Chitroda','23BECE30040','All Time',28,60.5,95),

-- ── 13. Jenish Sorathiya ────────────────────────────────────
(13,'Jenish Sorathiya','23BEIT54020','Nov-Dec 2025',13,37.5,75),
(13,'Jenish Sorathiya','23BEIT54020','Jan 2026',12,49.5,39),
(13,'Jenish Sorathiya','23BEIT54020','Feb 2026',13,32,48),
(13,'Jenish Sorathiya','23BEIT54020','Mar 2026',7,37,12),
(13,'Jenish Sorathiya','23BEIT54020','All Time',45,156,174),

-- ── 14. Kandarp Dipakkumar Gajjar ───────────────────────────
(14,'Kandarp Dipakkumar Gajjar','22BECE30091','Nov-Dec 2025',32,108,112),
(14,'Kandarp Dipakkumar Gajjar','22BECE30091','Jan 2026',12,84,34),
(14,'Kandarp Dipakkumar Gajjar','22BECE30091','Feb 2026',16,99,72),
(14,'Kandarp Dipakkumar Gajjar','22BECE30091','Mar 2026',14,84,0),
(14,'Kandarp Dipakkumar Gajjar','22BECE30091','All Time',74,375,218),

-- ── 15. Kanksha Keyur Buch ──────────────────────────────────
(15,'Kanksha Keyur Buch','23BECE30029','Nov-Dec 2025',16,31,56),
(15,'Kanksha Keyur Buch','23BECE30029','Jan 2026',8,14,32),
(15,'Kanksha Keyur Buch','23BECE30029','Feb 2026',5,14.5,49),
(15,'Kanksha Keyur Buch','23BECE30029','Mar 2026',1,2.5,0),
(15,'Kanksha Keyur Buch','23BECE30029','All Time',30,62,137),

-- ── 16. Kansara Dev Dharmeshkumar ───────────────────────────
(16,'Kansara Dev Dharmeshkumar','24BECE30114','Nov-Dec 2025',12,23,59),
(16,'Kansara Dev Dharmeshkumar','24BECE30114','Jan 2026',11,35,24),
(16,'Kansara Dev Dharmeshkumar','24BECE30114','Feb 2026',16,53,58),
(16,'Kansara Dev Dharmeshkumar','24BECE30114','Mar 2026',16,44,-4),
(16,'Kansara Dev Dharmeshkumar','24BECE30114','All Time',55,155,137),

-- ── 17. Kanudawala Zeel PareshKumar ─────────────────────────
(17,'Kanudawala Zeel PareshKumar','23BECE30101','Nov-Dec 2025',6,18,11),
(17,'Kanudawala Zeel PareshKumar','23BECE30101','Jan 2026',6,12,37),
(17,'Kanudawala Zeel PareshKumar','23BECE30101','Feb 2026',9,20.5,67),
(17,'Kanudawala Zeel PareshKumar','23BECE30101','Mar 2026',4,8.5,0),
(17,'Kanudawala Zeel PareshKumar','23BECE30101','All Time',25,59,115),

-- ── 18. Krishna Bhatt ───────────────────────────────────────
(18,'Krishna Bhatt','23BECE30023','Nov-Dec 2025',17,37,74),
(18,'Krishna Bhatt','23BECE30023','Jan 2026',4,4,16),
(18,'Krishna Bhatt','23BECE30023','Feb 2026',4,7.5,19),
(18,'Krishna Bhatt','23BECE30023','Mar 2026',2,5,0),
(18,'Krishna Bhatt','23BECE30023','All Time',27,53.5,109),

-- ── 19. Krutika Vijaybhai Patel ─────────────────────────────
(19,'Krutika Vijaybhai Patel','22BEIT30118','Nov-Dec 2025',13,38,54),
(19,'Krutika Vijaybhai Patel','22BEIT30118','Jan 2026',0,0,0),
(19,'Krutika Vijaybhai Patel','22BEIT30118','Feb 2026',2,6.5,19),
(19,'Krutika Vijaybhai Patel','22BEIT30118','Mar 2026',2,12,0),
(19,'Krutika Vijaybhai Patel','22BEIT30118','All Time',17,56.5,73),

-- ── 20. Kumavat Yash Nenaram ────────────────────────────────
(20,'Kumavat Yash Nenaram','24BECE30122','Nov-Dec 2025',22,59.5,73),
(20,'Kumavat Yash Nenaram','24BECE30122','Jan 2026',11,34.5,24),
(20,'Kumavat Yash Nenaram','24BECE30122','Feb 2026',15,46,59),
(20,'Kumavat Yash Nenaram','24BECE30122','Mar 2026',14,32,-4),
(20,'Kumavat Yash Nenaram','24BECE30122','All Time',62,172,152),

-- ── 21. Mahi Nitinchandra Parmar ────────────────────────────
(21,'Mahi Nitinchandra Parmar','24BECE30548','Nov-Dec 2025',24,48.5,92),
(21,'Mahi Nitinchandra Parmar','24BECE30548','Jan 2026',11,28,21),
(21,'Mahi Nitinchandra Parmar','24BECE30548','Feb 2026',15,44,55),
(21,'Mahi Nitinchandra Parmar','24BECE30548','Mar 2026',8,11.5,-1),
(21,'Mahi Nitinchandra Parmar','24BECE30548','All Time',58,132,167),

-- ── 22. Mihir Patel ─────────────────────────────────────────
(22,'Mihir Patel','23BECE30542','Nov-Dec 2025',9,20,48),
(22,'Mihir Patel','23BECE30542','Jan 2026',8,17.5,35),
(22,'Mihir Patel','23BECE30542','Feb 2026',11,40,70),
(22,'Mihir Patel','23BECE30542','Mar 2026',6,21,-5),
(22,'Mihir Patel','23BECE30542','All Time',34,98.5,148),

-- ── 23. Nancy Rajesh Patel ──────────────────────────────────
(23,'Nancy Rajesh Patel','22BEIT30123','Nov-Dec 2025',33,113.5,106),
(23,'Nancy Rajesh Patel','22BEIT30123','Jan 2026',12,84,24),
(23,'Nancy Rajesh Patel','22BEIT30123','Feb 2026',14,86.5,12),
(23,'Nancy Rajesh Patel','22BEIT30123','Mar 2026',10,68.5,0),
(23,'Nancy Rajesh Patel','22BEIT30123','All Time',69,352.5,142),

-- ── 24. Padh Charmi Ketankumar ──────────────────────────────
(24,'Padh Charmi Ketankumar','23BECE30144','Nov-Dec 2025',16,40,31),
(24,'Padh Charmi Ketankumar','23BECE30144','Jan 2026',2,9.5,23),
(24,'Padh Charmi Ketankumar','23BECE30144','Feb 2026',5,11.5,34),
(24,'Padh Charmi Ketankumar','23BECE30144','Mar 2026',2,11.5,0),
(24,'Padh Charmi Ketankumar','23BECE30144','All Time',25,72.5,88),

-- ── 25. Panchal Henit Shaileshbhai ──────────────────────────
(25,'Panchal Henit Shaileshbhai','23BECE30490','Nov-Dec 2025',12,27,22),
(25,'Panchal Henit Shaileshbhai','23BECE30490','Jan 2026',12,16.5,19),
(25,'Panchal Henit Shaileshbhai','23BECE30490','Feb 2026',11,35.5,39),
(25,'Panchal Henit Shaileshbhai','23BECE30490','Mar 2026',10,34,0),
(25,'Panchal Henit Shaileshbhai','23BECE30490','All Time',45,113,80),

-- ── 26. Pande Hemant Rameshwarkumar ─────────────────────────
(26,'Pande Hemant Rameshwarkumar','23BECE30493','Nov-Dec 2025',25,45,30),
(26,'Pande Hemant Rameshwarkumar','23BECE30493','Jan 2026',12,58,36),
(26,'Pande Hemant Rameshwarkumar','23BECE30493','Feb 2026',15,54,63),
(26,'Pande Hemant Rameshwarkumar','23BECE30493','Mar 2026',13,73,3),
(26,'Pande Hemant Rameshwarkumar','23BECE30493','All Time',65,230,132),

-- ── 27. Parva Kumar ─────────────────────────────────────────
(27,'Parva Kumar','22BECE30153','Nov-Dec 2025',13,43,59),
(27,'Parva Kumar','22BECE30153','Jan 2026',1,5,16),
(27,'Parva Kumar','22BECE30153','Feb 2026',1,4.5,18),
(27,'Parva Kumar','22BECE30153','Mar 2026',1,7,-1),
(27,'Parva Kumar','22BECE30153','All Time',16,59.5,92),

-- ── 28. Patel Banshari Rahulkumar ───────────────────────────
(28,'Patel Banshari Rahulkumar','23BECE30168','Nov-Dec 2025',29,65,95),
(28,'Patel Banshari Rahulkumar','23BECE30168','Jan 2026',11,53.5,33),
(28,'Patel Banshari Rahulkumar','23BECE30168','Feb 2026',11,35.5,39),
(28,'Patel Banshari Rahulkumar','23BECE30168','Mar 2026',12,56,0),
(28,'Patel Banshari Rahulkumar','23BECE30168','All Time',63,210,167),

-- ── 29. Patel Hency Mukesh ──────────────────────────────────
(29,'Patel Hency Mukesh','24BECE30225','Nov-Dec 2025',0,0,0),
(29,'Patel Hency Mukesh','24BECE30225','Jan 2026',0,0,0),
(29,'Patel Hency Mukesh','24BECE30225','Feb 2026',0,0,0),
(29,'Patel Hency Mukesh','24BECE30225','Mar 2026',10,11,-2),
(29,'Patel Hency Mukesh','24BECE30225','All Time',10,11,-2),

-- ── 30. Patel Jainee Hasmukhbhai ────────────────────────────
(30,'Patel Jainee Hasmukhbhai','23BECE30203','Nov-Dec 2025',28,61.5,93),
(30,'Patel Jainee Hasmukhbhai','23BECE30203','Jan 2026',9,45.5,14),
(30,'Patel Jainee Hasmukhbhai','23BECE30203','Feb 2026',13,42.5,55),
(30,'Patel Jainee Hasmukhbhai','23BECE30203','Mar 2026',13,72,0),
(30,'Patel Jainee Hasmukhbhai','23BECE30203','All Time',63,221.5,162),

-- ── 31. Patel Krish Himanshu ────────────────────────────────
(31,'Patel Krish Himanshu','23BECE30532','Nov-Dec 2025',30,63,102),
(31,'Patel Krish Himanshu','23BECE30532','Jan 2026',12,54,35),
(31,'Patel Krish Himanshu','23BECE30532','Feb 2026',18,63,55),
(31,'Patel Krish Himanshu','23BECE30532','Mar 2026',14,78,0),
(31,'Patel Krish Himanshu','23BECE30532','All Time',74,258,192),

-- ── 32. Pragati Varu ────────────────────────────────────────
(32,'Pragati Varu','24BECE30436','Nov-Dec 2025',18,56,33),
(32,'Pragati Varu','24BECE30436','Jan 2026',5,7,14),
(32,'Pragati Varu','24BECE30436','Feb 2026',12,25.5,73),
(32,'Pragati Varu','24BECE30436','Mar 2026',5,6.5,-2),
(32,'Pragati Varu','24BECE30436','All Time',40,95,118),

-- ── 33. Prem Raichura ───────────────────────────────────────
(33,'Prem Raichura','224SBECE30059','Nov-Dec 2025',10,31,68),
(33,'Prem Raichura','224SBECE30059','Jan 2026',1,5,23),
(33,'Prem Raichura','224SBECE30059','Feb 2026',4,16,34),
(33,'Prem Raichura','224SBECE30059','Mar 2026',5,12.5,0),
(33,'Prem Raichura','224SBECE30059','All Time',20,64.5,125),

-- ── 34. Ridham Patel ────────────────────────────────────────
(34,'Ridham Patel','22BEIT30133','Nov-Dec 2025',6,25,38),
(34,'Ridham Patel','22BEIT30133','Jan 2026',1,5,18),
(34,'Ridham Patel','22BEIT30133','Feb 2026',2,6.5,18),
(34,'Ridham Patel','22BEIT30133','Mar 2026',2,12,0),
(34,'Ridham Patel','22BEIT30133','All Time',11,48.5,74),

-- ── 35. Rohan Thakar ────────────────────────────────────────
(35,'Rohan Thakar','23BECE30364','Nov-Dec 2025',10,39,65),
(35,'Rohan Thakar','23BECE30364','Jan 2026',6,10,38),
(35,'Rohan Thakar','23BECE30364','Feb 2026',9,16.5,33),
(35,'Rohan Thakar','23BECE30364','Mar 2026',4,12,0),
(35,'Rohan Thakar','23BECE30364','All Time',29,77.5,136),

-- ── 36. Rudr Jayeshkumar Halvadiya ──────────────────────────
(36,'Rudr Jayeshkumar Halvadiya','24BECE0094','Nov-Dec 2025',16,45,61),
(36,'Rudr Jayeshkumar Halvadiya','24BECE0094','Jan 2026',11,34.5,24),
(36,'Rudr Jayeshkumar Halvadiya','24BECE0094','Feb 2026',16,49,49),
(36,'Rudr Jayeshkumar Halvadiya','24BECE0094','Mar 2026',13,36,-6),
(36,'Rudr Jayeshkumar Halvadiya','24BECE0094','All Time',56,164.5,128),

-- ── 37. Yajurshi Velani ─────────────────────────────────────
(37,'Yajurshi Velani','24BECE30441','Nov-Dec 2025',4,10,6),
(37,'Yajurshi Velani','24BECE30441','Jan 2026',7,14,25),
(37,'Yajurshi Velani','24BECE30441','Feb 2026',9,17.5,57),
(37,'Yajurshi Velani','24BECE30441','Mar 2026',6,6.5,-1),
(37,'Yajurshi Velani','24BECE30441','All Time',26,48,87),

-- ── 38. Zenisha Devani ──────────────────────────────────────
(38,'Zenisha Devani','23BECE30058','Nov-Dec 2025',7,26,88),
(38,'Zenisha Devani','23BECE30058','Jan 2026',2,6,34),
(38,'Zenisha Devani','23BECE30058','Feb 2026',4,10,33),
(38,'Zenisha Devani','23BECE30058','Mar 2026',2,9.5,0),
(38,'Zenisha Devani','23BECE30058','All Time',15,51.5,155)

ON CONFLICT (serial_no, period) DO UPDATE SET
  attendance    = EXCLUDED.attendance,
  hours         = EXCLUDED.hours,
  debate_score  = EXCLUDED.debate_score;

-- ---- TRUNCATE OLD STALE TABLES --------------------------------
TRUNCATE TABLE attendance RESTART IDENTITY;
TRUNCATE TABLE debate_scores RESTART IDENTITY;
