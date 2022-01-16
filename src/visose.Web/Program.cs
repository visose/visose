using Statiq.App;
using Statiq.Web;
using Statiq.Common;

var statiq = Bootstrapper
  .Factory
  .CreateWeb(args);

var currentDir = Directory.GetCurrentDirectory();
var artifacts = Path.GetFullPath("../../artifacts/", currentDir);
var input = Path.GetFullPath("input", currentDir);

var files = statiq.FileSystem;
files.RootPath = artifacts;
files.InputPaths.Clear();
files.InputPaths.Add(new NormalizedPath(input));

await statiq.RunAsync();