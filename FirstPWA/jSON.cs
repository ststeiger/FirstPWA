
namespace FirstPWA
{


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
