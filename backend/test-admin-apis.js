#!/usr/bin/env node
/**
 * Admin API Testing Script
 * Tests all admin endpoints and logs issues found
 */

const http = require("http");

const BASE_URL = "http://localhost:8000/api";
let adminToken = null;

// Utility function to make HTTP requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (adminToken) {
      options.headers.Authorization = `Bearer ${adminToken}`;
    }

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
          };
          resolve(response);
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Test results storage
const results = [];

function logTest(name, status, details) {
  const result = {
    name,
    status,
    details,
    timestamp: new Date().toISOString(),
  };
  results.push(result);
  console.log(`\n${status === "✅" ? "✅" : "❌"} ${name}`);
  if (details) {
    console.log(`   ${details}`);
  }
}

async function runTests() {
  console.log("🚀 Starting Admin API Tests\n");
  console.log(`API Base URL: ${BASE_URL}`);
  console.log(`Testing localhost:8000\n`);
  console.log("═".repeat(60));

  try {
    // TEST 1: Login
    console.log("\n📝 TEST 1: Admin Login");
    console.log("─".repeat(60));

    const loginResponse = await makeRequest("POST", "/admin/login", {
      email: "adminsrl@gmail.com",
      password: "Admin@SRL",
    });

    if (loginResponse.status === 200 && loginResponse.body?.token) {
      adminToken = loginResponse.body.token;
      logTest(
        "Admin Login",
        "✅",
        `Token received: ${adminToken.substring(0, 20)}...`
      );
    } else {
      logTest("Admin Login", "❌", `Status: ${loginResponse.status}`);
      throw new Error("Login failed");
    }

    // TEST 2: Verify Token
    console.log("\n📝 TEST 2: Verify Admin Token");
    console.log("─".repeat(60));

    const verifyResponse = await makeRequest("POST", "/admin/verify");

    if (verifyResponse.status === 200) {
      logTest("Verify Token", "✅", "Token verified successfully");
    } else {
      logTest(
        "Verify Token",
        "❌",
        `Status: ${verifyResponse.status} - ${verifyResponse.body?.message}`
      );
    }

    // TEST 3: Get Students
    console.log("\n📝 TEST 3: Get All Students");
    console.log("─".repeat(60));

    const getStudentsResponse = await makeRequest("GET", "/admin/students");

    if (getStudentsResponse.status === 200) {
      const count = getStudentsResponse.body?.data?.length || 0;
      logTest("Get Students", "✅", `Retrieved ${count} students`);
    } else {
      logTest(
        "Get Students",
        "❌",
        `Status: ${getStudentsResponse.status} - ${getStudentsResponse.body?.message}`
      );
    }

    // TEST 4: Create Student
    console.log("\n📝 TEST 4: Create Student");
    console.log("─".repeat(60));

    const newStudent = {
      student_name: "Test Student",
      enrollment_no: `TEST${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      contact_no: "9876543210",
      department: "CE",
      institute_name: "LDRP-ITR",
      semester: 4,
      division: "A",
      batch: "2023",
      gender: "Male",
      member_type: "member",
    };

    const createStudentResponse = await makeRequest(
      "POST",
      "/admin/students",
      newStudent
    );

    if (createStudentResponse.status === 201) {
      logTest("Create Student", "✅", `Created student: ${newStudent.enrollment_no}`);
    } else {
      logTest(
        "Create Student",
        "❌",
        `Status: ${createStudentResponse.status} - ${JSON.stringify(createStudentResponse.body)}`
      );
    }

    // TEST 5: Get Activities
    console.log("\n📝 TEST 5: Get All Activities");
    console.log("─".repeat(60));

    const getActivitiesResponse = await makeRequest("GET", "/admin/activities");

    if (getActivitiesResponse.status === 200) {
      const count = getActivitiesResponse.body?.data?.length || 0;
      logTest("Get Activities", "✅", `Retrieved ${count} activities`);
    } else {
      logTest(
        "Get Activities",
        "❌",
        `Status: ${getActivitiesResponse.status} - ${getActivitiesResponse.body?.message}`
      );
    }

    // TEST 6: Create Activity
    console.log("\n📝 TEST 6: Create Activity");
    console.log("─".repeat(60));

    const newActivity = {
      title: "Test Activity",
      description: "This is a test activity",
      category: "Workshop",
      date: new Date().toISOString(),
      link: "https://example.com",
      brief: "Test brief",
      photo: "https://example.com/photo.jpg",
    };

    const createActivityResponse = await makeRequest(
      "POST",
      "/admin/activities",
      newActivity
    );

    if (createActivityResponse.status === 201) {
      logTest(
        "Create Activity",
        "✅",
        `Created activity: ${createActivityResponse.body?.data?.id}`
      );
    } else {
      logTest(
        "Create Activity",
        "❌",
        `Status: ${createActivityResponse.status} - ${JSON.stringify(createActivityResponse.body)}`
      );
    }

    // TEST 7: Get Scores
    console.log("\n📝 TEST 7: Get All Scores");
    console.log("─".repeat(60));

    const getScoresResponse = await makeRequest("GET", "/admin/scores");

    if (getScoresResponse.status === 200) {
      const count = getScoresResponse.body?.data?.length || 0;
      logTest("Get Scores", "✅", `Retrieved ${count} scores`);
    } else {
      logTest(
        "Get Scores",
        "❌",
        `Status: ${getScoresResponse.status} - ${getScoresResponse.body?.message}`
      );
    }

    // TEST 8: Get Attendance
    console.log("\n📝 TEST 8: Get All Attendance");
    console.log("─".repeat(60));

    const getAttendanceResponse = await makeRequest("GET", "/admin/attendance");

    if (getAttendanceResponse.status === 200) {
      const count = getAttendanceResponse.body?.data?.length || 0;
      logTest("Get Attendance", "✅", `Retrieved ${count} attendance records`);
    } else {
      logTest(
        "Get Attendance",
        "❌",
        `Status: ${getAttendanceResponse.status} - ${getAttendanceResponse.body?.message}`
      );
    }

    // TEST 9: Get Timeline
    console.log("\n📝 TEST 9: Get All Timeline");
    console.log("─".repeat(60));

    const getTimelineResponse = await makeRequest("GET", "/admin/timeline");

    if (getTimelineResponse.status === 200) {
      const count = getTimelineResponse.body?.data?.length || 0;
      logTest("Get Timeline", "✅", `Retrieved ${count} timeline entries`);
    } else {
      logTest(
        "Get Timeline",
        "❌",
        `Status: ${getTimelineResponse.status} - ${getTimelineResponse.body?.message}`
      );
    }

    // TEST 10: Get Research
    console.log("\n📝 TEST 10: Get All Research");
    console.log("─".repeat(60));

    const getResearchResponse = await makeRequest("GET", "/admin/research");

    if (getResearchResponse.status === 200) {
      const count = getResearchResponse.body?.data?.length || 0;
      logTest("Get Research", "✅", `Retrieved ${count} research items`);
    } else {
      logTest(
        "Get Research",
        "❌",
        `Status: ${getResearchResponse.status} - ${getResearchResponse.body?.message}`
      );
    }

    // Summary
    console.log("\n" + "═".repeat(60));
    console.log("\n📊 TEST SUMMARY");
    console.log("─".repeat(60));

    const passed = results.filter((r) => r.status === "✅").length;
    const failed = results.filter((r) => r.status === "❌").length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${results.length}`);

    if (failed > 0) {
      console.log("\n⚠️  Failed Tests:");
      results
        .filter((r) => r.status === "❌")
        .forEach((r) => {
          console.log(`   • ${r.name}: ${r.details}`);
        });
    }

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.error("\n❌ Test suite error:", error.message);
  }
}

// Run tests
runTests();
