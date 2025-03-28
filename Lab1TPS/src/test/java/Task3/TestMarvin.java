package Task3;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class TestMarvin {

    private Marvin marvin;
    private Intonation intonation;
    private Society society;
    private Emotion contempt;
    private Emotion horror;

    private final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    private final PrintStream originalOut = System.out;

    @BeforeEach
    void setUp() {
        marvin = new Marvin("Марвин");
        intonation = new Intonation("микромодуляция", 100, false);
        society = new Society("человеческое общество");
        contempt = new Emotion("презрение");
        horror = new Emotion("ужас");

        System.setOut(new PrintStream(outputStream));
    }

    @Test
    void testMarvinCreation() {
        assertEquals("Марвин", marvin.getName());
        assertNull(marvin.getIntonation());
    }

    @ParameterizedTest
    @ValueSource(strings = {"презрение", "ужас", "грусть", "радость"})
    void testEmotionCreation(String emotionName) {
        Emotion emotion = new Emotion(emotionName);
        assertEquals(emotionName, emotion.getName());
    }

    @ParameterizedTest
    @CsvSource({
            "микромодуляция, 100, false",
            "сильная модуляция, 200, true",
            "мягкая модуляция, 50, false"
    })
    void testIntonationCreation(String name, int pause, boolean canOffend) {
        Intonation intonation = new Intonation(name, pause, canOffend);
        assertEquals(name, intonation.getModulation());
        assertEquals(pause, intonation.getPause());
        assertEquals(canOffend, intonation.isCanOffend());
    }

    @Test
    void testSetAndGetIntonation() {
        marvin.setIntonation(intonation);
        assertEquals(intonation, marvin.getIntonation());
    }

    @Test
    void testSetAndGetEmotionName() {
        contempt.setName("грусть");
        assertEquals("грусть", contempt.getName());
    }

    @Test
    void testSetAndGetIntonationAttributes() {
        intonation.setModulation("сильная модуляция");
        intonation.setPause(200);
        intonation.setCanOffend(true);

        assertEquals("сильная модуляция", intonation.getModulation());
        assertEquals(200, intonation.getPause());
        assertTrue(intonation.isCanOffend());
    }

    @Test
    void testSocietyCreation() {
        assertEquals("человеческое общество", society.getName());
    }

    @Test
    void testSetAndGetSocietyName() {
        society.setName("общество роботов");
        assertEquals("общество роботов", society.getName());
    }

    @ParameterizedTest
    @CsvSource({
            "презрение, микромодуляция, 100, false, человеческое общество",
            "ужас, сильная модуляция, 200, true, общество роботов"
    })
    void testMarvinExpressEmotionParameterized(String emotionName, String intonationName, int pause, boolean canOffend, String societyName) {
        Emotion emotion = new Emotion(emotionName);
        Intonation intonation = new Intonation(intonationName, pause, canOffend);
        Society society = new Society(societyName);

        marvin.expressEmotion(society, intonation, emotion);

        String output = outputStream.toString().trim();
        assertTrue(output.contains("Марвин выражает эмоции: " + emotionName));
        assertTrue(output.contains("По отношению к: " + societyName));
        assertTrue(output.contains("С интонацией и тембром: " + intonationName));
    }

    @Test
    void testMarvinExpressEmotionMultiple() {
        marvin.expressEmotion(society, intonation, contempt, horror);

        String output = outputStream.toString().trim();
        assertTrue(output.contains("Марвин выражает эмоции: презрение, ужас"));
    }

    @Test
    void testMarvinExpressEmotionNone() {
        marvin.expressEmotion(society, intonation);

        String output = outputStream.toString().trim();
        assertTrue(output.contains("Марвин выражает эмоции: никаких эмоций."));
    }

    @BeforeEach
    void tearDown() {
        System.setOut(originalOut);
    }
}

