# owf: the Docker installation's command for Windows, the same commands as ./owf (the shell version). Run it as owf.cmd.
#   .\owf.cmd status | logs | monitor | start | stop | restart | update | env | cli | password | setup | help
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
function Fail($message, $code = 1) { [Console]::Error.WriteLine($message); exit $code }
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { Fail 'Docker is not installed' }

function Setting($name) {
    if (-not (Test-Path .env)) { return '' }
    $line = Get-Content .env | Where-Object { $_ -like "$name=*" } | Select-Object -First 1
    if ($line) { return $line.Substring($name.Length + 1) } else { return '' }
}
$db = Setting 'MONGO_DB_URL'
$image = Setting 'BPMN_IMAGE'
$port = Setting 'PORT'; if (-not $port) { $port = '3000' }

# docker compose with the Compose files setup.sh chose: MongoDB's overlay, a local build's.
# The command is one string and the user's arguments an array, as written: PowerShell would read --options passed to a function.
function Dc([string]$command, [string[]]$more = @()) {
    $files = @('-f', 'docker-compose.yml')
    if ($db -like 'mongodb://mongo:*') { $files += @('-f', 'docker-compose.mongo.yml') }
    if ($image -like '*:local') { $files += @('-f', 'docker-compose.build.yml') }
    & docker compose @files @($command -split ' ') @more
    if ($LASTEXITCODE) { exit $LASTEXITCODE }
}

# the sign-in page's HTTP status, without following its redirects
function HttpStatus {
    try {
        $request = [System.Net.HttpWebRequest]::Create("http://127.0.0.1:$port/login")
        $request.AllowAutoRedirect = $false; $request.Timeout = 3000
        $response = $request.GetResponse(); $code = [int]$response.StatusCode; $response.Close(); return $code
    } catch [System.Net.WebException] {
        if ($_.Exception.Response) { return [int]$_.Exception.Response.StatusCode } else { return 'unavailable' }
    }
}

function Ask($question) { (Read-Host $question) -match '^(y|yes)$' }

$cmd = if ($args.Count) { $args[0] } else { 'help' }
$rest = if ($args.Count -gt 1) { [string[]]$args[1..($args.Count - 1)] } else { @() }

switch ($cmd) {
    { $_ -in 'help', '-h', '--help' } {
        @'
BPMN Server Docker management (Windows)

  owf status              Container state and HTTP endpoint
  owf logs [options]      Follow server logs; --tail=100 for a snapshot
  owf monitor             Live container stats and recent logs (Ctrl+C to stop)
  owf start               Start the configured installation
  owf stop                Stop without deleting volumes
  owf restart             Recreate container to apply .env changes
  owf update              Pull or rebuild image, then recreate
  owf env                 Edit .env and optionally apply
  owf cli [arguments]     Application console in container
  owf password            Display initial admin password from .env
  owf setup               Create .env with random keys (as up.cmd does)
  owf help                This help

Memory database mode loses user and instance data on recreation.
CLI runs in a separate process and cannot access the live memory database.
'@
    }
    'status' {
        "BPMN Server Docker: $PSScriptRoot"
        Dc 'ps -a'
        "URL: http://localhost:$port/login (HTTP $(HttpStatus))"
    }
    'logs' { if ($rest.Count) { Dc 'logs' ($rest + 'server') } else { Dc 'logs -f server' } }
    'monitor' {
        while ($true) {
            Clear-Host; Get-Date
            Dc 'ps -a'
            $id = & docker compose ps -q server
            if ($id) { docker stats --no-stream $id }
            Dc 'logs --tail=12 server'
            Start-Sleep -Seconds 3
        }
    }
    'start' { Dc 'up -d --remove-orphans'; "Open http://localhost:$port" }
    'stop' { Dc 'stop' }
    'restart' { 'Recreating container (memory database will be reset).'; Dc 'up -d --force-recreate --remove-orphans' }
    'update' {
        if ($image -like '*:local') { Dc 'up -d --build --force-recreate --remove-orphans' }
        else { Dc 'pull server'; Dc 'up -d --force-recreate --remove-orphans' }
    }
    'env' {
        if (-not (Test-Path .env)) { Fail 'No .env: run owf setup' }
        Start-Process notepad.exe .env -Wait
        if (Ask 'Apply changes now? [y/N]') { Dc 'up -d --force-recreate --remove-orphans' } else { 'Saved; run owf restart to apply.' }
    }
    'cli' {
        if ($db -eq 'memory') { Write-Warning 'separate CLI process cannot access the running in-memory database.' }
        Dc 'exec server npm run cli --' $rest
    }
    'password' {
        $value = Setting 'ADMIN_PASSWORD'
        if (-not $value) { Fail "No initial ADMIN_PASSWORD in $PSScriptRoot\.env" }
        "Initial admin password (not a reset), from $PSScriptRoot\.env: $value"
    }
    'setup' {
        if (Test-Path .env) { '.env exists: edit it with owf env (rename it first for a new one).'; break }
        $key = { [guid]::NewGuid().ToString('N') }
        $password = & $key
        'PORT=3000', 'MONGO_DB_URL=memory', 'REQUIRE_AUTHENTICATION=true', 'ENFORCE_SECURITY=true',
            'API_SERVICE_USER_NAME=integration', 'API_SERVICE_USER_GROUPS=SYSTEM', "API_KEY=$(& $key)",
            "ADMIN_API_KEY=$(& $key)", "SESSION_SECRET=$(& $key)", "ADMIN_PASSWORD=$password" |
            Set-Content -Encoding ascii .env
        "Created .env (database: memory); initial admin password: $password"
        'For MongoDB: set MONGO_DB_URL=mongodb://mongo:27017/bpmn with owf env. Then: owf start'
    }
    default { Fail "Unknown command: $cmd (use owf help)" 2 }
}
