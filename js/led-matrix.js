function LedMatrix(container, font, chars) {

    var rows = 8;

    var template = function (colId) {
        var result = '<div class="char_matrix" id="col_'+colId+'"><ul>';
        for (var i = 0; i < rows; i++) {
            result += '<li class="led"></li>';
        }
        return result+'</ul></div>';
    };

    var prepareMessage = function(message){
        var fontData = font.data;
        var result = [], j, i, r, byte, rowDef, bit;
        for(i=0; i<message.length; i++){
            var ch=message[i];
            if(fontData[ch] != 'undefined'){
                for(j=0; j<fontData[ch].length; j++) {
                    byte = fontData[ch][j];
                    rowDef = [];
                    bit = 1;
                    for(r = 0; r < rows; r++) {
                        rowDef.push((byte & bit) > 0);
                        bit *= 2;
                    }
                    result.push(rowDef);
                }
                // separator between letters
                result.push([false, false, false, false, false, false, false, false]);
            }
        }
        return result;
    };

    this.data = [];
    this.animateInterval = null;
    this.cols = chars * 6;
    this.container = container;

    var html = '';

    for (var id = 0; id < this.cols; id++) {
        html += template(id);
    }

    $(container).append(html);

    this.reset = function () {
        $(container).find('.led.active').removeClass('active');
    };

    this.allActive = function () {
        $(container).find('.led:not(.active)').addClass('active');
    };

    this.blink = function(cadence) {
        if(this.animateInterval) {
            clearInterval(this.animateInterval);
        }
        this.animateInterval = setInterval(function(){
            $(container).find('.led.active').addClass('guard');
            $(container).find('.led:not(.active)').addClass('active');
            $(container).find('.led.guard').removeClass('guard').removeClass('active');
        }, cadence);
    };

    var drawCol = function(col, data){
        var html = '<ul>';
        for (var i = 0; i < rows; i++) {
            html += '<li class="led'+(data[i] ? ' active' : '')+'"></li>';
        }
        $(col).html(html+'</ul>');
    };

    this.showMessage = function (message) {
        if(message.length < chars){
            for(i=message.length; i<chars; i++) {
                message += ' ';
            }
        }
        this.data = prepareMessage(message);
        this.update();
    };

    this.update = function(){
        var col, l = Math.min(this.data.length, this.cols);
        for (col = 0; col < l; col++) {
            drawCol('#col_'+col, this.data[col]);
        }
    };

    this.animate = function (timeout, times) {
        this.stopAnimate();
        var that = this;
        this.animateInterval = setInterval(function(){
            if (times !== null) {
                times--;
                if (times === 0) {
                    that.stopAnimate();
                }
            }
            that.data.push(that.data.shift());
            that.update();
        }, timeout);
    };

    this.stopAnimate = function () {
        if (this.animateInterval != null) {
            clearInterval(this.animateInterval);
            this.animateInterval = null;
        }
    };
}





