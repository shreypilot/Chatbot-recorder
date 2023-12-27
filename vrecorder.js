
class VoiceRecorder {
  constructor() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("Get user media supported");
    } else {
      console.log("Get user media NOT supported");
    }
    this.chatBoxRef = document.querySelector("#chat-box");

    this.mediaRecorder = null;
    this.stream = null;
    this.chunks = [];
    this.isRecording = false;

    this.recorderRef = document.querySelector("#recorder");
    this.playerRef = document.querySelector("#player");
    this.startRef = document.querySelector("#start");
    this.stopRef = document.querySelector("#stop");

    this.startRef.addEventListener("click", this.startRecording.bind(this));
    this.stopRef.addEventListener("click", this.stopRecording.bind(this));

    this.constraints = {
      audio: true,
      video: false,
    };
    var startChatButton = document.getElementById("init");
        var chatWindow = document.getElementById("test");

        // Add click event listener to the "START CHAT" button
        startChatButton.addEventListener("click", function() {
            // Toggle the display of the chat window
            chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
        });
  }



  handleSuccess(stream) {
    this.stream = stream;
    this.stream.oninactive = () => {
      console.log("Stream ended");
    };

    this.recorderRef.srcObject = this.stream;
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable =
      this.onMediaRecorderDataAvailable.bind(this);
    this.mediaRecorder.onstop = this.onMediaRecorderStop.bind(this);

    this.recorderRef.play();
    this.mediaRecorder.start();
  }

  onMediaRecorderDataAvailable(e) {
    this.chunks.push(e.data);
  }

  onMediaRecorderStop(e) {
    const blob = new Blob(this.chunks, { type: "audio/ogg; codec=opus" });
    const audioURL = window.URL.createObjectURL(blob);

    this.playerRef.src = audioURL;
    // Create a new audio element
    const newAudioElement = document.createElement("audio");
    newAudioElement.controls = true;
    newAudioElement.src = audioURL;

    // Create a new message container
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("chat-r");
    const message = document.createElement("div");
    message.classList.add("mess", "mess-r");
    message.appendChild(newAudioElement);
    messageContainer.appendChild(message);

    // Append the new message container to the chat box
    this.chatBoxRef.appendChild(messageContainer);

    this.chunks = [];

    this.stream.getAudioTracks().forEach((track) => track.stop());
    this.stream = null;
  }

  startRecording() {
    if (this.isRecording) return;

    this.isRecording = true;
    this.startRef.innerHTML = "Recording...";
    this.playerRef.src = "";
    const yourElement = document.getElementById("start");
    if (yourElement) {
      yourElement.style.backgroundColor = "#053819";
    }

    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then(this.handleSuccess.bind(this))
      .catch((error) => console.error("Error accessing microphone:", error));
  }

  stopRecording() {
    if (!this.isRecording) return;

    this.isRecording = false;
    this.startRef.innerHTML = "Record";
    this.recorderRef.pause();

    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }
}

window.VoiceRecorder = new VoiceRecorder();
