$ErrorActionPreference = "Stop"

# Get token
$loginResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/admin/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{email="adminsrl@gmail.com"; password="Admin@SRL"} | ConvertTo-Json) `
  -UseBasicParsing

$token = ($loginResponse.Content | ConvertFrom-Json).token
Write-Host "Login successful. Token: $($token.Substring(0, 20))..."

# Test Create Activity with detailed error handling
$activityData = @{
    title = "Test Activity $(Get-Random)"
    description = "Test description"
    date = (Get-Date).ToUniversalTime().ToString("o")
    link = "https://example.com"
    brief = "Brief description"
    photo = "https://example.com/photo.jpg"
} | ConvertTo-Json

Write-Host "Request Body:"
Write-Host $activityData

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/admin/activities" `
      -Method Post `
      -ContentType "application/json" `
      -Headers @{"Authorization" = "Bearer $token"} `
      -Body $activityData `
      -UseBasicParsing

    Write-Host "SUCCESS!"
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "ERROR CAUGHT!"
    Write-Host "Exception Message: $($_.Exception.Message)"
    Write-Host "Response Status: $($_.Exception.Response.StatusCode.Value)"
    
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $errorResponse = $reader.ReadToEnd()
    Write-Host "Error Response Body: $errorResponse"
    $reader.Close()
    $stream.Close()
}
