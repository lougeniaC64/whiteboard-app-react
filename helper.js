
function getImageFile(file, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => { callback(reader.result) }, false)

    if (file) {
        reader.readAsDataURL(file)
    }
}

export { getImageFile }