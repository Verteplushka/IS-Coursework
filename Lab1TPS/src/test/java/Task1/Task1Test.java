package Task1;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class Task1Test {

    private static final double PRECISION = 1e-15; // Точность вычислений
    private static final int TERMS = 30; // Количество членов ряда Тейлора

    @Test
    @DisplayName("sec(0) = 1")
    void testSecZero() {
        // Проверяем, что sec(0) возвращает 1
        double x = 0;
        double expected = 1.0;
        double result = Task1.sec(x, TERMS);
        assertEquals(expected, result, PRECISION);
    }

    @Test
    @DisplayName("sec(pi) = -1")
    void testSecPi() {
        // Проверяем, что sec(π) возвращает -1
        double x = Math.PI;
        double expected = -1.0;
        double result = Task1.sec(x, TERMS);
        assertEquals(expected, result, PRECISION);
    }

    @Test
    @DisplayName("sec(pi / 2) не определён (деление на 0)")
    void testSecHalfPi() {
        // Проверяем, что sec(π/2) вызывает исключение (деление на 0)
        double x = Math.PI / 2;
        assertThrows(ArithmeticException.class, () -> Task1.sec(x, TERMS));
    }

    @Test
    @DisplayName("sec(x) чётная функция")
    void testEvenFunction() {
        // Проверяем, что sec(x) является чётной функцией: sec(-x) = sec(x)
        double x = 1.5;
        double resultPositive = Task1.sec(x, TERMS);
        double resultNegative = Task1.sec(-x, TERMS);
        assertEquals(resultPositive, resultNegative, PRECISION);
    }

    @Test
    @DisplayName("Task1.sec(x) против стандартного Math.sec(x)")
    void testAgainstLibrary() {
        // Проверяем, что sec(x) совпадает со значением 1 / Math.cos(x)
        for (double x = -Math.PI + 0.001; x <= Math.PI - 0.001; x += 0.001) {
            double expected = 1.0 / Math.cos(x);
            double result = Task1.sec(x, TERMS);

            // Погрешность
            double tolerance = 1e-7;
            //System.out.println("expected: " + expected + " result: " + result+" tolerance"+tolerance + " expected - result:"+(expected - result));  // Вывод ошибки
            // Проверка, что разница между ожидаемым и фактическим результатом меньше погрешности
            assertTrue(Math.abs(expected - result) < tolerance,
                    "Expected: " + expected + " but got: " + result);
        }
    }


    @Test
    @DisplayName("Уменьшение ошибки при увеличении количества итераций")
    void testError() {
        double x = 1.0;
        double prevError = Double.MAX_VALUE;
        for (int terms = 2; terms <= 10; terms++) {
            double result = Task1.sec(x, terms);
            double error = Math.abs(result - (1.0 / Math.cos(x)));
            //System.out.println("terms: " + terms + " error: " + error);  // Вывод ошибки
            assertTrue(error < prevError || error < 1e-14); // Ошибка должна уменьшаться, либо быть очень маленькой
            prevError = error;
        }
    }

}
