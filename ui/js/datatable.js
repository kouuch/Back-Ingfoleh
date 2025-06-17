document.addEventListener('DOMContentLoaded', function () {
    $('#example').DataTable({
        destroy: true,
        language: {
            lengthMenu: 'Tampilkan _MENU_ entri per halaman',
            zeroRecords: 'Tidak ada data yang cocok',
            info: 'Menampilkan _START_ sampai _END_ dari _TOTAL_ entri',
            infoEmpty: 'Menampilkan 0 sampai 0 dari 0 entri',
            infoFiltered: '(difilter dari total _MAX_ entri)'
        },
        scrollY: '600px',
        scrollCollapse: true
    });

    var modalForm
    document.getElementById('addNewBtn').addEventListener('click', function () {
        modalForm = new bootstrap.Modal(document.getElementById('exModal'), {
            backdrop: 'static',
            keyboard: false,
        })
        modalForm.show()
    })

    document.getElementById('close').addEventListener('click', function () {
        window.location.href = '../../index.html'
    })

    // document.querySelectorAll('input[required]').forEach(input => {
    //     input.oninvalid = function (e) {
    //         e.target.setCustomValidity('Harap isi kolom ini');
    //     };
    //     input.oninput = function (e) {
    //         e.target.setCustomValidity('');
    //     };
    // });
})