package Task1;

public class Main {
    public static void main(String[] args) {
        for (double x = -2 * Math.PI; x < 2 * Math.PI; x += 0.1) {
            try {
                System.out.println("sec(" + x + ") = " + Task1.sec(x, 10));
            } catch (ArithmeticException e) {
                System.out.println("sec(" + x + ") не определён");
            }
        }
    }
}