import sys
import json

BAD_WORDS = ["stronzo", "cazzo", "merda", "puttana", "idiota", "stupido"]

def check_profanity(text: str) -> bool:
    """
    Returns True if the text contains any of the bad words, False otherwise.
    """
    text_lower = text.lower()
    for word in BAD_WORDS:
        if word in text_lower:
            return True
    return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = sys.argv[1]
        has_profanity = check_profanity(text)
        print(json.dumps({"has_profanity": has_profanity}))
    else:
        print("Usage: python profanity_filter.py <text>")
        sys.exit(1)
