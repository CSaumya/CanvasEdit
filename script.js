const filters = {
    brightness: { value: 100, min: 0, max: 200, unit: "%" },
    contrast: { value: 100, min: 0, max: 200, unit: "%" },
    exposure: { value: 100, min: 0, max: 200, unit: "%" },
    saturation: { value: 100, min: 0, max: 200, unit: "%" },
    hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
    blur: { value: 0, min: 0, max: 20, unit: "px" },
    grayscale: { value: 0, min: 0, max: 100, unit: "%" },
    sepia: { value: 0, min: 0, max: 100, unit: "%" },
    opacity: { value: 100, min: 0, max: 100, unit: "%" },
    invert: { value: 0, min: 0, max: 100, unit: "%" }
}

const presets = {
    normal: {
        brightness:100, contrast:100, saturation:100,
        hueRotation:0, blur:0, grayscale:0, sepia:0, opacity:100, invert:0
    },

    vintage: {
        brightness:110, contrast:90, saturation:80,
        hueRotation:10, blur:0, grayscale:10, sepia:40, opacity:100, invert:0
    },

    dramatic: {
        brightness:90, contrast:150, saturation:120,
        hueRotation:0, blur:0, grayscale:0, sepia:10, opacity:100, invert:0
    },

    cool: {
        brightness:105, contrast:110, saturation:90,
        hueRotation:180, blur:0, grayscale:0, sepia:0, opacity:100, invert:0
    },

    warm: {
        brightness:110, contrast:105, saturation:120,
        hueRotation:20, blur:0, grayscale:0, sepia:20, opacity:100, invert:0
    },

    noir: {
        brightness:100, contrast:140, saturation:0,
        hueRotation:0, blur:0, grayscale:100, sepia:0, opacity:100, invert:0
    }
}

const imageCanvas = document.querySelector("#image-canvas")
const imgInput = document.querySelector("#image-input")
const canvasCtx = imageCanvas.getContext("2d")
const resetBtn = document.querySelector("#reset-btn")
const downloadBtn = document.querySelector("#download-btn")

let image = null

// FIXED (important)
const filtersContainer = document.querySelector(".filters-container")

function createFilterElement(name, unit, value, min, max){

    const div = document.createElement("div")
    div.classList.add("filter")

    const label = document.createElement("p")
    label.innerText = name

    const input = document.createElement("input")
    input.type = "range"
    input.min = min
    input.max = max
    input.value = value
    input.id = name

    input.addEventListener("input", () => {
        filters[name].value = input.value
        applyFilters()
    })

    div.appendChild(label)
    div.appendChild(input)

    return div
}

function createFilters(){

    filtersContainer.innerHTML = ""

    Object.keys(filters).forEach(key => {

        const filterElement = createFilterElement(
            key,
            filters[key].unit,
            filters[key].value,
            filters[key].min,
            filters[key].max
        )

        filtersContainer.appendChild(filterElement)
    })
}

createFilters()

imgInput.addEventListener("change", (event) => {

    const file = event.target.files[0]

    const imagePlaceholder = document.querySelector(".placeholder")

    imageCanvas.style.display = "block"
    imagePlaceholder.style.display = "none"

    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {

        image = img

        imageCanvas.width = img.width
        imageCanvas.height = img.height

        applyFilters()
    }
})

function applyFilters(){

    if(!image) return

    canvasCtx.clearRect(0,0,imageCanvas.width,imageCanvas.height)

    canvasCtx.filter = `
        brightness(${filters.brightness.value}%)
        contrast(${filters.contrast.value}%)
        saturate(${filters.saturation.value}%)
        hue-rotate(${filters.hueRotation.value}deg)
        blur(${filters.blur.value}px)
        grayscale(${filters.grayscale.value}%)
        sepia(${filters.sepia.value}%)
        opacity(${filters.opacity.value}%)
        invert(${filters.invert.value}%)
    `

    canvasCtx.drawImage(image,0,0)
}

resetBtn.addEventListener("click", () => {

    Object.keys(filters).forEach(key => {

        if(key === "brightness" || key === "contrast" || key === "saturation" || key === "opacity"){
            filters[key].value = 100
        }else{
            filters[key].value = 0
        }

    })

    createFilters()
    applyFilters()
})

downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a")
    link.download = "edited-image.png"
    link.href = imageCanvas.toDataURL()
    link.click()
})

/* PRESETS */

const presetButtons = document.querySelectorAll(".preset-buttons button")

presetButtons.forEach(button => {

    button.addEventListener("click", () => {

        const presetName = button.dataset.preset
        const preset = presets[presetName]

        Object.keys(preset).forEach(filter => {
            filters[filter].value = preset[filter]
        })

        createFilters()
        applyFilters()

        presetButtons.forEach(btn => btn.classList.remove("active"))
        button.classList.add("active")
    })

})