namespace Sales.Helper
{
    public static class StringExtensions
    {
        public static string ToEnglishDigits(this string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            string[] arabic = { "٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩" };
            string[] english = { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };

            for (int i = 0; i < 10; i++)
                input = input.Replace(arabic[i], english[i]);

            return input;
        }
    }


    public static class StringHelper
    {
        public static string NormalizeNumbers(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            string[] arabic = { "٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩" };
            string[] english = { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };

            for (int i = 0; i < 10; i++)
                input = input.Replace(arabic[i], english[i]);

            return input;
        }
    }

}
