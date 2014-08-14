var files;
var formData = new FormData;
formDataLength = 0;

$('input.file-select[type=file]').on('change', prepareUpload);
function prepareUpload(event) {
    files = event.target.files;
}

$('body').on('submit', '.form-file-upload', executeUpload);

function executeUpload(event) {
    event.stopPropagation();
    event.preventDefault();


    $.each(files, function(i, file) {
        if (file.type.match('text/csv')) {
            formData.append(formDataLength, file);
            formDataLength += 1;
        } else {
            alert(file.name + ' is not a .csv file. This file will not be processed.');
        }
    });

    $.ajax({
        url: 'fileHandler.php?files',
        type: 'POST',
        data: formData,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        beforeSend: function() {
            $('.button-upload').html('Uploading...');
        },
        success: function(data, textStatus, jqXHR) {
            drawTable(data);
            $('.button-upload').html('Upload and Process');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('There was an error. Please check console.');
            console.log('Error: ' + textStatus);
            console.log('Error Thrown' + errorThrown);
        },
        complete: function() {
            $('.file-select').val('');
            $('.button-upload').html('Upload and Process');
        }
    });
}

function drawTable(data) {
    $('.schedule').empty();
    drawTableHeader();
    for (var i = 0; i < data.schedule.length; i++) {
        drawRows(data.schedule[i]);
    }
}

function drawTableHeader() {
    var tableHeader = $('<tr />');
    $('.schedule').append(tableHeader);
    tableHeader.append($('<th>TRAIN_LINE</th>'));
    tableHeader.append($('<th>ROUTE_NAME</th>'));
    tableHeader.append($('<th>RUN_NUMBER</th>'));
    tableHeader.append($('<th>OPERATOR_ID</th>'));
}

function drawRows(data) {
    var row = $('<tr />');
    $('.schedule').append(row);
    row.append($('<td>' + data.TRAIN_LINE + '</td>'));
    row.append($('<td>' + data.ROUTE_NAME + '</td>'));
    row.append($('<td>' + data.RUN_NUMBER + '</td>'));
    row.append($('<td>' + data.OPERATOR_ID + '</td>'));
}

$('body').on('click', '.button-clear', function() {
    $('.schedule').empty();
    formData = new FormData;
});