package Task3;


public class Main {
    public static void main(String[] args) {
        // Создаем эмоции Марвина
        Emotion contempt = new Emotion("презрение");
        Emotion horror = new Emotion("ужас");

        // Создаем интонацию
        Intonation intonation = new Intonation("микромодуляция", 100, false);

        // Создаем Марвина (без указания интонации и эмоций)
        Marvin marvin = new Marvin("Марвин");

        // Создаем человечество (объект, к которому Марвин выражает эмоции)
        Society humanity = new Society("человеческое общество");

        // Марвин выражает эмоции по отношению к человечеству с заданной интонацией
        marvin.expressEmotion(humanity, intonation, contempt, horror);
    }
}
