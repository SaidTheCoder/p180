let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    render_elements();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
    } else {
        alert("Coordinates not selected!")
        window.history.back();
    }
}

function render_elements() {+
   $.ajax({
       url:`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.source_lon}%2C${coordinates.source_lat}%3B${coordinates.destination_lon}%2C${coordinates.destination_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1Ijoic2FpZHRoZWNvZGVyIiwiYSI6ImNsMGxwaDE4bDB5bWczaW90Y2VubG4zZnIifQ.-GRGzF8sbP8HBQlx1rAz2A)`,
       type:'get',
       success:function(response){
        let images={
            "turn_right":"ar_right.png",
            "turn_left":"ar_left.png",
            "slight_right":"ar_slight_right.png",
            "slight_left":"ar_slight_left.png",
            "straight":"ar_straight.png",
        }
        let steps=response.routes[0].legs[0].steps
        for(let i=0;i<steps.length;i++){
            let image
            let distance=steps[i].distance
            let instruction=steps[i].manever.instruction
            if(instruction.includes("Turn right")){
                image="turn_right"
            }

            else if(instruction.includes("Turn left")){
                image="turn_left"
            }
            if(i>0){
                $("#scene_container").append(
                  `<a-entity gps-entity-place="latitude:${steps[i].manever.location[1]};longitude:${steps[i].manever.location[0]}">
                    <a-image name="${instruction}"
                    src="./assets/${images[image]}" look-at="#step_${i-1}"
                    scale="5 5 5"
                    id="step_${i}"
                    position:"0 0 0"></a-image>
                    <a-entity>
                    <a-text height="50" value="${instruction}(${distance}m)">
                    </a-entity>
                  </a-entity> ` 
                )
            }

            else{
                $("#scene_container").append(
                    `<a-entity gps-entity-place="latitude:${steps[i].manever.location[1]};longitude:${steps[i].manever.location[0]}">
                      <a-image name="${instruction}"
                      src="./assets/ar_start.png" look-at="#step_${i+1}"
                      scale="5 5 5"
                      id="step_${i}"
                      position:"0 0 0"></a-image>
                      <a-entity>
                      <a-text height="50" value="${instruction}(${distance}m)">
                      </a-entity>
                    </a-entity> ` 
                  )
              }
  
            
        }
       }
   })
}
