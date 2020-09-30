
namespace FirstPWA
{

    // https://docs.microsoft.com/en-us/aspnet/core/migration/http-modules?view=aspnetcore-3.1
    // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/routing?view=aspnetcore-3.1


    // https://stackoverflow.com/questions/38632723/what-can-service-workers-do-that-web-workers-cannot


    // https://itprosteer.com/how-long-does-a-pwa-development-project-take/#:~:text=Summary%3A,4%20weeks%20%2D%20discovery
    // https://codelabs.developers.google.com/codelabs/your-first-pwapp/#1
    // https://developers.google.com/web/ilt/pwa/live-data-in-the-service-worker
    // from https://github.com/googlecodelabs/your-first-pwapp 
    // https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
    // https://web.dev/progressive-web-apps/


    public partial class Temperatures
    {
        public bool FakeData { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Timezone { get; set; }
        public Currently Currently { get; set; }
        public Daily Daily { get; set; }
    }


    public partial class Currently
    {
        public long Time { get; set; }
        public string Summary { get; set; }
        public string Icon { get; set; }
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public double WindSpeed { get; set; }
        public long WindBearing { get; set; }
    }


    public partial class Daily
    {
        public Datum[] Data { get; set; }
    }

    public partial class Datum
    {
        public long Time { get; set; }
        public string Icon { get; set; }
        public long SunriseTime { get; set; }
        public long SunsetTime { get; set; }
        public double TemperatureHigh { get; set; }
        public double TemperatureLow { get; set; }
    }


}
