$(function () {
    var mixer = mixitup('.products__inner-box');
    $('.rate-star').rateYo({
        rating: 5,
        starWidth: "12px",
        // ratedFill: "#035bfb",   
        ratedFill: "#ffa726",
        readOnly: true,
        fullStar: true
        //numStars: 10
        //maxValue: 2                    
    });
    $('.product-slide__inner').slick({
        dots: true,
        arrows: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        // centerMode: true,
        // centerPadding: '80px'
    });
})