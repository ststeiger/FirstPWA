
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


    public partial class Datum
    {
        public long time { get; set; }
        public string icon { get; set; }
        public long sunriseTime { get; set; }
        public long sunsetTime { get; set; }
        public decimal temperatureHigh { get; set; }
        public decimal temperatureLow { get; set; }
    }


    public partial class Daily
    {
        public Datum[] data { get; set; }
    }


    public partial class Currently
    {
        public long time { get; set; }
        public string summary { get; set; }
        public string icon { get; set; }
        public decimal temperature { get; set; }
        public decimal humidity { get; set; }
        public decimal windSpeed { get; set; }
        public long windBearing { get; set; }
    }


    public partial class RootElement
    {
        public bool fakeData { get; set; }
        public decimal latitude { get; set; }
        public decimal longitude { get; set; }
        public string timezone { get; set; }
        public Currently currently { get; set; }
        public Daily daily { get; set; }
    }


}
