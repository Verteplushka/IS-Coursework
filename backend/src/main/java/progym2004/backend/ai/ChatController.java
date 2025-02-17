package progym2004.backend.ai;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final OpenAiService openAiService;

    public ChatController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @PostMapping("/ask")
    public String chatWithGpt(@RequestParam String message) {
        return openAiService.getChatResponse(message).block(); // WebClient возвращает Mono, поэтому .block() синхронизирует
    }
}

