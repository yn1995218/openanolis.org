export default function() {
    const carousel = document.getElementById('carousel')
    if (!carousel) {return}
    const warp = document.getElementById('warp')
    const container = document.getElementById('container')
    const btn = container.getElementsByTagName('div')
    const lastChild = warp.getElementsByTagName('div')[0].cloneNode(true)
    const len = btn.length
    warp.appendChild(lastChild)
    let index = -1
    function autoPlay() {
        ++index
        for (let i = 0; i < len; i++) {
            if (i != index) {
                btn[i].className = 'ss-carousel-btn'
            }
        }
        if (index >= len) {
            btn[0].className = 'ss-carousel-btn-active'
            warp.setAttribute('style', `transform:translateY(-${100 * index / (len + 1)}%);transition-duration: 1s;transition-timing-function: ease-in-out;`)
            var reset = setTimeout(function () {
                index = 0
                warp.setAttribute('style', `transform:translateY(-${100 * index / (len + 1)}%);`)
                clearTimeout(reset)
            }, 1000)
            return
        } else {
            btn[index].className = 'ss-carousel-btn-active'
        }
        warp.setAttribute('style', `transform:translateY(-${100 * index / (len + 1)}%);transition-duration: 1s;transition-timing-function: ease-in-out;`)
    }
    var timer = setInterval(autoPlay, 4000)
    carousel.addEventListener("mouseover", function () {
        clearInterval(timer);
    })
    carousel.addEventListener("mouseout", function () {
        timer = setInterval(autoPlay, 4000);
    })
    for (let j = 0; j < len; j++) {
        btn[j].addEventListener("click", function () {
            warp.setAttribute('style', `transform:translateY(-${100 * j / (len + 1)}%)`)
            for (let i = 0; i < len; i++) {
                if (i != j) {
                    btn[i].className = 'ss-carousel-btn'
                }
            }
            btn[j].className = 'ss-carousel-btn-active'
            index = j
            clearInterval(timer);
        })
    }
}