// Copyright (c) 2020 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpteaMate.Web.Toc.Domain;

namespace OpteaMate.Web {

  public class Startup {

    readonly string LocalhostOrigins = "LocalhostOrigins";
    private readonly IWebHostEnvironment _env;

    public Startup(IConfiguration configuration, IWebHostEnvironment env) {
      Configuration = configuration;
      _env = env;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services) {

      services.AddCors(options => {
        options.AddPolicy(name: LocalhostOrigins,
                          builder => {
                            builder.WithOrigins(
                              "http://localhost:4700");
                          });

      });

      services.AddDbContext<OpteaMateContext>(opt => opt.UseSqlite("DefaultConnection"));

      if (_env.IsDevelopment()) {
        services.AddSingleton<ITocService>(new TocServiceFake());
      }
      else {
        services.AddSingleton<ITocService>(new TocService());
      }

      // https://docs.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-nswag?view=aspnetcore-3.1&tabs=visual-studio
      services.AddSwaggerDocument(
        config => {
          config.PostProcess = document => {
            document.Info.Version = "v1";
            document.Info.Title = "OpteaMate API";
            document.Info.Description = "Schedule your team events.";
            document.Info.Contact = new NSwag.OpenApiContact {
              Name = "Stefan Grimm",
              Email = "stefangrimm@hotmail.com",
              Url = string.Empty // "https://twitter.com/potus"
            };
            document.Info.License = new NSwag.OpenApiLicense {
              Name = "Use under CC BY-NC-ND 4.0",
              Url = "https://creativecommons.org/licenses/by-nc-nd/4.0/"
            };
          };
        });

      // In production, the Angular files will be served from this directory
      services.AddSpaStaticFiles(configuration => {
        configuration.RootPath = "ClientApp/dist";
      });

      services.AddControllersWithViews();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      
      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
      }
      else {
        app.UseExceptionHandler("/Error");
      }

      app.UseStaticFiles();
      app.UseOpenApi();
      app.UseSwaggerUi3();

      if (!env.IsDevelopment()) {
        app.UseSpaStaticFiles();
      }

      app.UseRouting();

      app.UseCors(LocalhostOrigins);

      app.UseEndpoints(endpoints => {
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action=Index}/{id?}");
      });

      app.UseSpa(spa => {
        // To learn more about options for serving an Angular SPA from ASP.NET Core,
        // see https://go.microsoft.com/fwlink/?linkid=864501

        spa.Options.SourcePath = "ClientApp";

        if (env.IsDevelopment())
        {
          spa.UseAngularCliServer(npmScript: "start");
          // When starting Angular with ng serve or http-server -p 4200: 
          // spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
        }
       
      });
    }
  }
}
