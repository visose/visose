using Statiq.App;
using Statiq.Web;
using Statiq.Common;

await Bootstrapper
  .Factory
  .CreateWeb(args)
  .ConfigureFileSystem(f =>
  {
      var currentDir = Directory.GetCurrentDirectory();
      var artifacts = Path.GetFullPath("../../artifacts/", currentDir);
      var input = Path.GetFullPath("input", currentDir);

      f.RootPath = artifacts;
      f.InputPaths.Clear();
      f.InputPaths.Add(input);
  })
  .RunAsync();