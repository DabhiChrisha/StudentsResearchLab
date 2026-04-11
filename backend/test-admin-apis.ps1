# Admin API Testing Script - PowerShell (Fixed)

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
    
    $Result = $null
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
        
        $Result = @{
            Name = $TestName
            Status = "✅"
            Details = "Success (Status $($Response.StatusCode))"
            Response = $Content
        }
    }
    catch {
        $StatusCode = $_.Exception.Response.StatusCode.Value
        $ErrorMsg = "Unknown error"
        
        try {
            $Stream = $_.Exception.Response.GetResponseStream()
            $Reader = New-Object System.IO.StreamReader($Stream)
            $ResponseText = $Reader.ReadToEnd()
            $Reader.Close()
            $ErrorData = $ResponseText | ConvertFrom-Json
            if ($ErrorData.message) { $ErrorMsg = $ErrorData.message }
            elseif ($ErrorData.error) { $ErrorMsg = $ErrorData.error }
        }
        catch {
            $ErrorMsg = $_.Exception.Message
        }
        
        $Result = @{
            Name = $TestName
            Status = "❌"
            Details = "Status $StatusCode - $ErrorMsg"
            ErrorCode = $StatusCode
        }
    }
    
    return $Result
}

# Main Test Suite
Write-Host "🚀 Admin API Comprehensive Test Suite`n" -ForegroundColor Green
Write-Host "Server: $BaseURL`n"
Write-Host ("=" * 70)

# TEST 1: Login
Write-Host "`n[1/10] Testing Admin Login..." -ForegroundColor Cyan
$LoginResult = Test-API -TestName "Admin Login" -Method "POST" -Endpoint "/admin/login" -Body @{
    email = "adminsrl@gmail.com"
    password = "Admin@SRL"
} -RequireToken $false

Write-Host "  $($LoginResult.Status) $($LoginResult.Details)" -ForegroundColor $(if ($LoginResult.Status -eq "✅") { "Green" } else { "Red" })

if ($LoginResult.Status -eq "✅" -and $LoginResult.Response.token) {
    $AdminToken = $LoginResult.Response.token
    $Results += $LoginResult
} else {
    Write-Host "  ❌ Login failed, cannot proceed" -ForegroundColor Red
    exit
}

# TEST 2: Verify Token
Write-Host "`n[2/10] Testing Token Verification..." -ForegroundColor Cyan
$VerifyResult = Test-API -TestName "Verify Token" -Method "POST" -Endpoint "/admin/verify"
Write-Host "  $($VerifyResult.Status) $($VerifyResult.Details)" -ForegroundColor $(if ($VerifyResult.Status -eq "✅") { "Green" } else { "Red" })
$Results += $VerifyResult

# TEST 3: Get All Students
Write-Host "`n[3/10] Testing Get All Students..." -ForegroundColor Cyan
$GetStudentsResult = Test-API -TestName "Get All Students" -Method "GET" -Endpoint "/admin/students"
if ($GetStudentsResult.Status -eq "✅") {
    $Count = @($GetStudentsResult.Response.data).Count
    Write-Host "  ✅ Retrieved $Count students" -ForegroundColor Green
} else {
    Write-Host "  $($GetStudentsResult.Status) $($GetStudentsResult.Details)" -ForegroundColor Red
}
$Results += $GetStudentsResult

