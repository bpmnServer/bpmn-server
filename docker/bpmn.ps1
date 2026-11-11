# bpmn.ps1: the name of owf.ps1 before 3.7, kept until 4.0. It runs owf.ps1, downloading it the first time.
$owf = Join-Path $PSScriptRoot 'owf.ps1'
if (-not (Test-Path $owf)) {
    Write-Host 'bpmn is now owf: downloading owf.cmd and owf.ps1 (use owf.cmd from now on)'
    foreach ($file in 'owf.cmd', 'owf.ps1') {
        Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/$file" -OutFile (Join-Path $PSScriptRoot $file)
    }
}
& $owf @args
exit $LASTEXITCODE
