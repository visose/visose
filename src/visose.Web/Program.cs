using Statiq.App;
using Statiq.Web;
using Statiq.Common;
using Statiq.Core;
using Statiq.Minification;

var app = Bootstrapper
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
  });

if (Environment.GetEnvironmentVariable("CI") == "true")
{
    app.ModifyPipeline("Assets", p => p.WithProcessModules
        (
            AddMinifier(".css", new MinifyCss()),
            AddMinifier(".js", new MinifyJs())
        ))
        .ModifyPipeline("Content", p => p.WithPostProcessModules
        (
            AddMinifier(".html", new MinifyHtml())
        ));

    IModule AddMinifier(string extension, IModule minifier) =>
        new ExecuteIf(Config.FromDocument(doc => doc.Destination.Extension == extension))
        {
            minifier
        };
}

await app.RunAsync();