const SSD_MOBILENETV1 = 'ssd_mobilenetv1'

let selectedFaceDetector = SSD_MOBILENETV1;
// ssd_mobilenetv1 options
let minConfidenceDefault = 0.5

function getFaceDetectorOptions() {
    return selectedFaceDetector === SSD_MOBILENETV1
        ? new faceapi.SsdMobilenetv1Options({ minConfidenceDefault })
        : (
            selectedFaceDetector === TINY_FACE_DETECTOR
                ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
                : new faceapi.MtcnnOptions({ minFaceSize })
        )
}

function onIncreaseMinConfidence() {
    minConfidenceDefault = Math.min(faceapi.round(minConfidenceDefault + 0.1), 1.0)
    $('#minConfidence').val(minConfidenceDefault)
    updateResults()
}

function onDecreaseMinConfidence() {
    minConfidenceDefault = Math.max(faceapi.round(minConfidenceDefault - 0.1), 0.1)
    $('#minConfidence').val(minConfidenceDefault)
    updateResults()
}

function getCurrentFaceDetectionNet() {
    if (selectedFaceDetector === SSD_MOBILENETV1) {
        return faceapi.nets.ssdMobilenetv1
    }
    if (selectedFaceDetector === TINY_FACE_DETECTOR) {
        return faceapi.nets.tinyFaceDetector
    }
    if (selectedFaceDetector === MTCNN) {
        return faceapi.nets.mtcnn
    }
}

function isFaceDetectionModelLoaded() {
    return !!getCurrentFaceDetectionNet().params
}

async function loadFaceDetector(detector) {
    //['#ssd_mobilenetv1_controls', '#tiny_face_detector_controls', '#mtcnn_controls'].forEach(id => $(id).hide())

    selectedFaceDetector = detector
    //const faceDetectorSelect = $('#selectFaceDetector')
    //faceDetectorSelect.val(detector)
    //faceDetectorSelect.material_select()

    //$('#loader').show()
    if (!isFaceDetectionModelLoaded()) {
        await getCurrentFaceDetectionNet().load('/')
    }

    //$(`#${detector}_controls`).show()
    //$('#loader').hide()
}