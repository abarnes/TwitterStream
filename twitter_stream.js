var streaming = 0;
var oReq;
var c = 0;
var timer_is_on=false;

function start_stream() {
    if (streaming == 0) {
        streaming = 1;
        timer_is_on = true;
        $('#stream-control').text('Stop Stream').css('background-color','red');
        $('#topbar-right span').html('Running').css('color','#219cc6');
        console.log('Starting stream');

        var start_point = 0;
        oReq = new XMLHttpRequest();
        oReq.onreadystatechange = function()
        {
            if (this.readyState > 2)
            {
                var partial_response = this.responseText;
                $('#stream').after(partial_response.substr(start_point,partial_response.length-1));
                start_point = partial_response.length-1;
            }
        }
        oReq.open("POST", "stream.php", true);
        oReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        oReq.send("keywords="+encodeURIComponent($('#keywords').val()));
    } else {
        streaming = 0;
        c = 0;
        timer_is_on = false;
        $('#timer').html('00:00:00');

        $('#stream-control').text('Start Stream').css('background-color','#219cc6');
        $('#topbar-right span').html('Idle').css('color','#999');
        console.log('Stopping stream');

        oReq.abort();
    }
}

$(document).on('click', '.delete_row', function(e) {
    $(this).closest("tr").remove();
});

//excel export
$(document).ready(function () {
    $('table').each(function () {
        var $table = $(this);

        var $button = $("<button type='button'>");
        $button.text("Export to CSV");
        $button.insertAfter($table);

        $button.click(function () {
            var csv = $table.table2CSV({
                delivery: 'value'
            });
            window.location.href = 'data:text/csv;charset=UTF-8,'
                + encodeURIComponent(csv);
        });
    });
});

//time JS
function convert_time(time) {
    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

function count() {
    if(timer_is_on) {
        c=c+1;
        $('#timer').html(convert_time(c));
    }
}

var interval = setInterval(count,1000);