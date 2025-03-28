package Task3;

class Marvin {
    private String name;
    private Intonation intonation;

    public Marvin(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Intonation getIntonation() {
        return intonation;
    }

    public void setIntonation(Intonation intonation) {
        this.intonation = intonation;
    }

    public void expressEmotion(Society society, Intonation intonation, Emotion... emotions) {
        this.intonation = intonation; // Устанавливаем интонацию через метод
        System.out.println("С интонацией и тембром: " + intonation);
        System.out.print(name + " выражает эмоции: ");

        if (emotions.length == 0) {
            System.out.println("никаких эмоций.");
        } else {
            for (int i = 0; i < emotions.length; i++) {
                System.out.print(emotions[i]);
                if (i < emotions.length - 1) System.out.print(", ");
            }
            System.out.println();
        }

        System.out.println("По отношению к: " + society);
    }
}