# TEST 4: Create Student
Write-Host "`n[4/10] Testing Create Student..." -ForegroundColor Cyan
$TestEn = "TEST_$(Get-Random)"
$CreateStudentResult = Test-API -TestName "Create Student" -Method "POST" -Endpoint "/admin/students" -Body @{
    student_name = "Test Student API"
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
if ($CreateStudentResult.Status -eq "✅") {
    Write-Host "  ✅ Created student: $TestEn" -ForegroundColor Green
} else {
    Write-Host "  $($CreateStudentResult.Status) $($CreateStudentResult.Details)" -ForegroundColor Red
}
$Results += $CreateStudentResult

# TEST 5: Get All Activities  
Write-Host "`n[5/10] Testing Get All Activities..." -ForegroundColor Cyan
$GetActivitiesResult = Test-API -TestName "Get All Activities" -Method "GET" -Endpoint "/admin/activities"
if ($GetActivitiesResult.Status -eq "✅") {
    $Count = @($GetActivitiesResult.Response.data).Count
    Write-Host "  ✅ Retrieved $Count activities" -ForegroundColor Green
} else {
    Write-Host "  $($GetActivitiesResult.Status) $($GetActivitiesResult.Details)" -ForegroundColor Red
}
$Results += $GetActivitiesResult

# TEST 6: Create Activity
Write-Host "`n[6/10] Testing Create Activity..." -ForegroundColor Cyan
$CreateActivityResult = Test-API -TestName "Create Activity" -Method "POST" -Endpoint "/admin/activities" -Body @{
    title = "Test Activity $(Get-Random)"
    description = "Test activity description"
    category = "Workshop"
    date = (Get-Date).ToUniversalTime().ToString("o")
    link = "https://example.com"
    brief = "Quick brief"
    photo = "https://example.com/photo.jpg"
}
if ($CreateActivityResult.Status -eq "✅") {
    Write-Host "  ✅ Created activity ID: $($CreateActivityResult.Response.data.id)" -ForegroundColor Green
} else {
    Write-Host "  $($CreateActivityResult.Status) $($CreateActivityResult.Details)" -ForegroundColor Red
}
$Results += $CreateActivityResult

# TEST 7: Get All Scores
Write-Host "`n[7/10] Testing Get All Scores..." -ForegroundColor Cyan
$GetScoresResult = Test-API -TestName "Get All Scores" -Method "GET" -Endpoint "/admin/scores"
if ($GetScoresResult.Status -eq "✅") {
    $Count = @($GetScoresResult.Response.data).Count
    Write-Host "  ✅ Retrieved $Count scores" -ForegroundColor Green
} else {
    Write-Host "  $($GetScoresResult.Status) $($GetScoresResult.Details)" -ForegroundColor Red
}
$Results += $GetScoresResult

# TEST 8: Get All Attendance
Write-Host "`n[8/10] Testing Get All Attendance..." -ForegroundColor Cyan
$GetAttendanceResult = Test-API -TestName "Get All Attendance" -Method "GET" -Endpoint "/admin/attendance"
if ($GetAttendanceResult.Status -eq "✅") {
    $Count = @($GetAttendanceResult.Response.data).Count
    Write-Host "  ✅ Retrieved $Count attendance records" -ForegroundColor Green
} else {
    Write-Host "  $($GetAttendanceResult.Status) $($GetAttendanceResult.Details)" -ForegroundColor Red
}
$Results += $GetAttendanceResult

# TEST 9: Get All Timeline
Write-Host "`n[9/10] Testing Get All Timeline..." -ForegroundColor Cyan
$GetTimelineResult = Test-API -TestName "Get All Timeline" -Method "GET" -Endpoint "/admin/timeline"
if ($GetTimelineResult.Status -eq "✅") {
    $Count = @($GetTimelineResult.Response.data).Count
    Write-Host "  ✅ Retrieved $Count timeline entries" -ForegroundColor Green
} else {
    Write-Host "  $($GetTimelineResult.Status) $($GetTimelineResult.Details)" -ForegroundColor Red
}
$Results += $GetTimelineResult

# TEST 10: Get All Research
Write-Host "`n[10/10] Testing Get All Research..." -ForegroundColor Cyan
$GetResearchResult = Test-API -TestName "Get All Research" -Method "GET" -Endpoint "/admin/research"
if ($GetResearchResult.Status -eq "✅") {
    $Count = @($GetResearchResult.Response.data).Count
    Write-Host "  ✅ Retrieved $Count research items" -ForegroundColor Green
} else {
    Write-Host "  $($GetResearchResult.Status) $($GetResearchResult.Details)" -ForegroundColor Red
}
$Results += $GetResearchResult

# Display Summary
Write-Host "`n" + ("=" * 70)
Write-Host "📊 API TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host ("=" * 70)

$Passed = @($Results | Where-Object { $_.Status -eq "✅" }).Count
$Failed = @($Results | Where-Object { $_.Status -eq "❌" }).Count

Write-Host "`n✅ Passed: $Passed/$($Results.Count)"
Write-Host "❌ Failed: $Failed/$($Results.Count)`n"

if ($Failed -gt 0) {
    Write-Host "⚠️  FAILED TESTS:" -ForegroundColor Yellow
    $Results | Where-Object { $_.Status -eq "❌" } | ForEach-Object {
        Write-Host "`n  • $($_.Name)" -ForegroundColor Red
        Write-Host "    → $($_.Details)" -ForegroundColor Yellow
    }
}

Write-Host "`n" + ("=" * 70) + "`n"

if ($Passed -eq $Results.Count) {
    Write-Host "🎉 All tests passed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Please review failed tests above" -ForegroundColor Yellow
}
