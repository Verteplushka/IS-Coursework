package progym2004.backend.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class OpenAiService {

    private final WebClient webClient;

//    @Value("${openai.api.key}")
    private String apiKey = "sk-qrst1234qrst1234qrst1234qrst1234qrst1234";

//    @Value("${openai.api.url}")
    private String apiUrl = "https://api.openai.com/v1/chat/completions";

    public OpenAiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
    }

    public Mono<String> getChatResponse(String userMessage) {
        return webClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(Map.of(
                        "model", "gpt-4",
                        "messages", new Object[]{
                                Map.of("role", "system", "content", "Ты умный AI-ассистент."),
                                Map.of("role", "user", "content", userMessage)
                        },
                        "temperature", 0.7
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> (String) ((Map) ((java.util.List) response.get("choices")).get(0)).get("message"));
    }
}

