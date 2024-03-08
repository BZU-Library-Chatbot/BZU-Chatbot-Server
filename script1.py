import sys;
from transformers import GPT2LMHeadModel, GPT2Tokenizer

if len(sys.argv) > 1:
    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
    model = GPT2LMHeadModel.from_pretrained("gpt2")
    input_text = sys.argv[1]
    input_ids = tokenizer.encode(input_text, return_tensors='pt')
    # Set the maximum length of the generated text
    max_length = 50

    # Generate a sequence of tokens
    output_ids = model.generate(
        input_ids, 
        max_length=50, 
        num_return_sequences=1,
        no_repeat_ngram_size=2,  # This will disallow repeating the same 2-gram
        top_p=0.92,  # Top-p (nucleus) sampling
        top_k=30,  # Top-k sampling
        temperature=0.7  # Slightly below 1 for less randomness
    )

    # Decode the tokens to text
    generated_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    print(generated_text)
else:
    print("No argument provided")





