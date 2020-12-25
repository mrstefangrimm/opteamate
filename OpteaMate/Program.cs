// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace OpteaMate.Web {
  public class Program {
    public static void Main(string[] args) {
      CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder => {
              webBuilder.UseStartup<Startup>();
            });
  }
}
