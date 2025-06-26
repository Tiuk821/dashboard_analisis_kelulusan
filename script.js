// script.js (Versi Dinamis)

// Fungsi utama yang akan berjalan saat halaman dimuat
async function initializeDashboard() {
    // Ambil data dari file JSON eksternal
    const allData = await fetchData();

    // Jika data gagal dimuat, hentikan proses
    if (!allData) {
        console.error("Tidak bisa melanjutkan karena data tidak ada.");
        return;
    }
    
    // Siapkan data untuk dimasukkan ke chart
    const labels = allData.map(item => item.tahun_yudisium);
    const values = allData.map(item => item.jumlah_lulusan);

    // Dapatkan elemen canvas dari HTML
    const ctx = document.getElementById('graduationChart').getContext('2d');

    // Buat chart baru
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jumlah Mahasiswa Lulus',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Klik pada Bar untuk Melihat Detail Analisis',
                    font: { size: 16 }
                },
                legend: { display: false }
            },
            scales: { y: { beginAtZero: true } },
            // Logika saat bar di-klik
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const clickedIndex = elements[0].index;
                    const clickedYear = labels[clickedIndex];
                    displayAnalysisDetails(clickedYear, allData);
                }
            }
        }
    });
}

// Fungsi untuk mengambil data dari file JSON
async function fetchData() {
    try {
        const response = await fetch('data/data_palsu.json');
        if (!response.ok) throw new Error('Network response was not ok.');
        return await response.json();
    } catch (error) {
        console.error('Gagal memuat data:', error);
        return null;
    }
}

// Fungsi untuk mengisi dan menampilkan area detail
function displayAnalysisDetails(year, allData) {
    const detailsContainer = document.getElementById('analysis-details');
    
    // Cari data untuk tahun yang diklik
    const yearData = allData.find(item => item.tahun_yudisium === year);
    if (!yearData) return;

    // Isi semua elemen HTML dengan data yang relevan
    document.getElementById('analysis-title').textContent = `Analisis Detail: Tahun Yudisium ${yearData.tahun_yudisium}`;
    document.getElementById('kpi-graduates').textContent = `${yearData.jumlah_lulusan} Mhs`;
    document.getElementById('kpi-gpa').textContent = yearData.rata_rata_ipk.toFixed(2);
    document.getElementById('kpi-cohort').textContent = yearData.angkatan_dominan;
    document.getElementById('kpi-study-period').textContent = `${yearData.rata_rata_masa_studi} Thn`;
    document.getElementById('context-factors').textContent = yearData.metode_belajar_konteks;
    document.getElementById('narrative-analysis').textContent = yearData.narasi_analisis;

    // Tampilkan area detail yang tadinya tersembunyi
    detailsContainer.classList.remove('hidden');
}

// Jalankan fungsi utama
initializeDashboard();