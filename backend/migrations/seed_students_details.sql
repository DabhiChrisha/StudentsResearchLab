-- ============================================================
-- Students Details Seeding Migration
-- Populates the students_details table with enrollment, department,
-- semester, division, batch, and profile image paths
-- ============================================================

-- Add missing columns if they don't exist
ALTER TABLE students_details ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE students_details ADD COLUMN IF NOT EXISTS institute_name TEXT DEFAULT 'LDRP-ITR';

-- ---- SEED/UPDATE DATA ------------------------------------------------
-- All 38 Students with proper enrollment, department, semester, division, batch

INSERT INTO students_details (enrollment_no, student_name, department, semester, division, batch, profile_image, institute_name, email)
VALUES
  ('24BECE30541', 'Pandya Aayush Viral', 'CE', '4', 'B', '2024-2028', '/students/Pandya Aayush Viral.jpeg', 'LDRP-ITR', 'aayush.pandya@student.ldrp.edu.in'),
  ('23BECE54003', 'Arnab Ghosh', 'CE', '6', 'A', '2023-2027', NULL, 'LDRP-ITR', 'arnab.ghosh@student.ldrp.edu.in'),
  ('23BECE30532', 'Patel Krish Himanshu', 'CE', '6', 'A', '2023-2027', '/students/Patel Krish Himanshu.jpeg', 'LDRP-ITR', 'krish.patel@student.ldrp.edu.in'),
  ('23BECE30036', 'Chavda Yashvi Surendrasinh', 'CE', '6', 'A', '2023-2027', '/students/Chavda Yashvi Surendrasinh.jpeg', 'LDRP-ITR', 'yashvi.chavda@student.ldrp.edu.in'),
  ('24BECE30489', 'Dabhi Chrisha Manish', 'CE', '4', 'G', '2024-2028', '/students/Dabhi Chrisha Manish.png', 'LDRP-ITR', 'chrisha.dabhi@student.ldrp.edu.in'),
  ('23BECE30059', 'Devda Rachita Bharatsinh', 'CE', '6', 'B', '2023-2027', '/students/Devda Rachita Bharatsinh.jpeg', 'LDRP-ITR', 'rachita.devda@student.ldrp.edu.in'),
  ('24BECE30081', 'Gajjar Antra Ashvinkumar', 'CE', '4', 'B', '2024-2028', '/students/Gajjar Antra Ashvinkumar.jpeg', 'LDRP-ITR', 'antra.gajjar@student.ldrp.edu.in'),
  ('25MECE30003', 'Ghetiya Poojan Rahulbhai', 'ME', '2', 'A', '2025-2027', '/students/Ghetiya Poojan Rahulbhai.jpeg', 'LDRP-ITR', 'poojan.ghetiya@student.ldrp.edu.in'),
  ('23BECE30521', 'Heny Patel', 'CE', '6', 'A', '2023-2027', '/students/Heny Patel.jpeg', 'LDRP-ITR', 'heny.patel@student.ldrp.edu.in'),
  ('23BECE30449', 'Hetvi Hinsu', 'CE', '6', 'A', '2023-2027', '/students/Hetvi Hinsu.jpeg', 'LDRP-ITR', 'hetvi.hinsu@student.ldrp.edu.in'),
  ('224SBECE30016', 'Honey Modha', 'CE', '6', 'B', '2023-2027', '/students/Honey Modha.jpeg', 'LDRP-ITR', 'honey.modha@student.ldrp.edu.in'),
  ('24BECE30099', 'Jadeja Bhagyashree Vanrajsinh', 'CE', '4', 'A', '2024-2028', '/students/Jadeja Bhagyashree.jpeg', 'LDRP-ITR', 'bhagyashree.jadeja@student.ldrp.edu.in'),
  ('23BECE30040', 'Janki Chitroda', 'CE', '6', 'A', '2023-2027', '/students/Janki Chitroda.jpeg', 'LDRP-ITR', 'janki.chitroda@student.ldrp.edu.in'),
  ('23BEIT54020', 'Jenish Sorathiya', 'IT', '6', 'A', '2023-2027', '/students/Jenish Sorathiya.jpeg', 'LDRP-ITR', 'jenish.sorathiya@student.ldrp.edu.in'),
  ('22BECE30091', 'Kandarp Dipakkumar Gajjar', 'CE', '8', 'B', '2022-2026', '/students/Kandarp Gajjar.jpeg', 'LDRP-ITR', 'kandarp.gajjar@student.ldrp.edu.in'),
  ('23BECE30029', 'Kanksha Keyur Buch', 'CE', '6', 'A', '2023-2027', '/students/Kanksha Keyur Buch.jpeg', 'LDRP-ITR', 'kanksha.buch@student.ldrp.edu.in'),
  ('24BECE30114', 'Kansara Dev Dharmeshkumar', 'CE', '4', 'A', '2024-2028', '/students/Kansara Dev Dharmeshkumar.jpeg', 'LDRP-ITR', 'dev.kansara@student.ldrp.edu.in'),
  ('23BECE30101', 'Kanudawala Zeel PareshKumar', 'CE', '6', 'B', '2023-2027', '/students/Kanudawala Zeel PareshKumar.jpeg', 'LDRP-ITR', 'zeel.kanudawala@student.ldrp.edu.in'),
  ('23BECE30023', 'Krishna Bhatt', 'CE', '6', 'A', '2023-2027', '/students/Krishna Bhatt.jpeg', 'LDRP-ITR', 'krishna.bhatt@student.ldrp.edu.in'),
  ('22BEIT30118', 'Krutika Vijaybhai Patel', 'IT', '8', 'B', '2022-2026', '/students/Krutika Vijaybhai Patel.jpeg', 'LDRP-ITR', 'krutika.patel@student.ldrp.edu.in'),
  ('24BECE30122', 'Kumavat Yash Nenaram', 'CE', '4', 'B', '2024-2028', '/students/Yash Kumavat.jpeg', 'LDRP-ITR', 'yash.kumavat@student.ldrp.edu.in'),
  ('24BECE30548', 'Parmar Mahi Nitinchandra', 'CE', '4', 'B', '2024-2028', '/students/Parmar Mahi Nitinchandra.jpeg', 'LDRP-ITR', 'mahi.parmar@student.ldrp.edu.in'),
  ('23BECE30542', 'Mihir Patel', 'CE', '6', 'B', '2023-2027', '/students/Mihir Patel.png', 'LDRP-ITR', 'mihir.patel@student.ldrp.edu.in'),
  ('22BEIT30123', 'Nancy Rajesh Patel', 'IT', '8', 'B', '2022-2026', '/students/Nancy.jpeg', 'LDRP-ITR', 'nancy.patel@student.ldrp.edu.in'),
  ('23BECE30144', 'Padh Charmi Ketankumar', 'CE', '6', 'A', '2023-2027', '/students/Padh Charmi Ketankumar.jpeg', 'LDRP-ITR', 'charmi.padh@student.ldrp.edu.in'),
  ('23BECE30490', 'Panchal Henit Shaileshbhai', 'CE', '6', 'B', '2023-2027', '/students/Panchal Henit Shaileshbhai.jpeg', 'LDRP-ITR', 'henit.panchal@student.ldrp.edu.in'),
  ('23BECE30493', 'Pande Hemant Rameshwarkumar', 'CE', '6', 'B', '2023-2027', '/students/Pande Hemant Rameshwarkumar.jpeg', 'LDRP-ITR', 'hemant.pande@student.ldrp.edu.in'),
  ('22BECE30153', 'Parva Kumar', 'CE', '8', 'A', '2022-2026', '/students/Parva Kumar.jpeg', 'LDRP-ITR', 'parva.kumar@student.ldrp.edu.in'),
  ('23BECE30168', 'Patel Banshari Rahulkumar', 'CE', '6', 'A', '2023-2027', '/students/Patel Banshari Rahulkumar.jpg', 'LDRP-ITR', 'banshari.patel@student.ldrp.edu.in'),
  ('24BECE30225', 'Patel Hency Mukesh', 'CE', '4', 'B', '2024-2028', '/students/Hency Patel.jpeg', 'LDRP-ITR', 'hency.patel@student.ldrp.edu.in'),
  ('23BECE30203', 'Patel Jainee Hasmukhbhai', 'CE', '6', 'A', '2023-2027', '/students/Patel Jainee Hasmukhbhai.jpeg', 'LDRP-ITR', 'jainee.patel@student.ldrp.edu.in'),
  ('24BECE30436', 'Pragati Varu', 'CE', '4', 'A', '2024-2028', '/students/Pragati Varu.jpeg', 'LDRP-ITR', 'pragati.varu@student.ldrp.edu.in'),
  ('224SBECE30059', 'Prem Raichura', 'CE', '6', 'A', '2023-2027', '/students/Prem Raichura.jpeg', 'LDRP-ITR', 'prem.raichura@student.ldrp.edu.in'),
  ('22BEIT30133', 'Ridham Patel', 'IT', '8', 'B', '2022-2026', '/students/Ridham Patel.png', 'LDRP-ITR', 'ridham.patel@student.ldrp.edu.in'),
  ('23BECE30364', 'Rohan Thakar', 'CE', '6', 'B', '2023-2027', '/students/Rohan Thakar.png', 'LDRP-ITR', 'rohan.thakar@student.ldrp.edu.in'),
  ('24BECE30094', 'Halvdadiya Rudr', 'CE', '4', 'A', '2024-2028', '/students/Halvdadiya Rudr.jpeg', 'LDRP-ITR', 'rudr.halvadiya@student.ldrp.edu.in'),
  ('24BECE30441', 'Yajurshi Velani', 'CE', '4', 'A', '2024-2028', '/students/Yajurshi Velani.png', 'LDRP-ITR', 'yajurshi.velani@student.ldrp.edu.in'),
  ('23BECE30058', 'Zenisha Devani', 'CE', '6', 'A', '2023-2027', '/students/Zenisha Devani.jpeg', 'LDRP-ITR', 'zenisha.devani@student.ldrp.edu.in')
ON CONFLICT (enrollment_no) DO UPDATE SET
  student_name = EXCLUDED.student_name,
  department = EXCLUDED.department,
  semester = EXCLUDED.semester,
  division = EXCLUDED.division,
  batch = EXCLUDED.batch,
  profile_image = EXCLUDED.profile_image,
  institute_name = EXCLUDED.institute_name;
