$curDir = Get-Location;
wt.exe -w 0 nt -d $curDir dotnet run --project ./src/visose.Web/visose.Web.csproj -- preview;
wt.exe -w 0 nt -d $curDir pwsh -command "swa start http://localhost:5080 --api-location ./src/visose.Api";
