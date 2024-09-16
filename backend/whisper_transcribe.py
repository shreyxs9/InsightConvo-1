import whisper
import sys
import os

def main():
    # Ensure an audio file path is provided
    if len(sys.argv) != 2:
        print("Usage: python whisper_transcribe.py <audio_file_path>")
        sys.exit(1)

    audio_file = sys.argv[1]

    # Check if the file exists
    if not os.path.isfile(audio_file):
        print(f"Error: The file '{audio_file}' does not exist.")
        sys.exit(1)

    try:
        # Load the Whisper model
        model = whisper.load_model("base")

        # Transcribe the audio file
        result = model.transcribe(audio_file)

        # Print the transcription result
        print(result["text"])
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
