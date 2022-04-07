namespace visose.Shared;

public class RobotsPricing
{
    public int Init { get; set; } = 950;
    public double Decay { get; set; } = -0.2;
    public int Round { get; set; } = 50;
    public int MaxRobots { get; set; } = 6;

    public int CalcPrice(int count)
    {
        if (count < 1 || count > MaxRobots)
            throw new ArgumentOutOfRangeException(nameof(count));

        double r = Math.Exp(Decay);
        double sum = Init * (Math.Pow(r, count) - 1) / (r - 1);
        var gbp = Math.Floor(sum / Round) * Round;
        return (int)(gbp * 100);
    }
}
