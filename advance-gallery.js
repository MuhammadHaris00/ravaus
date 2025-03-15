const gallery_image_paths = [
    "./media/1.jpg",
    "./media/2.jpg",
    "./media/3.jpg",
    "./media/4.jpg",
    "./media/5.jpg",
    "./media/6.jpg",
];
const thumbnail_image_classes = "image-thumbnail";
const selected_thumbnail_classes = "thumbnail-selected";
const images_wrapper = document.querySelector(".all-image-wrapper");
const selected_image = document.querySelector(".selected-image");
let selected_thumbnail = null;
const zoom_canvas = document.querySelector("#selected-image-zoom-view");
const zoom_highlight_area = document.querySelector(".zoom-highlight-area");


// Popup Variables

const gallery_popup_thumbnail_wrapper = document.querySelector(".gallery-popup-thumbnail-list");
const popup_thumbnail_class = "popup-thumbnail";
const gallery_popup = document.querySelector(".advance-custom-gallery-popup-wrapper");
const popup_close_class = "popup-close";
const popup_open_class = "popup-open";
const popup_close_button = document.querySelector(".close-button");
const popup_selected_image = document.querySelector(".gallery-popup-selected-image");
let selected_image_rotation = 0;
const rotate_left_button = document.querySelector(".rotate-left-control");
const rotate_right_button = document.querySelector(".rotate-right-control");
const popup_zoom_button = document.querySelector(".double-zoom-control");
const full_view_button = document.querySelector(".full-size-control");
const popup_prev_button = document.querySelector(".popup-prev-button");
const popup_zoom_canvas = document.querySelector(".gallery-popup-selected-image-canvas");
const popup_zoom_area = 300;
const PopupZoomStates = {
    Disables:0,
    SingleZoom:1,
    DoubleZoom:2,
}


popup_close_button.addEventListener("click", () => {
    closePopup();
})
// ==========================================

window.addEventListener("DOMContentLoaded",  () => {
    if(gallery_image_paths.length > 0 && images_wrapper) {
        gallery_image_paths.forEach((image, idx) => {
            const thumbnail_image = document.createElement("img");
            thumbnail_image.src = image;
            thumbnail_image.classList.add(thumbnail_image_classes);
            thumbnail_image.id = `thumbnail-image-${idx+1}`;
            images_wrapper.append(thumbnail_image);

            // Popup
            const popup_thumbnail = thumbnail_image.cloneNode(true);
            popup_thumbnail.classList.add(popup_thumbnail_class);
            popup_thumbnail.addEventListener("click", () => (
                selectImage()
            ))
            popup_thumbnail.addEventListener("click", () => {
                selectImage(popup_thumbnail, popup_selected_image);
            })
            gallery_popup_thumbnail_wrapper.append(popup_thumbnail);



            // ===============================
            if(idx === 0) {
                selectImage(thumbnail_image, selected_image);
                selectImage(thumbnail_image, popup_selected_image);
            }

            thumbnail_image.addEventListener("click", (e) => {
                e.preventDefault();
                selectImage(thumbnail_image, selected_image);
            })
        })

    }

    if(zoom_canvas && selected_image) {
        selected_image.onmousemove = (e) => {
            createZoom(e,selected_image,zoom_canvas,80,true,false);
        }
    }

//     ==================== Popup Code ======================
    //Popup Code
    rotate_left_button.addEventListener("click", () => {
        rotateSelectedImage(-90);
    })
    rotate_right_button.addEventListener("click", () => {
        rotateSelectedImage(90);
    })

    if(popup_zoom_canvas && popup_selected_image){
        console.log("Hello", popup_selected_image);
        popup_selected_image.onmousemove = (e)=>{
            createZoom(e,popup_selected_image,popup_zoom_canvas,popup_zoom_area, false, true,0.5);
        }
    }

})

