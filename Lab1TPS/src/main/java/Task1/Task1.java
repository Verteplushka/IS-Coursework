package Task1;

public class Task1 {

    public static double sec(double x, int terms) {
        // Приведение x к диапазону [0, π]
        x = x % (2 * Math.PI);
        if (x < 0) {
            x += 2 * Math.PI;
        }
        if (x > Math.PI) {
            x = 2 * Math.PI - x;
        }

        double cosX = 1.0;
        double term = 1.0;

        for (int n = 1; n < terms; n++) {
            // Ряд Тейлора для косинуса
            term *= -x * x / ((2 * n) * (2 * n - 1));
            cosX += term;
        }

        // Проверка деления на ноль
        if (Math.abs(cosX) < 1e-15) {
            throw new ArithmeticException("sec(x) не определён в данной точке (деление на ноль)");
        }

        return 1.0 / cosX;
    }
}
