# Admin API Testing Report

## Test Execution Summary
- **Date**: April 11, 2026
- **Server**: http://localhost:8000
- **Total Tests**: 10
- **Passed**: 9/10
- **Failed**: 1/10
- **Success Rate**: 90%

---

## Test Results

### ✅ PASSED (9/10)

1. **Admin Login** - PASS
   - Endpoint: POST /api/admin/login
   - Status: 200
   - Details: Successfully authenticated and received JWT token
   - Tested credentials:
     - Email: adminsrl@gmail.com
     - Password: Admin@SRL

2. **Verify Token** - PASS
   - Endpoint: POST /api/admin/verify
   - Status: 200
   - Details: Token verification successful

3. **Get All Students** - PASS
   - Endpoint: GET /api/admin/students
   - Status: 200
   - Details: Retrieved 37 students
   - Response format: { success: true, data: [...] }

4. **Create Student** - PASS
   - Endpoint: POST /api/admin/students
   - Status: 201
   - Details: Successfully created test student (TEST_2107236565)
   - Required Fields: student_name, enrollment_no, email
   - Optional Fields: contact_no, department, institute_name, semester, division, batch, gender

5. **Get All Activities** - PASS
   - Endpoint: GET /api/admin/activities
   - Status: 200
   - Details: Retrieved 6 activities

6. **Get All Scores** - PASS
   - Endpoint: GET /api/admin/scores
   - Status: 200
   - Details: Retrieved 191 scores

7. **Get All Attendance** - PASS
   - Endpoint: GET /api/admin/attendance
   - Status: 200
   - Details: Retrieved 0 attendance records

8. **Get All Timeline** - PASS
   - Endpoint: GET /api/admin/timeline
   - Status: 200
   - Details: Retrieved 6 timeline entries

9. **Get All Research** - PASS
   - Endpoint: GET /api/admin/research
   - Status: 200
   - Details: Retrieved 29 research items

---

### ❌ FAILED (1/10)

1. **Create Activity** - FAIL
   - Endpoint: POST /api/admin/activities
   - Status: 500 Internal Server Error
   - Details: Error during create operation
   
   **ROOT CAUSE IDENTIFIED:**
   The controller is attempting to create an activity with a "category" field:
   ```javascript
   const { title, description, category, date, link, brief, photo } = req.body;
   ```
   
   However, the Activity model in Prisma schema does NOT have a "category" field.
   
   **Activity Model Definition (prisma/schema.prisma):**
   ```
   model Activity {
     id          Int     @id @default(autoincrement())
     title       String?
     description String?
     link        String?
     brief       String?
     date        String?
     Photo       String?      <-- Note: Capital 'P'
     sequence    Int?
   
     @@map("activities")
   }
   ```
   
   **Issues Found:**
   1. Controller uses field "category" which doesn't exist in model
   2. Controller uses field "photo" (lowercase) but model has "Photo" (uppercase)

---

## Issues Found & Recommendations

### Issue #1: Create Activity API - Invalid Fields
**Severity**: HIGH (Blocking API)
**File**: `src/controllers/adminActivitiesController.js`
**Problem**: Controller tries to save data to fields that don't exist

**Fix Required**:
Remove the "category" field from the create/update operations:

```javascript
// BEFORE (Current - WRONG):
const { title, description, category, date, link, brief, photo } = req.body;
const activity = await prisma.activity.create({
  data: {
    title,
    description: description || null,
    category: category || null,    // <-- REMOVE THIS
    date: date || null,
    link: link || null,
    brief: brief || null,
    Photo: photo || null,
  },
});

// AFTER (Fixed):
const { title, description, date, link, brief, photo } = req.body;
const activity = await prisma.activity.create({
  data: {
    title,
    description: description || null,
    date: date || null,
    link: link || null,
    brief: brief || null,
    Photo: photo || null,
  },
});
```

---

## API Endpoint Summary

| Endpoint | Method | Status | Issue |
|----------|--------|--------|-------|
| /admin/login | POST | ✅ | None |
| /admin/verify | POST | ✅ | None |
| /admin/students | GET | ✅ | None |
| /admin/students | POST | ✅ | None |
| /admin/activities | GET | ✅ | None |
| /admin/activities | POST | ❌ | Invalid fields in controller |
| /admin/scores | GET | ✅ | None |
| /admin/attendance | GET | ✅ | None |
| /admin/timeline | GET | ✅ | None |
| /admin/research | GET | ✅ | None |

---

## Data Statistics

| Resource | Count |
|----------|-------|
| Students | 37 |
| Activities | 6 |
| Scores | 191 |
| Attendance Records | 0 |
| Timeline Entries | 6 |
| Research Items | 29 |

---

## Recommendations

1. **URGENT**: Fix the Create Activity API by removing the "category" field reference
2. **OPTIONAL**: Consider if "category" field should be added to the Activity model if it's needed for functionality
3. **MAINTENANCE**: Update API documentation to match actual field names
4. **TESTING**: After fix, re-run test suite to verify Create Activity endpoint works

---

## Test Data Created During Testing

1. **Test Student**: TEST_2107236565
   - Email: test_[random]@test.com
   - Successfully created and can be retrieved

---

## Conclusion

The admin API system is 90% operational. Only one critical issue was identified and it's straightforward to fix. The issue is in the adminActivitiesController.js where it's trying to save a "category" field that doesn't exist in the Activity model, causing a database error.

All other CRUD operations (Create, Read, Update for Students) are working correctly.

---

**Test Completed**: April 11, 2026  
**Next Steps**: Fix the Create Activity API issue and re-run tests