function createZoom(event,source_image, canvas_element,zoom_area_size = 100, highlight_area = false,canvas_follows = false, scale_factor = 1){

    if(source_image && canvas_element && zoom_area_size > 0) {
        const rect = event.target.getBoundingClientRect();
        const mouse_pos_x = event.clientX - rect.left - zoom_area_size / 2;
        const mouse_pos_y = event.clientY - rect.top - zoom_area_size / 2;
        // console.log(mouse_pos_x, mouse_pos_y);



        //Calculating the Zoom Highlight Area Position
        const left_pos = mouse_pos_x;
        const top_pos = mouse_pos_y;

        if(highlight_area){
            zoom_highlight_area.style.width = `${zoom_area_size}px`;
            zoom_highlight_area.style.height = `${zoom_area_size}px`;
            if(left_pos>0 && left_pos < source_image.width - zoom_area_size){
                zoom_highlight_area.style.left = `${left_pos}px`;
            }
            if(top_pos>0 && top_pos < source_image.height - zoom_area_size){
                zoom_highlight_area.style.top = `${top_pos}px`;
            }
        }

        // Canvas Follows

        if(canvas_follows){
            canvas_element.style.top = `${mouse_pos_y}px`;
            canvas_element.style.left = `${mouse_pos_x}px`;
            // console.log(zoom_highlight_area.style.left);
        }

        // console.log(mouse_pos_x, mouse_pos_y);
        // ----------------------------------------------

        // Setting the Zoom Background Size
        canvas_element.style.backgroundImage = `url(${source_image.src})`;
        const source_rect = source_image.getBoundingClientRect();
        const canvas_rect = canvas_element.getBoundingClientRect();
        // const zoom_canvas_image_size = source_rect.width * (canvas_rect.width / zoom_area_size);
        const scale_ratio = source_rect.width/zoom_area_size;
        const zoom_canvas_image_size = scale_ratio * source_rect.width;
        canvas_element.style.backgroundSize = zoom_canvas_image_size*scale_factor + "px";
        const bg_pos_x =-1*(mouse_pos_x * scale_ratio);
        // Need to Know WHy 2.8 🤔
        const bg_pos_y = -1*(mouse_pos_y * scale_ratio);
        canvas_element.style.backgroundPositionX = `${bg_pos_x}px`;
        canvas_element.style.backgroundPositionY = `${bg_pos_y}px`;
        console.log(bg_pos_x, bg_pos_y, (mouse_pos_x/source_rect.width) * zoom_canvas_image_size,(mouse_pos_y/source_rect.height) * zoom_canvas_image_size);
        // console.log(bg_pos_x,bg_pos_y);
        // const bg_pos_x = zoom_canvas_image_size - (mouse_pos_x/source_image.width + zoom_area_size) * zoom_canvas_image_size;
        // const bg_pos_y = zoom_canvas_image_size - (mouse_pos_y/source_image.height + zoom_area_size)  * zoom_canvas_image_size;

        // if(left_pos>0 && left_pos < source_image.width){
        // }
        // if(top_pos>0 && top_pos < source_image.height){
        // }

        // target_element.style.backgroundPosition = `${bg_pos_x}px ${bg_pos_y}px`;
        // console.log(bg_pos_x,bg_pos_y, zoom_canvas_image_size);

        //=====================================================
    }
    else {
        throw new Error("Invalid Parameters");
    }
}

function setSelectedImage(source, target){
    target.src = source.src;
}

function selectImage(new_image, canvas_element){
    if(new_image){

        selected_thumbnail?.classList.remove(selected_thumbnail_classes);
        selected_thumbnail = new_image;
        selected_thumbnail.classList.add(selected_thumbnail_classes);
        canvas_element.src = new_image.src;
    }
    else{
        throw new Error("Invalid New Image Parameter");
    }
}

function closePopup(){
    if(gallery_popup){
        gallery_popup.classList.remove(popup_open_class);
        gallery_popup.classList.add(popup_close_class);
    }
}

function rotateSelectedImage(angle){
    selected_image_rotation = (selected_image_rotation + angle)%360;
    popup_selected_image.style.transform = `rotate(${selected_image_rotation}deg)`;
    console.log(selected_image_rotation);
}

