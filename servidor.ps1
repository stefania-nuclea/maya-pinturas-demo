# Servidor local mínimo para previsualizar el sitio (solo para pruebas).
# Uso: powershell -ExecutionPolicy Bypass -File servidor.ps1 [-Puerto 8080]
# El sitio también funciona abriendo index.html con doble clic.
param([int]$Puerto = 8080)
$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$tipos = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8';
  '.svg'='image/svg+xml'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.png'='image/png'; '.webp'='image/webp'; '.ico'='image/x-icon'; '.json'='application/json' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Puerto/")
$l.Start()
Write-Host "Sitio en http://localhost:$Puerto/"
while ($l.IsListening) {
  $ctx = $l.GetContext()
  try {
    $ruta = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    if ($ruta -eq '') { $ruta = 'index.html' }
    $archivo = [IO.Path]::GetFullPath((Join-Path $raiz $ruta))
    if ($archivo.StartsWith($raiz) -and (Test-Path $archivo -PathType Leaf)) {
      $bytes = [IO.File]::ReadAllBytes($archivo)
      $ext = [IO.Path]::GetExtension($archivo).ToLower()
      $ctx.Response.ContentType = if ($tipos.ContainsKey($ext)) { $tipos[$ext] } else { 'application/octet-stream' }
      $ctx.Response.Headers.Add('Cache-Control', 'no-store')
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else { $ctx.Response.StatusCode = 404 }
  } catch { $ctx.Response.StatusCode = 500 }
  $ctx.Response.Close()
}
