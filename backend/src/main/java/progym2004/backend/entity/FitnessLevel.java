package progym2004.backend.entity;

import lombok.Getter;

@Getter
public enum FitnessLevel {
    LOW(1),
    MEDIUM(2),
    HIGH(3);

    private final int value;

    FitnessLevel(int value) {
        this.value = value;
    }

    public static FitnessLevel fromValue(int value) {
        for (FitnessLevel level : values()) {
            if (level.getValue() == value) {
                return level;
            }
        }
        throw new IllegalArgumentException("Unknown fitness level: " + value);
    }
}

