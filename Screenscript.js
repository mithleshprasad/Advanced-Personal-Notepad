 const recordButton = document.getElementById("recordButton");
        const downloadButton = document.getElementById("downloadButton");
        const videoPreview = document.getElementById("videoPreview");
        const recordedVideo = document.getElementById("recordedVideo");
        const recordingType = document.getElementById("recordingType");
        const yearSpan = document.getElementById("year");
        yearSpan.textContent = new Date().getFullYear();

        let mediaRecorder;
        let stream;
        let chunks = [];
        let videoUrl = null;

        const startRecording = async () => {
            try {
                const type = recordingType.value;
                if (type === "screen") {
                    stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                } else {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                }

                videoPreview.srcObject = stream;
                videoPreview.style.display = "block";

                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: "video/webm" });
                    videoUrl = URL.createObjectURL(blob);
                    recordedVideo.src = videoUrl;
                    recordedVideo.style.display = "block";
                    downloadButton.disabled = false;
                };

                mediaRecorder.start();
                recordButton.textContent = "Stop Recording";
                recordButton.classList.remove("btn-primary");
                recordButton.classList.add("btn-danger");
                Swal.fire({
                    icon: "success",
                    title: "Recording Started",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error("Error accessing media:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to access the media!",
                });
            }
        };

        const stopRecording = () => {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
                stream.getTracks().forEach((track) => track.stop());
                videoPreview.style.display = "none";
                recordButton.textContent = "Start Recording";
                recordButton.classList.remove("btn-danger");
                recordButton.classList.add("btn-primary");
                Swal.fire({
                    icon: "success",
                    title: "Recording Stopped",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        };

        const downloadVideo = () => {
            if (videoUrl) {
                const a = document.createElement("a");
                a.href = videoUrl;
                a.download = "recorded_video.webm";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(videoUrl);
                Swal.fire({
                    icon: "success",
                    title: "Start Downloading!",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "No recorded video available",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        };

        recordButton.addEventListener("click", () => {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                stopRecording();
            } else {
                startRecording();
            }
        });

        downloadButton.addEventListener("click", downloadVideo);
