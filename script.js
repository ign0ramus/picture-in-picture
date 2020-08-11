const stopButton = document.getElementById('stopButton');
const selectContentButton = document.getElementById('selectContentButton');
const video = document.getElementById('video');
let mediaStream = null;

// Prompt to select media stream, pass to video and play
selectContentButton.addEventListener('click', async () => {
	try {
		mediaStream = await navigator.mediaDevices.getDisplayMedia();

		// stop picture in picture if browser 'Stop sharing' button is pressed
		mediaStream.getVideoTracks()[0].onended = async () => {
			await document.exitPictureInPicture();
		};

		video.srcObject = mediaStream;
		video.onloadedmetadata = async () => {
			video.play();
			await startPictureInPicture();
		};
	} catch (err) {
		console.error(err);
	}
});

async function startPictureInPicture() {
	if (document.pictureInPictureElement) {
		await document.exitPictureInPicture();
	} else {
		video.requestPictureInPicture();
	}
}

stopButton.addEventListener('click', async () => {
	stopButton.hidden = true;

	//stop picture in picture
	await document.exitPictureInPicture();
});

video.addEventListener('enterpictureinpicture', () => {
	selectContentButton.hidden = true;
	stopButton.hidden = false;
});

video.addEventListener('leavepictureinpicture', () => {
	selectContentButton.hidden = false;
	stopButton.hidden = true;

	// stop media stream if site's STOP button is pressed
	mediaStream.getVideoTracks()[0].stop();
});
