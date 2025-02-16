package progym2004.backend.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Goal {
    WEIGHT_LOSS("WEIGHT_LOSS"),
    MUSCLE_GAIN("MUSCLE_GAIN"),
    MAINTENANCE("MAINTENANCE");

    private final String value;

    Goal(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}

