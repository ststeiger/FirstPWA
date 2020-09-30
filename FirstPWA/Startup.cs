using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


namespace FirstPWA
{


    public class Startup
    {

        public IConfiguration Configuration { get; }


        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // services.AddControllersWithViews();
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                // app.UseHsts();
            }

            // app.UseHttpsRedirection();


            app.UseDefaultFiles(new DefaultFilesOptions()
            {
                DefaultFileNames = new System.Collections.Generic.List<string>()
                {
                    "index.html"
                }
            });

            app.UseStaticFiles();

            app.UseRouting();

            // app.UseAuthorization();

            string fakeForecast = @"{
  ""fakeData"": true,
  ""latitude"": {@latitude},
  ""longitude"": {@longitude},
  ""timezone"": ""America/New_York"",
  ""currently"": {
    ""time"": 0,
    ""summary"": ""Clear"",
    ""icon"": ""clear-day"",
    ""temperature"": 43.4,
    ""humidity"": 0.62,
    ""windSpeed"": 3.74,
    ""windBearing"": 208
  },
  ""daily"": {
    ""data"": [
      {
        ""time"": 0,
        ""icon"": ""partly-cloudy-night"",
        ""sunriseTime"": 1553079633,
        ""sunsetTime"": 1553123320,
        ""temperatureHigh"": 52.91,
        ""temperatureLow"": 41.35
      },
      {
        ""time"": 86400,
        ""icon"": ""rain"",
        ""sunriseTime"": 1553165933,
        ""sunsetTime"": 1553209784,
        ""temperatureHigh"": 48.01,
        ""temperatureLow"": 44.17
      },
      {
        ""time"": 172800,
        ""icon"": ""rain"",
        ""sunriseTime"": 1553252232,
        ""sunsetTime"": 1553296247,
        ""temperatureHigh"": 50.31,
        ""temperatureLow"": 33.61
      },
      {
        ""time"": 259200,
        ""icon"": ""partly-cloudy-night"",
        ""sunriseTime"": 1553338532,
        ""sunsetTime"": 1553382710,
        ""temperatureHigh"": 46.44,
        ""temperatureLow"": 33.82
      },
      {
        ""time"": 345600,
        ""icon"": ""partly-cloudy-night"",
        ""sunriseTime"": 1553424831,
        ""sunsetTime"": 1553469172,
        ""temperatureHigh"": 60.5,
        ""temperatureLow"": 43.82
      },
      {
        ""time"": 432000,
        ""icon"": ""rain"",
        ""sunriseTime"": 1553511130,
        ""sunsetTime"": 1553555635,
        ""temperatureHigh"": 61.79,
        ""temperatureLow"": 32.8
      },
      {
        ""time"": 518400,
        ""icon"": ""rain"",
        ""sunriseTime"": 1553597430,
        ""sunsetTime"": 1553642098,
        ""temperatureHigh"": 48.28,
        ""temperatureLow"": 33.49
      },
      {
        ""time"": 604800,
        ""icon"": ""snow"",
        ""sunriseTime"": 1553683730,
        ""sunsetTime"": 1553728560,
        ""temperatureHigh"": 43.58,
        ""temperatureLow"": 33.68
      }
    ]
  }
}";

            app.Use(async (context, next) =>
            {
                string url = context.Request.Path.Value;

                // Redirect to an external URL
                if (url.StartsWith("/forecast"))
                {
                    string location = "40.7720232,-73.9732319";
                    string[] latLng = location.Split(',');

                    string newFakeForecast = fakeForecast
                        .Replace("{@latitude}", latLng[0])
                        .Replace("{@longitude}", latLng[1]);

                    context.Response.StatusCode = 200;
                    context.Response.ContentType = "application/json; encoding=utf-8";

                    await context.Response.WriteAsync(newFakeForecast);
                    return;   // short circuit
                }

                await next();
            });


            /*
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
            */

        } // End Sub Configure 


    } // End Class Startup 


} // End Namespace FirstPWA 
