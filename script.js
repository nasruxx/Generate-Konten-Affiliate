// Menjalankan skrip setelah seluruh konten halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // --- Mengambil Elemen DOM ---
    const generatorForm = document.getElementById('generator-form');
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('results-container');
    const placeholder = document.getElementById('placeholder');
    const loader = document.getElementById('loader');
    const toast = document.getElementById('toast');
    const exportWordBtn = document.getElementById('export-word-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');

    // --- Logika Mode Terang/Gelap ---

    // Fungsi untuk menerapkan tema dan mengganti ikon
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        }
    };

    // Event listener untuk tombol ganti tema
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // Mengatur tema awal saat halaman dimuat
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);


    // --- Logika Form ---
    generatorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(generatorForm);
        const productLink = formData.get('product-link');
        const style = formData.get('style');
        const length = formData.get('length');
        const count = parseInt(formData.get('count'), 10);

        // Memperbarui UI untuk proses loading
        placeholder.classList.add('hidden');
        resultsContainer.innerHTML = ''; 
        loader.style.display = 'flex';
        generateBtn.disabled = true;
        generateBtn.textContent = 'Memproses...';
        exportWordBtn.classList.add('hidden');

        try {
            // Mensimulasikan panggilan API untuk membuat setiap skrip
            const promises = [];
            for (let i = 0; i < count; i++) {
                promises.push(generateSingleScript(productLink, style, length));
            }
            
            const results = await Promise.all(promises);
            
            // Menampilkan hasil
            loader.style.display = 'none';
            results.forEach((result, index) => {
                const card = createResultCard(result, index + 1);
                resultsContainer.appendChild(card);
            });

            if (results.length > 0) {
                exportWordBtn.classList.remove('hidden');
            }

        } catch (error) {
            console.error('Error generating scripts:', error);
            loader.style.display = 'none';
            resultsContainer.innerHTML = `
                <div class="text-center py-12 px-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Terjadi Kesalahan</h3>
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">Gagal membuat script. Silakan coba lagi nanti.</p>
                </div>`;
        } finally {
            // Mengaktifkan kembali tombol
            generateBtn.disabled = false;
            generateBtn.textContent = 'Buatkan Script Sekarang!';
        }
    });

    /**
     * Mensimulasikan panggilan AI untuk membuat satu skrip.
     * Menggunakan template untuk demonstrasi.
     */
    async function generateSingleScript(productLink, style, length) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const productKeywords = productLink.split('/').pop().replace(/-/g, ' ').replace(/_/g, ' ');

        const titles = {
            "Persuasif & Mendesak": `Jangan Sampai Kehabisan! ${productKeywords.toUpperCase()} Diskon Terbatas!`,
            "Informatif & Edukatif": `Pahami Manfaat ${productKeywords} untuk Kebutuhan Anda`,
            "Santai & Relatable": `Nemuin ${productKeywords} ini, auto-checkout gak sih?`,
            "Storytelling": `Awalnya Ragu, Tapi Setelah Coba ${productKeywords}, Hidupku Berubah...`,
            "Mewah & Eksklusif": `Tingkatkan Gayamu dengan ${productKeywords} Edisi Terbatas`
        };

        const contents = {
            "Pendek (untuk Tweet/IG Story)": `Cari ${productKeywords}? Ini solusinya! Kualitas premium, harga bersahabat. Stok terbatas, jangan sampai nyesel!`,
            "Sedang (untuk Postingan Facebook/IG)": `Sering pusing cari ${productKeywords} yang pas? Kenalin nih produk andalan yang udah banyak direview positif! Dibuat dari bahan terbaik, dijamin awet dan fungsional. Pas banget buat kamu yang... (sebutkan target audiens). Lagi ada promo spesial lho!`,
            "Panjang (untuk Blog/Email)": `Dalam memilih ${productKeywords}, ada beberapa hal yang perlu diperhatikan: kualitas, harga, dan ulasan pengguna. Produk ini berhasil mencentang semua kotak tersebut. Setelah riset mendalam, kami menemukan bahwa ${productKeywords} ini tidak hanya unggul dari segi spesifikasi, tetapi juga memberikan nilai lebih bagi penggunanya. Mari kita bedah lebih dalam keunggulannya... (lanjutkan dengan detail).`
        };
        
        const ctas = {
            "Persuasif & Mendesak": "Klaim Diskon & Beli Sekarang!",
            "Informatif & Edukatif": "Pelajari Lebih Lanjut & Cek Detailnya",
            "Santai & Relatable": "Cek di sini deh, racun banget!",
            "Storytelling": "Lihat Perubahannya & Dapatkan Milikmu",
            "Mewah & Eksklusif": "Miliki Sekarang & Jadilah Bagian dari Eksklusivitas"
        };

        let selectedContent = '';
        if (length.includes('Pendek')) selectedContent = contents["Pendek (untuk Tweet/IG Story)"];
        else if (length.includes('Sedang')) selectedContent = contents["Sedang (untuk Postingan Facebook/IG)"];
        else selectedContent = contents["Panjang (untuk Blog/Email)"];

        return {
            title: titles[style] || `Rekomendasi Terbaik: ${productKeywords}`,
            content: selectedContent,
            cta: ctas[style] || "Cek Produknya di Sini!"
        };
    }

    /**
     * Membuat elemen HTML untuk satu kartu hasil.
     */
    function createResultCard(result, index) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg fade-in';
        
        const fullText = `Judul: ${result.title}\n\nKonten:\n${result.content}\n\nCTA: ${result.cta}`;

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <h3 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2 pr-4">${result.title}</h3>
                <span class="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">#${index}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 whitespace-pre-wrap my-4">${result.content}</p>
            <p class="font-semibold text-gray-800 dark:text-gray-100 mt-4">${result.cta}</p>
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button class="copy-btn text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    Salin Teks
                </button>
            </div>
        `;
        
        card.querySelector('.copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(fullText).then(() => {
                showToast('Teks berhasil disalin!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
                showToast('Gagal menyalin teks.', true);
            });
        });

        return card;
    }

    // --- Fungsi Utilitas ---
    function showToast(message, isError = false) {
        toast.textContent = message;
        if (isError) {
            toast.classList.add('bg-red-600', 'dark:bg-red-500');
            toast.classList.remove('bg-gray-900', 'dark:bg-white');
        } else {
            toast.classList.remove('bg-red-600', 'dark:bg-red-500');
            toast.classList.add('bg-gray-900', 'dark:bg-white');
        }
        toast.classList.remove('opacity-0');
        setTimeout(() => {
            toast.classList.add('opacity-0');
        }, 2000);
    }

    // --- Logika Ekspor ke Word ---
    exportWordBtn.addEventListener('click', () => {
        let content = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>Export HTML to Word Document</title>
            <style>
                body { font-family: 'Arial', sans-serif; }
                h1 { color: #1E40AF; }
                h2 { color: #1D4ED8; border-bottom: 1px solid #DDD; padding-bottom: 5px; }
                p { margin-bottom: 15px; }
                strong { color: #333; }
            </style>
            </head>
            <body>
                <h1>Hasil Script Konten Afiliasi</h1>
                <p>Dibuat pada: ${new Date().toLocaleString('id-ID')}</p>
                <hr/>
        `;

        const cards = resultsContainer.querySelectorAll('.fade-in');
        cards.forEach((card, index) => {
            const title = card.querySelector('h3').innerText;
            const scriptContent = card.querySelector('p.text-gray-600').innerText;
            const cta = card.querySelector('p.font-semibold').innerText;
            
            content += `
                <h2>Script #${index + 1}: ${title}</h2>
                <p>${scriptContent.replace(/\n/g, '<br>')}</p>
                <p><strong>CTA: ${cta}</strong></p>
                <br/>
            `;
        });

        content += '</body></html>';

        const blob = new Blob([content], { type: 'application/msword' });
        saveAs(blob, 'script-afiliasi.doc');
        showToast('Dokumen Word sedang diunduh.');
    });

});

