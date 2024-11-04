import base64

def encode_to_base64(file_path):
    with open(file_path, "rb") as file:
        encoded = base64.b64encode(file.read()).decode('utf-8')
    return encoded

def decode_from_base64(base64_string, output_file):
    with open(output_file, "wb") as file:
        file.write(base64.b64decode(base64_string))
    return output_file
