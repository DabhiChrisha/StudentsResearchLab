#!/usr/bin/env node
/**
 * Admin API Testing Script - Using fetch
 * Tests all admin endpoints and logs issues found
 */

const https = require("https");
const http = require("http");
const { URL } = require("url");

const BASE_URL = "http://localhost:8000/api";
let adminToken = null;

// Fetch function
async function fetchAPI(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const isHttps = url.protocol === "https:";
    const client = isHttps ? https : http;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (adminToken) {
      options.headers.Authorization = `Bearer ${adminToken}`;
    }

    const req = client.request(url, options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
            raw: data,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: null,
            raw: data,
            parseError: e.message,
          });
        }
      });
    });

    req.on("error", reject);

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Test results
const results = [];

function logTest(name, status, details) {
  results.push({ name, status, details });
  const emoji = status === "✅" ? "✅" : "❌";
  console.log(`\n${emoji} ${name}`);
  if (details) console.log(`   → ${details}`);
}

async function runTests() {
  console.log("🚀 Admin API Comprehensive Test Suite\n");
  console.log(`Server: ${BASE_URL}`);
  console.log("═".repeat(70));

  try {
    // Test 1: Login
    console.log("\n[1/10] Testing Admin Login...");
    const loginRes = await fetchAPI("POST", "/admin/login", {
      email: "adminsrl@gmail.com",
      password: "Admin@SRL",
    });

    if (loginRes.status === 200 && loginRes.data?.token) {
      adminToken = loginRes.data.token;
      logTest(
        "Admin Login",
        "✅",
        `Token: ${loginRes.data.token.substring(0, 20)}...`
      );
    } else {
      logTest(
        "Admin Login",
        "❌",
        `Status ${loginRes.status}: ${loginRes.data?.message || loginRes.raw}`
      );
      throw new Error("Login failed");
    }

    // Test 2: Verify Token
    console.log("\n[2/10] Testing Token Verification...");
    const verifyRes = await fetchAPI("POST", "/admin/verify");

    if (verifyRes.status === 200) {
      logTest("Verify Token", "✅", "Token valid");
    } else {
      logTest("Verify Token", "❌", `Status ${verifyRes.status}`);
    }

    // Test 3: Get Students
    console.log("\n[3/10] Testing Get Students...");
    const studentsRes = await fetchAPI("GET", "/admin/students");

    if (studentsRes.status === 200) {
      const count = studentsRes.data?.data?.length || 0;
      logTest("Get Students", "✅", `Retrieved ${count} students`);
    } else {
      logTest(
        "Get Students",
        "❌",
        `Status ${studentsRes.status}: ${studentsRes.data?.message || studentsRes.raw}`
      );
    }

    // Test 4: Create Student
    console.log("\n[4/10] Testing Create Student...");
    const testEn = `TEST${Date.now()}`;
    const createStudRes = await fetchAPI("POST", "/admin/students", {
      student_name: "Test Student Admin",
      enrollment_no: testEn,
      email: `test${Date.now()}@test.com`,
      contact_no: "9876543210",
      department: "CE",
      institute_name: "LDRP-ITR",
      semester: 4,
      division: "A",
      batch: "2023",
      gender: "Male",
    });

    if (createStudRes.status === 201) {
      logTest("Create Student", "✅", `Created: ${testEn}`);
    } else {
      logTest(
        "Create Student",
        "❌",
        `Status ${createStudRes.status}: ${createStudRes.data?.message || createStudRes.raw.substring(0, 100)}`
      );
    }

    // Test 5: Get Activities
    console.log("\n[5/10] Testing Get Activities...");
    const activitiesRes = await fetchAPI("GET", "/admin/activities");

    if (activitiesRes.status === 200) {
      const count = activitiesRes.data?.data?.length || 0;
      logTest("Get Activities", "✅", `Retrieved ${count} activities`);
    } else {
      logTest(
        "Get Activities",
        "❌",
        `Status ${activitiesRes.status}: ${activitiesRes.data?.message || activitiesRes.raw}`
      );
    }

    // Test 6: Create Activity
    console.log("\n[6/10] Testing Create Activity...");
    const createActRes = await fetchAPI("POST", "/admin/activities", {
      title: `Test Activity ${Date.now()}`,
      description: "Test activity description",
      category: "Workshop",
      date: new Date().toISOString(),
      link: "https://example.com",
      brief: "Quick brief",
      photo: "https://example.com/photo.jpg",
    });

    if (createActRes.status === 201) {
      logTest(
        "Create Activity",
        "✅",
        `Created activity ID: ${createActRes.data?.data?.id}`
      );
    } else {
      logTest(
        "Create Activity",
        "❌",
        `Status ${createActRes.status}: ${createActRes.data?.message || createActRes.raw.substring(0, 100)}`
      );
    }

    // Test 7: Get Scores
    console.log("\n[7/10] Testing Get Scores...");
    const scoresRes = await fetchAPI("GET", "/admin/scores");

    if (scoresRes.status === 200) {
      const count = scoresRes.data?.data?.length || 0;
      logTest("Get Scores", "✅", `Retrieved ${count} scores`);
    } else {
      logTest(
        "Get Scores",
        "❌",
        `Status ${scoresRes.status}: ${scoresRes.data?.message || scoresRes.raw}`
      );
    }

    // Test 8: Get Attendance
    console.log("\n[8/10] Testing Get Attendance...");
    const attRes = await fetchAPI("GET", "/admin/attendance");

    if (attRes.status === 200) {
      const count = attRes.data?.data?.length || 0;
      logTest("Get Attendance", "✅", `Retrieved ${count} records`);
    } else {
      logTest(
        "Get Attendance",
        "❌",
        `Status ${attRes.status}: ${attRes.data?.message || attRes.raw}`
      );
    }

    // Test 9: Get Timeline
    console.log("\n[9/10] Testing Get Timeline...");
    const timeRes = await fetchAPI("GET", "/admin/timeline");

    if (timeRes.status === 200) {
      const count = timeRes.data?.data?.length || 0;
      logTest("Get Timeline", "✅", `Retrieved ${count} entries`);
    } else {
      logTest(
        "Get Timeline",
        "❌",
        `Status ${timeRes.status}: ${timeRes.data?.message || timeRes.raw}`
      );
    }

    // Test 10: Get Research
    console.log("\n[10/10] Testing Get Research...");
    const researchRes = await fetchAPI("GET", "/admin/research");

    if (researchRes.status === 200) {
      const count = researchRes.data?.data?.length || 0;
      logTest("Get Research", "✅", `Retrieved ${count} items`);
    } else {
      logTest(
        "Get Research",
        "❌",
        `Status ${researchRes.status}: ${researchRes.data?.message || researchRes.raw}`
      );
    }

    // Summary
    console.log("\n" + "═".repeat(70));
    console.log("\n📊 RESULTS SUMMARY");
    console.log("─".repeat(70));

    const passed = results.filter((r) => r.status === "✅").length;
    const failed = results.filter((r) => r.status === "❌").length;

    console.log(`✅ Passed: ${passed}/${results.length}`);
    console.log(`❌ Failed: ${failed}/${results.length}`);

    if (failed > 0) {
      console.log("\n⚠️  FAILED TESTS:");
      results
        .filter((r) => r.status === "❌")
        .forEach((r, i) => {
          console.log(`\n${i + 1}. ${r.name}`);
          console.log(`   Issue: ${r.details}`);
        });
    } else {
      console.log("\n🎉 All tests passed!");
    }

    console.log("\n" + "═".repeat(70) + "\n");
  } catch (error) {
    console.error("\n❌ Fatal Error:", error.message);
  }
}

// Run
runTests();
