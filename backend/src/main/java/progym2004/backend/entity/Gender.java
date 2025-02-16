package progym2004.backend.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Gender {
    MALE("MALE"),
    FEMALE("FEMALE");

    private final String value;

    Gender(String value) {
        this.value = value;
    }

    @JsonValue  // 🔥 Говорим Jackson, что нужно передавать значение в виде строки
    public String getValue() {
        return value;
    }
}


