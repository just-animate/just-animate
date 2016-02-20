(function () {

    var button = document.getElementById('animateButton');
    var label = document.getElementById('animateLabel');
    var select = document.getElementById('animateSelect');
    
    function animateTheLabel() {
        var animationType = select.options[select.selectedIndex].value;
        Just.animate(animationType, label);
    }
    
    button.addEventListener('click',  animateTheLabel);
    select.addEventListener('change',  animateTheLabel);

})();