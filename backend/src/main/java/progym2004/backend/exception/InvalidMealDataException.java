package progym2004.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidMealDataException extends RuntimeException {

    public InvalidMealDataException(String message) {
        super(message);
    }

    public InvalidMealDataException(String field, String reason) {
        super(String.format("Некорректное значение поля '%s': %s", field, reason));
    }
}