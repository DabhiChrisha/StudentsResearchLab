$token = ((Invoke-WebRequest -Uri "http://localhost:8000/api/admin/login" -Method Post -ContentType "application/json" -Body (@{email="adminsrl@gmail.com"; password="Admin@SRL"} | ConvertTo-Json) -UseBasicParsing).Content | ConvertFrom-Json).token
Write-Host "Token received: $($token.Substring(0, 20))..."

# Simple test
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/admin/students" `
  -Method Get `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing

Write-Host "GET /admin/students: Status $($response.StatusCode)"

# Now Try POST without fields that caused issues
$simple_activity = @{
    title = "Activity $(Get-Random)"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/admin/activities" `
      -Method Post `
      -ContentType "application/json" `
      -Headers @{"Authorization" = "Bearer $token"} `
      -Body $simple_activity `
      -UseBasicParsing
    
    Write-Host "Create Activity: Status $($response.StatusCode)"
    Write-Host $response.Content
} catch {
    Write-Host "Create Activity Failed - Status: $($_.Exception.Response.StatusCode.Value)"
}
