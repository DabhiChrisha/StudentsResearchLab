# Admin API Testing Script - Simple Version
$BaseURL = "http://localhost:8000/api"
$Results = @()
$AdminToken = $null

function Test-API {
    param(
        [string]$TestName,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [bool]$RequireToken = $true
    )
    
    try {
        $Headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($RequireToken -and $AdminToken) {
            $Headers["Authorization"] = "Bearer $AdminToken"
        }
        
        $Params = @{
            Uri = "$BaseURL$Endpoint"
            Method = $Method
            Headers = $Headers
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $Params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $Response = Invoke-WebRequest @Params
        $Content = $Response.Content | ConvertFrom-Json
        
        return @{
            Name = $TestName
            Status = "PASS"
            Details = "Success (Status $($Response.StatusCode))"
            Response = $Content
            Code = $Response.StatusCode
        }
    }
    catch {
        $StatusCode = $_.Exception.Response.StatusCode.Value
        $ErrorMsg = "Unknown"
        try {
            $Stream = $_.Exception.Response.GetResponseStream()
            $Reader = New-Object System.IO.StreamReader($Stream)
            $ResponseText = $Reader.ReadToEnd()
            $Reader.Close()
            $ErrorData = $ResponseText | ConvertFrom-Json
            if ($ErrorData.message) { $ErrorMsg = $ErrorData.message }
        }
        catch { }
        
        return @{
            Name = $TestName
            Status = "FAIL"
            Details = "Status $StatusCode - $ErrorMsg"
            Code = $StatusCode
        }
    }
}

Write-Host ""
Write-Host "=============================================================="
Write-Host "ADMIN API COMPREHENSIVE TEST SUITE"
Write-Host "=============================================================="
Write-Host ""
Write-Host "Server: $BaseURL"
Write-Host ""

# TEST 1: Login
Write-Host "[1/10] Testing Admin Login..."
$LoginResult = Test-API -TestName "Admin Login" -Method "POST" -Endpoint "/admin/login" -Body @{
    email = "adminsrl@gmail.com"
    password = "Admin@SRL"
} -RequireToken $false

if ($LoginResult.Status -eq "PASS" -and $LoginResult.Response.token) {
    $AdminToken = $LoginResult.Response.token
    Write-Host "  PASS - Token obtained"
    $Results += $LoginResult
} else {
    Write-Host "  FAIL - Login failed"
    Write-Host "    Error: $($LoginResult.Details)"
    exit
}

# TEST 2: Verify Token
Write-Host ""
Write-Host "[2/10] Testing Token Verification..."
$VerifyResult = Test-API -TestName "Verify Token" -Method "POST" -Endpoint "/admin/verify"
Write-Host "  $($VerifyResult.Status) - $($VerifyResult.Details)"
$Results += $VerifyResult

# TEST 3: Get Students
Write-Host ""
Write-Host "[3/10] Testing Get All Students..."
$GetStudentsResult = Test-API -TestName "Get All Students" -Method "GET" -Endpoint "/admin/students"
if ($GetStudentsResult.Status -eq "PASS") {
    $Count = @($GetStudentsResult.Response.data).Count
    Write-Host "  PASS - Retrieved $Count students"
} else {
    Write-Host "  FAIL - $($GetStudentsResult.Details)"
}
$Results += $GetStudentsResult

# TEST 4: Create Student
Write-Host ""
Write-Host "[4/10] Testing Create Student..."
$TestEn = "TEST_$(Get-Random)"
$CreateStudentResult = Test-API -TestName "Create Student" -Method "POST" -Endpoint "/admin/students" -Body @{
    student_name = "Test Student"
    enrollment_no = $TestEn
    email = "test_$(Get-Random)@test.com"
    contact_no = "9876543210"
    department = "CE"
    institute_name = "LDRP-ITR"
    semester = 4
    division = "A"
    batch = "2023"
    gender = "Male"
}
if ($CreateStudentResult.Status -eq "PASS") {
    Write-Host "  PASS - Created student: $TestEn"
} else {
    Write-Host "  FAIL - $($CreateStudentResult.Details)"
}
$Results += $CreateStudentResult

# TEST 5: Get Activities
Write-Host ""
Write-Host "[5/10] Testing Get All Activities..."
$GetActivitiesResult = Test-API -TestName "Get All Activities" -Method "GET" -Endpoint "/admin/activities"
if ($GetActivitiesResult.Status -eq "PASS") {
    $Count = @($GetActivitiesResult.Response.data).Count
    Write-Host "  PASS - Retrieved $Count activities"
} else {
    Write-Host "  FAIL - $($GetActivitiesResult.Details)"
}
$Results += $GetActivitiesResult

# TEST 6: Create Activity
Write-Host ""
Write-Host "[6/10] Testing Create Activity..."
$CreateActivityResult = Test-API -TestName "Create Activity" -Method "POST" -Endpoint "/admin/activities" -Body @{
    title = "Test Activity"
    description = "Description"
    category = "Workshop"
    date = (Get-Date).ToUniversalTime().ToString("o")
    link = "https://example.com"
    brief = "Brief"
    photo = "https://example.com/photo.jpg"
}
if ($CreateActivityResult.Status -eq "PASS") {
    Write-Host "  PASS - Created activity ID: $($CreateActivityResult.Response.data.id)"
} else {
    Write-Host "  FAIL - $($CreateActivityResult.Details)"
}
$Results += $CreateActivityResult

# TEST 7: Get Scores
Write-Host ""
Write-Host "[7/10] Testing Get All Scores..."
$GetScoresResult = Test-API -TestName "Get All Scores" -Method "GET" -Endpoint "/admin/scores"
if ($GetScoresResult.Status -eq "PASS") {
    $Count = @($GetScoresResult.Response.data).Count
    Write-Host "  PASS - Retrieved $Count scores"
} else {
    Write-Host "  FAIL - $($GetScoresResult.Details)"
}
$Results += $GetScoresResult

# TEST 8: Get Attendance
Write-Host ""
Write-Host "[8/10] Testing Get All Attendance..."
$GetAttendanceResult = Test-API -TestName "Get All Attendance" -Method "GET" -Endpoint "/admin/attendance"
if ($GetAttendanceResult.Status -eq "PASS") {
    $Count = @($GetAttendanceResult.Response.data).Count
    Write-Host "  PASS - Retrieved $Count attendance records"
} else {
    Write-Host "  FAIL - $($GetAttendanceResult.Details)"
}
$Results += $GetAttendanceResult

# TEST 9: Get Timeline
Write-Host ""
Write-Host "[9/10] Testing Get All Timeline..."
$GetTimelineResult = Test-API -TestName "Get All Timeline" -Method "GET" -Endpoint "/admin/timeline"
if ($GetTimelineResult.Status -eq "PASS") {
    $Count = @($GetTimelineResult.Response.data).Count
    Write-Host "  PASS - Retrieved $Count timeline entries"
} else {
    Write-Host "  FAIL - $($GetTimelineResult.Details)"
}
$Results += $GetTimelineResult

# TEST 10: Get Research
Write-Host ""
Write-Host "[10/10] Testing Get All Research..."
$GetResearchResult = Test-API -TestName "Get All Research" -Method "GET" -Endpoint "/admin/research"
if ($GetResearchResult.Status -eq "PASS") {
    $Count = @($GetResearchResult.Response.data).Count
    Write-Host "  PASS - Retrieved $Count research items"
} else {
    Write-Host "  FAIL - $($GetResearchResult.Details)"
}
$Results += $GetResearchResult

# Summary
Write-Host ""
Write-Host "=============================================================="
Write-Host "API TEST RESULTS SUMMARY"
Write-Host "=============================================================="
Write-Host ""

$Passed = @($Results | Where-Object { $_.Status -eq "PASS" }).Count
$Failed = @($Results | Where-Object { $_.Status -eq "FAIL" }).Count

Write-Host "PASS: $Passed/$($Results.Count)"
Write-Host "FAIL: $Failed/$($Results.Count)"
Write-Host ""

if ($Failed -gt 0) {
    Write-Host "FAILED TESTS:"
    Write-Host ""
    $Results | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  > $($_.Name)"
        Write-Host "    Error: $($_.Details)"
        Write-Host ""
    }
}

Write-Host "=============================================================="
Write-Host ""

if ($Passed -eq $Results.Count) {
    Write-Host "SUCCESS - All tests passed!"
}
