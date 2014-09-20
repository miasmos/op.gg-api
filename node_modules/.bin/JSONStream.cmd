@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\JSONStream\index.js" %*
) ELSE (
  node  "%~dp0\..\JSONStream\index.js" %*
)