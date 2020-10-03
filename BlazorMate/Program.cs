using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.Globalization;

namespace BlazorMate
{
  public class Program {
    public static void Main(string[] args)
    {
      CultureInfo.DefaultThreadCurrentCulture =
        CultureInfo.DefaultThreadCurrentUICulture =
        CultureInfo.CreateSpecificCulture("de-CH");
      CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder => {
              webBuilder.UseStartup<Startup>();
            });
  }
}
