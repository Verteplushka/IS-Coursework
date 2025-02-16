package progym2004.backend.entity;

public enum ActivityLevel {
    SEDENTARY(1),
    LIGHT(2),
    MODERATE(3),
    ACTIVE(4),
    VERY_ACTIVE(5);

    private final int value;

    ActivityLevel(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static ActivityLevel fromValue(int value) {
        for (ActivityLevel level : values()) {
            if (level.getValue() == value) {
                return level;
            }
        }
        throw new IllegalArgumentException("Unknown activity level: " + value);
    }
}

