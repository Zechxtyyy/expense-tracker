    let transaksi = [];
    let sedangEdit = null;
    let filter = 'semua';
    let urutan = 'terbaru';
    let tema = 'light';

    function inputTransaksi() {
        let nama = document.getElementById('namaTransaksi').value;
        let nominal = Number(document.getElementById('nominal').value);
        let jenisTransaksi = document.getElementById('jenis').value;
        let tanggalTransaksi = document.getElementById('tanggal').value;

        if (nama.trim() === '') {
            alert('Tidak boleh kosong');
            return;
        }
        if (isNaN(nominal) || nominal <= 0) {
            alert('Nominal tidak valid');
            return;
        }
        if (tanggalTransaksi.trim() === '') {
            alert('Tanggal tidak boleh kosong')
            return;
        }

        if (sedangEdit === null) {
            transaksi.push({
            nama: nama.trim(),
            nominal,
            jenis: jenisTransaksi, 
            tanggalTransaksi,
            })
        } else {
            transaksi[sedangEdit].nama = nama.trim();
            transaksi[sedangEdit].nominal = nominal;
            transaksi[sedangEdit].jenis = jenisTransaksi;
            transaksi[sedangEdit].tanggalTransaksi = tanggalTransaksi;
            sedangEdit = null;
        }
        document.getElementById('btnTransaksi').textContent = 'Tambah';
    

        document.getElementById('namaTransaksi').value = '';
        document.getElementById('nominal').value = '';
        document.getElementById('jenis').value = 'Pemasukan';
        document.getElementById('tanggal').value = '';

        simpanData();
        tampilkanTransaksi();
    }

    function tampilkanTransaksi() {
        let daftar = document.getElementById('daftarTransaksi');
        let keyword = document.getElementById('cariTransaksi').value;

        daftar.innerHTML = '';

        let dataTampil = [...transaksi];
        
        if (urutan === 'terbaru') {
            dataTampil.sort((a, b) => {
                return new Date(b.tanggalTransaksi) - new Date(a.tanggalTransaksi);
            });
        }
        if (urutan === 'terlama') {
            dataTampil.sort((a, b) => {
                return new Date(a.tanggalTransaksi) - new Date(b.tanggalTransaksi);
            });
        }


        dataTampil.forEach((item, index) => {
            let tanggal = new Date(item.tanggalTransaksi);
            let teksTransaksi = item.nama;
            let indexAsli = transaksi.indexOf(item);

            if (!teksTransaksi.toLowerCase().includes(keyword.toLowerCase())) {
                return;
            }

            if (filter !== 'semua' && item.jenis !== filter) {
                return;
            }

            daftar.innerHTML += 
            `<div class="card-transaksi ${item.jenis.toLowerCase()}">
                <div class="isi-transaksi">
                    <h3>${item.nama}</h3>
                    <p>Rp${item.nominal.toLocaleString('id-ID')}</p>
                    <small>${item.jenis}</small>
                    <small>${tanggal.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}</small>
                </div>

                <div class="aksi">
                    <button class="Edit" onclick="editTransaksi(${indexAsli})">Edit</button>
                    <button class="Hapus" onclick="hapusTransaksi(${indexAsli})">Hapus</button>
                </div>
            </div>`
        })

        hitungTotal();
    }

    function batalTransaksi() {
        document.getElementById('namaTransaksi').value = '';
        document.getElementById('nominal').value = '';
        document.getElementById('jenis').value = 'Pemasukan';
        document.getElementById('tanggal').value = '';
        sedangEdit = null;
        document.getElementById('btnTransaksi').textContent = 'Tambah';
    }

    function hapusTransaksi(index) {
        if (confirm('Apakah anda yakin ingin menghapus ini?')) {
            transaksi.splice(index, 1);
        simpanData();
        tampilkanTransaksi();
        }
        
    }

    function editTransaksi(index) {
        document.getElementById('namaTransaksi').value = transaksi[index].nama;
        document.getElementById('nominal').value = transaksi[index].nominal;
        document.getElementById('jenis').value = transaksi[index].jenis;
        document.getElementById('tanggal').value = transaksi[index].tanggalTransaksi;
        
        sedangEdit = index;

        document.getElementById('btnTransaksi').textContent = 'Simpan Perubahan';
        
    }

    function hitungTotal () {
        let totalPemasukan = 0;
        let totalPengeluaran = 0;
        let pengeluaranTerbesar = 0;

        transaksi.forEach((item, index) => {
            if (item.jenis === 'Pemasukan') {
                totalPemasukan += item.nominal;
            }
            if (item.jenis === 'Pengeluaran') {
                totalPengeluaran += item.nominal;
            }
            if (item.jenis === 'Pengeluaran' && item.nominal > pengeluaranTerbesar) {
                pengeluaranTerbesar = item.nominal;
            }

        })
        let saldo = totalPemasukan - totalPengeluaran;
        let jumlahTransaksi = transaksi.length;

        document.getElementById('totalPemasukan').textContent 
        = `Total Pemasukan:  Rp${totalPemasukan.toLocaleString('id-ID')}`;
        document.getElementById('totalPengeluaran').textContent 
        = `Total Pengeluaran: Rp${totalPengeluaran.toLocaleString('id-ID')}`;
        document.getElementById('saldo').textContent 
        = `Saldo: Rp${saldo.toLocaleString('id-ID')}`;
        document.getElementById('totalTransaksi').textContent 
        = jumlahTransaksi;
        document.getElementById('transaksiTerbesar').textContent 
        = `Pengeluaran Terbesar: ${pengeluaranTerbesar.toLocaleString('id-ID')}`;

    }

    function simpanData() {
        localStorage.setItem('transaksi', JSON.stringify(transaksi));
    }

    function simpanTema() {
        localStorage.setItem('tema', tema);
    }

    function keluarinTema() {
        let  keluarTema = localStorage.getItem('tema');
        if (keluarTema) {
            tema = keluarTema;
        }
        if (tema === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }

    function keluarinData() {
        let data = localStorage.getItem('transaksi');
        if (data) {
            transaksi = JSON.parse(data);
        }

        tampilkanTransaksi();
    }

    keluarinData();
    keluarinTema();

    function ubahFilter(status) {
        filter = status;
        tampilkanTransaksi();
    }

    function ubahUrutan(status) {
        urutan = status;
        tampilkanTransaksi();
    }

    function exportCSV() {
        let header = 'Nama,Nominal,jenis,Tanggal';
        let isi = transaksi.map((item) => {
            return `${item.nama}, 
            ${item.nominal}, 
            ${item.jenis}, 
            ${item.tanggalTransaksi}`
        });
        let csv = header + `\n` + isi.join('\n');
        let file = new Blob([csv], {
            type: 'text/csv'
        });
        let url = URL.createObjectURL(file);
        let a = document.createElement('a');

        a.href = url;
        a.download = 'transaksi.csv';
        a.click();

        URL.revokeObjectURL(url);
    }

    function gantiTema() {
        if (tema === 'light') {
            tema = 'dark';
        } else {
            tema = 'light';
        }

        document.body.classList.toggle('dark-mode');
        simpanTema();
    }

    let btnTema = document.getElementById('btnTema');
    btnTema.addEventListener('click', gantiTema);
    
    const selectFilter = document.getElementById('filter');
    const selectUrutan = document.getElementById('urutan');

    selectFilter.addEventListener('change', function () {
        ubahFilter(this.value);
    });

    selectUrutan.addEventListener('change', function () {
        ubahUrutan(this.value);
    });